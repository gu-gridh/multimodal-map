import { ref, computed, watch, toRaw } from "vue";
import L from "leaflet";
import { storeToRefs } from "pinia";
import { maritimeencountersStore } from "./store";
import { mapStore } from "@/stores/store";
import API_ENDPOINTS from "./apiConfig";

// Resource type colors & labels
export const RESOURCE_COLORS = {
  radiocarbon_dates: "#e74c3c",
  individual_samples: "#3498db",
  dna_samples: "#2ecc71",
  metal_analysis: "#f39c12",
  landing_points: "#9b59b6",
  new_samples: "#1abc9c",
  lnhouses: "#e67e22",
  boats: "#2980b9",
};

export const RESOURCE_LABELS = {
  radiocarbon_dates: "Radiocarbon",
  individual_samples: "Samples",
  dna_samples: "DNA",
  metal_analysis: "Metal",
  landing_points: "Landing",
  new_samples: "New Samples",
  lnhouses: "Houses",
  boats: "Boats",
};

/**
 * Composable that owns all compare-mode map logic.
 *
 * @param {import('vue').Ref} mapRef       – reactive ref to the Leaflet map instance
 * @param {import('vue').Ref} markerClusterRef – reactive ref to the normal marker cluster group
 * @param {import('vue').Ref} heatmapRef   – reactive ref to the heatmap layer
 * @param {import('vue').Ref} hoverPopupRef – reactive ref shared with the main layer
 * @param {import('vue').Ref} isLoadingRef – reactive ref controlling the spinner
 * @param {Function} waitForAuthToken      – function returning a Promise<string>
 * @param {Object} props                   – component props (compareParams)
 */
