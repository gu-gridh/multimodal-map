import { ref, watch, toRaw } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import { storeToRefs } from "pinia";
import { maritimeencountersStore } from "./store";
import { mapStore } from "@/stores/store";

// Distinct colours, handed out in the order the site types are listed so the
// same type keeps its colour in the checklist, the markers and the legend.
const PALETTE = [
  "#e6194b", "#4363d8", "#3cb44b", "#f58231", "#911eb4", "#42d4f4",
  "#f032e6", "#9a6324", "#469990", "#800000", "#000075", "#808000",
];

export function typeColor(text) {
  const index = maritimeencountersStore().siteTypes.findIndex((t) => t.text === text);
  return index === -1 ? "#666" : PALETTE[index % PALETTE.length];
}

export function useCompareMode(mapRef, markerClusterRef, heatmapRef, hoverPopupRef) {
  const store = maritimeencountersStore();
  const { selectedFeature } = storeToRefs(mapStore());
  const { compareMode } = storeToRefs(store);

  const compareCluster = ref(null);

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

  function createIcon(types) {
    const n = types.length;
    const size = 32 + n * 4;
    const half = size / 2;

    const segments = types
      .map((t, i) => {
        const a0 = (360 / n) * i;
        const a1 = (360 / n) * (i + 1);
        return `<path d="${describeArc(half, half, half - 2, a0, a1)}" fill="${typeColor(t)}" stroke="white" stroke-width="1"/>`;
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

  function popupContent(site) {
    const badges = site.types
      .map((t) => `<span style="display:inline-block;padding:2px 8px;margin:2px;border-radius:10px;background:${typeColor(t)};color:white;font-size:11px;">${t}</span>`)
      .join("");
    return `<div style="min-width:160px"><b>${site.name || "Unknown Site"}</b><br/><div style="margin-top:4px">${badges}</div></div>`;
  }

  // ---- Render ----

  // Draws the given sites as pies split into the compared types.
  function render(sites, types) {
    if (!mapRef.value || !compareCluster.value) return;
    clearLayers();

    const icon = createIcon(types);
    const markers = sites.map((site) => {
      const marker = L.marker([site.lat, site.lng], { icon });

      marker.on("click", () => {
        selectedFeature.value = site.id;
      });
      marker.on("mouseover", () => {
        if (hoverPopupRef.value) toRaw(mapRef.value)?.closePopup(toRaw(hoverPopupRef.value));
        hoverPopupRef.value = L.popup({ closeButton: false, offset: L.point(0, -20), maxWidth: 300 })
          .setLatLng([site.lat, site.lng])
          .setContent(popupContent(site))
          .openOn(toRaw(mapRef.value));
      });
      marker.on("mouseout", () => {
        toRaw(mapRef.value)?.closePopup(toRaw(hoverPopupRef.value));
        hoverPopupRef.value = null;
      });

      return marker;
    });

    toRaw(compareCluster.value).addLayers(markers);
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
        }
      },
    );
  }

  return { initLayers, setupWatchers, render };
}
