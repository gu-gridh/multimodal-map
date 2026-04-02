import { ref, computed, watch, toRaw } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
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
  const { compareMode, commonSitesData } = storeToRefs(store);

  const compareCluster = ref(null);
  let abortController = null;

  const activeTypes = computed(() => {
    if (!props.compareParams || !props.compareParams.type) return [];
    return props.compareParams.type.split(",");
  });

  // ---- Init ----

  function initLayers() {
    compareCluster.value = L.markerClusterGroup({
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      iconCreateFunction(cluster) {
        const count = cluster.getChildCount();
        let sizeClass = "small";
        if (count >= 100) sizeClass = "large";
        else if (count >= 10) sizeClass = "medium";
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster marker-cluster-${sizeClass} compare-cluster`,
          iconSize: L.point(40, 40),
        });
      },
    });
  }

  function clearLayers() {
    if (compareCluster.value) toRaw(compareCluster.value).clearLayers();
  }

  // ---- SVG pie-chart icon for individual sites ----

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

  // ---- Popup ----

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

  // ---- Render ----

  function render(geoJson) {
    if (!mapRef.value || !compareCluster.value) return;
    clearLayers();
    const features = geoJson.features || [];
    if (!features.length) return;

    const markers = [];
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

      markers.push(marker);
    });

    toRaw(compareCluster.value).addLayers(markers);
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
    watch(
      () => compareMode.value,
      (on) => {
        if (!mapRef.value) return;
        const raw = toRaw(mapRef.value);

        if (on) {
          // Hide normal markers & heatmap
          if (markerClusterRef.value && raw.hasLayer(toRaw(markerClusterRef.value)))
            raw.removeLayer(toRaw(markerClusterRef.value));
          if (heatmapRef.value && raw.hasLayer(toRaw(heatmapRef.value)))
            raw.removeLayer(toRaw(heatmapRef.value));
          // Show compare cluster
          if (compareCluster.value && !raw.hasLayer(toRaw(compareCluster.value)))
            raw.addLayer(toRaw(compareCluster.value));
        } else {
          // Hide compare cluster
          clearLayers();
          if (compareCluster.value && raw.hasLayer(toRaw(compareCluster.value)))
            raw.removeLayer(toRaw(compareCluster.value));
          // Restore normal markers
          if (markerClusterRef.value && !raw.hasLayer(toRaw(markerClusterRef.value)))
            raw.addLayer(toRaw(markerClusterRef.value));
          store.commonSitesData = null;
        }
      },
    );

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
  }

  return { initLayers, setupWatchers, activeTypes, RESOURCE_COLORS, RESOURCE_LABELS };
}