export function useCompareMode(
  mapRef,
  markerClusterRef,
  heatmapRef,
  hoverPopupRef,
  isLoadingRef,
  waitForAuthToken,
  props,
) {
  const store = maritimeencountersStore();
  const { selectedFeature } = storeToRefs(mapStore());
  const { compareMode, commonSitesData, clusterRadius } = storeToRefs(store);

  const markerGroup = ref(null);
  const areaGroup = ref(null);
  let abortController = null;

  // Which types are currently selected (derived from compareParams prop)
  const activeTypes = computed(() => {
    if (!props.compareParams || !props.compareParams.type) return [];
    return props.compareParams.type.split(",");
  });

  // ---- Leaflet layer helpers ----

  function initLayers() {
    markerGroup.value = L.layerGroup();
    areaGroup.value = L.layerGroup();
  }

  function clearLayers() {
    if (markerGroup.value) toRaw(markerGroup.value).clearLayers();
    if (areaGroup.value) toRaw(areaGroup.value).clearLayers();
  }

  // ---- SVG pie-chart icon ----

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const s = polarToCartesian(cx, cy, r, endAngle);
    const e = polarToCartesian(cx, cy, r, startAngle);
    const large = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} Z`;
  }

  function createIcon(resourceCounts) {
    const types = Object.keys(resourceCounts);
    const n = types.length;
    const size = 32 + n * 4;
    const half = size / 2;

    const segments = types
      .map((t, i) => {
        const color = RESOURCE_COLORS[t] || "#666";
        const a0 = (360 / n) * i;
        const a1 = (360 / n) * (i + 1);
        return `<path d="${describeArc(half, half, half - 2, a0, a1)}" fill="${color}" stroke="white" stroke-width="1"/>`;
      })
      .join("");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${segments}
      <circle cx="${half}" cy="${half}" r="${half / 2}" fill="white" stroke="#333" stroke-width="1"/>
      <text x="${half}" y="${half + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">${n}</text>
    </svg>`;

    return L.divIcon({
      html: svg,
      className: "compare-marker-icon",
      iconSize: [size, size],
      iconAnchor: [half, half],
    });
  }

  // ---- Popup builder ----

  function popupContent(feature) {
    const p = feature.properties;
    const counts = p.resource_counts || {};
    const badges = Object.entries(counts)
      .map(([type, count]) => {
        const c = RESOURCE_COLORS[type] || "#666";
        const l = RESOURCE_LABELS[type] || type;
        return `<span style="display:inline-block;padding:2px 8px;margin:2px;border-radius:10px;background:${c};color:white;font-size:11px;">${l}: ${count}</span>`;
      })
      .join("");
    return `<div style="min-width:160px"><b>${p.name || "Unknown Site"}</b><br/><div style="margin-top:4px">${badges}</div></div>`;
  }

  // ---- Geo helpers ----

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function cluster(features, radiusKm) {
    const pts = features.map((f) => ({
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      feature: f,
    }));
    const visited = new Set();
    const clusters = [];

    for (let i = 0; i < pts.length; i++) {
      if (visited.has(i)) continue;
      const group = [pts[i]];
      visited.add(i);

      for (let j = i + 1; j < pts.length; j++) {
        if (visited.has(j)) continue;
        if (group.some((p) => haversine(p.lat, p.lng, pts[j].lat, pts[j].lng) <= radiusKm)) {
          group.push(pts[j]);
          visited.add(j);
        }
      }
      if (group.length >= 2) clusters.push(group);
    }
    return clusters;
  }

  function convexHull(points) {
    if (points.length < 3) return points;
    let lowest = 0;
    for (let i = 1; i < points.length; i++) {
      if (
        points[i][0] < points[lowest][0] ||
        (points[i][0] === points[lowest][0] && points[i][1] < points[lowest][1])
      ) {
        lowest = i;
      }
    }
    [points[0], points[lowest]] = [points[lowest], points[0]];
    const pivot = points[0];
    const sorted = points.slice(1).sort((a, b) => {
      return (
        Math.atan2(a[0] - pivot[0], a[1] - pivot[1]) -
        Math.atan2(b[0] - pivot[0], b[1] - pivot[1])
      );
    });
    const hull = [pivot, sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      while (
        hull.length > 1 &&
        (hull[hull.length - 1][1] - hull[hull.length - 2][1]) *
          (sorted[i][0] - hull[hull.length - 2][0]) -
          (hull[hull.length - 1][0] - hull[hull.length - 2][0]) *
            (sorted[i][1] - hull[hull.length - 2][1]) <=
          0
      ) {
        hull.pop();
      }
      hull.push(sorted[i]);
    }
    return hull;
  }

  // ---- Render ----

  function renderMarkers(features) {
    features.forEach((f) => {
      if (!f.geometry?.coordinates) return;
      const [lng, lat] = f.geometry.coordinates;
      if (isNaN(lat) || isNaN(lng)) return;

      const icon = createIcon(f.properties.resource_counts || {});
      const marker = L.marker([lat, lng], { icon });

      marker.on("click", () => {
        selectedFeature.value = f.id;
      });
      marker.on("mouseover", () => {
        if (hoverPopupRef.value) toRaw(mapRef.value)?.closePopup(toRaw(hoverPopupRef.value));
        hoverPopupRef.value = L.popup({ closeButton: false, offset: L.point(0, -20), maxWidth: 300 })
          .setLatLng([lat, lng])
          .setContent(popupContent(f))
          .openOn(toRaw(mapRef.value));
      });
      marker.on("mouseout", () => {
        toRaw(mapRef.value)?.closePopup(toRaw(hoverPopupRef.value));
        hoverPopupRef.value = null;
      });

      toRaw(markerGroup.value)?.addLayer(marker);
    });
  }

  function renderAreas(features) {
    if (!mapRef.value || !areaGroup.value) return;
    const radiusKm = clusterRadius.value;
    const groups = cluster(features, radiusKm);

    groups.forEach((grp) => {
      const avgLat = grp.reduce((s, p) => s + p.lat, 0) / grp.length;
      const avgLng = grp.reduce((s, p) => s + p.lng, 0) / grp.length;
      let maxDist = 0;
      grp.forEach((p) => {
        const d = haversine(avgLat, avgLng, p.lat, p.lng);
        if (d > maxDist) maxDist = d;
      });
      const highlightRadius = Math.max(maxDist * 1.3, 5) * 1000;

      if (grp.length >= 3) {
        const hull = convexHull(grp.map((p) => [p.lat, p.lng]));
        const poly = L.polygon(hull, {
          color: "#e74c3c",
          weight: 2,
          opacity: 0.6,
          fillColor: "#e74c3c",
          fillOpacity: 0.1,
          dashArray: "5,5",
        });
        poly.bindTooltip(`${grp.length} common sites in this area`, {
          sticky: true,
          className: "compare-area-tooltip",
        });
        toRaw(areaGroup.value)?.addLayer(poly);
      }

      const circle = L.circle([avgLat, avgLng], {
        radius: highlightRadius,
        color: "#3498db",
        weight: 1.5,
        opacity: 0.4,
        fillColor: "#3498db",
        fillOpacity: 0.07,
      });
      circle.bindTooltip(
        `${grp.length} common sites within ${Math.round(maxDist || radiusKm)} km`,
        { sticky: true, className: "compare-area-tooltip" },
      );
      toRaw(areaGroup.value)?.addLayer(circle);
    });
  }

  function render(geoJson) {
    if (!mapRef.value) return;
    clearLayers();
    const features = geoJson.features || [];
    if (!features.length) return;
    renderMarkers(features);
    renderAreas(features);
  }

  // ---- Fetch ----

  async function fetchSites(params) {
    if (abortController) abortController.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    isLoadingRef.value = true;
    store.commonSitesLoading = true;

    const token = await waitForAuthToken();
    const qs = new URLSearchParams({ page_size: 500, ...params }).toString();
    let all = [];
    let url = `${API_ENDPOINTS.COMMON_SITES}?${qs}`;

    try {
      while (url) {
        const res = await fetch(url.replace(/^http:/, "https:"), {
          signal,
          headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        });
        if (!res.ok) {
          console.error(`Common sites API error ${res.status}:`, await res.text());
          throw new Error(`Failed: ${res.status}`);
        }
        const data = await res.json();
        if (data.features) all = all.concat(data.features);
        url = data.next ? data.next.replace(/^http:/, "https:") : null;
      }

      const geoJson = { type: "FeatureCollection", features: all };
      store.commonSitesData = geoJson;
      render(geoJson);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error fetching common sites:", err);
    } finally {
      isLoadingRef.value = false;
      store.commonSitesLoading = false;
      abortController = null;
    }
  }

  // ---- Watchers ----

  function setupWatchers() {
    // Toggle compare mode on/off
    watch(
      () => compareMode.value,
      (on) => {
        if (!mapRef.value) return;
        const raw = toRaw(mapRef.value);

        if (on) {
          if (markerClusterRef.value && raw.hasLayer(toRaw(markerClusterRef.value)))
            raw.removeLayer(toRaw(markerClusterRef.value));
          if (heatmapRef.value && raw.hasLayer(toRaw(heatmapRef.value)))
            raw.removeLayer(toRaw(heatmapRef.value));
          if (markerGroup.value && !raw.hasLayer(toRaw(markerGroup.value)))
            raw.addLayer(toRaw(markerGroup.value));
          if (areaGroup.value && !raw.hasLayer(toRaw(areaGroup.value)))
            raw.addLayer(toRaw(areaGroup.value));
        } else {
          clearLayers();
          if (markerGroup.value && raw.hasLayer(toRaw(markerGroup.value)))
            raw.removeLayer(toRaw(markerGroup.value));
          if (areaGroup.value && raw.hasLayer(toRaw(areaGroup.value)))
            raw.removeLayer(toRaw(areaGroup.value));
          if (markerClusterRef.value && !raw.hasLayer(toRaw(markerClusterRef.value)))
            raw.addLayer(toRaw(markerClusterRef.value));
          store.commonSitesData = null;
        }
      },
    );

    // Re-fetch when compare params change
    watch(
      () => props.compareParams,
      async (p) => {
        if (!p || !mapRef.value) {
          clearLayers();
          return;
        }
        await fetchSites(p);
      },
    );

    // Re-draw areas when cluster radius changes
    watch(
      () => clusterRadius.value,
      () => {
        if (compareMode.value && commonSitesData.value?.features) {
          if (areaGroup.value) toRaw(areaGroup.value).clearLayers();
          renderAreas(commonSitesData.value.features);
        }
      },
    );
  }

  return { initLayers, setupWatchers, activeTypes, RESOURCE_COLORS, RESOURCE_LABELS };
}
