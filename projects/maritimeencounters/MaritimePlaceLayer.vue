<script setup>
import { ref, onMounted, defineProps, toRaw, watch, nextTick, computed } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import { mapStore } from "@/stores/store";
import { maritimeencountersStore } from "./store";
import API_ENDPOINTS from "./apiConfig";
import { storeToRefs } from "pinia";
import markerIcon from "@/assets/marker-white.svg";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet.heat";
import { useCompareMode, RESOURCE_COLORS, RESOURCE_LABELS } from "./useCompareMode";
import alandData from './polygons/aland_simplified.json';
import belgiumData from './polygons/belgium_simplified.json';
import czechData from './polygons/czech_simplified.json';
import denmarkData from './polygons/denmark_simplified.json';
import finlandData from './polygons/finland_simplified.json';
import franceData from './polygons/france_simplified.json';
import germanyData from './polygons/germany_simplified.json';
import irelandData from './polygons/ireland_simplified.json';
import netherlandsData from './polygons/netherlands_simplified.json';
import norwayData from './polygons/norway_simplified.json';
import polandData from './polygons/poland_simplified.json';
import portugalData from './polygons/portugal_simplified.json';
import russiaData from './polygons/russia_simplified.json';
import spainData from './polygons/spain_simplified.json';
import swedenData from './polygons/sweden_simplified.json';
import ukData from './polygons/uk_simplified.json';

(window).type = true;

const map = ref(null);
const markerClusterGroup = ref(null);
const layerGroupMap = ref({});
const fetchedIds = new Set();
const { selectedFeature } = storeToRefs(mapStore());
const store = maritimeencountersStore();
const { startRectangleDraw, showHeatMap, doneFetching, compareMode, commonSitesData } = storeToRefs(store);
const isLoading = ref(false);
const showDownloadChoice = ref(false);
const drawnRectangleBounds = ref(null);
const drawnRectangleLayer = ref(null);
const drawnItems = ref(null);

//Heatmap
const heatmapLayer = ref(null);
const heatmapPoints = ref([]);

let hoverPopup = ref(null);
let polylineLayer = ref(null);
let abortController = null;
let rectangleDrawer = null;

const props = defineProps({
  mapOptions: {
    type: Object,
    default: () => ({
      center: [51.505, -0.09],
      zoom: 3,
    }),
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  compareParams: {
    type: Object,
    default: null,
  },
  showConnections: {
    type: Boolean,
    default: false,
  },
});

// ---- Auth helper ----

const waitForAuthToken = () => {
  return new Promise((resolve) => {
    const checkToken = () => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        resolve(token);
      } else {
        setTimeout(checkToken, 100);
      }
    };
    checkToken();
  });
};

// ---- Compare mode (delegated to composable) ----

const compare = useCompareMode(
  map, markerClusterGroup, heatmapLayer, hoverPopup, isLoading, waitForAuthToken, props,
);
const { activeTypes: activeCompareTypes } = compare;

// ---- Marker cluster helpers ----

function clearMarkerClusterLayersInBatches() {
  const layers = toRaw(markerClusterGroup.value)?.getLayers();
  if (layers && layers.length > 0) {
    const batchSize = 1000;
    let index = 0;

    function removeNextBatch() {
      const batch = layers.slice(index, index + batchSize);
      toRaw(markerClusterGroup.value)?.removeLayers(batch);
      index += batchSize;
      if (index < layers.length) {
        setTimeout(removeNextBatch, 0);
      }
    }

    removeNextBatch();
  }
}

// ---- Country polygon overlay ----

const renderGeoJSON = (geojsonArray) => {
  geojsonArray.forEach((geojsonItem) => {
    const { name, data, id } = geojsonItem;

    const geoJSONLayer = L.geoJSON(data, {
      style: {
        color: "#ff7800",
        weight: 2,
        opacity: 0.0,
      },
    });

    const layerGroup = L.layerGroup([geoJSONLayer]);

    geoJSONLayer.eachLayer((layer) => {
      const polygon = layer;

      polygon.on('mouseover', () => {
        polygon.setStyle({ opacity: 0.65 });
      });

      polygon.on('mouseout', () => {
        polygon.setStyle({ opacity: 0 });
      });

      polygon.on('click', async () => {
        const bounds = polygon.getBounds();
        toRaw(map.value)?.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 8,
        });
      });
    });

    layerGroup.addTo(toRaw(map.value));
    layerGroupMap.value[name] = layerGroup;
  });
};

// ---- Data fetching ----

const fetchData = async (initialUrl, params) => {
  if (abortController) {
    abortController.abort();
  }

  isLoading.value = true;
  abortController = new AbortController();
  const signal = abortController.signal;

  return new Promise(async (resolve, reject) => {
    let nextUrl = initialUrl;
    let initialParams = new URLSearchParams({ ...params }).toString();
    if (nextUrl && initialParams) {
      nextUrl = `${nextUrl}?${initialParams}`;
    }

    const token = await waitForAuthToken();

    while (nextUrl) {
      try {
        const res = await fetch(nextUrl.replace(/^http:/, "https:"), {
          signal, headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        const markersToAdd = [];
        data.features.forEach((feature) => {
          const featureId = feature.id;

          if (fetchedIds.has(featureId)) return;
          fetchedIds.add(featureId);

          if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates.length === 2) {
            const coords = feature.geometry.coordinates;
            if (!isNaN(coords[0]) && !isNaN(coords[1])) {
              const latLng = L.latLng(coords[1], coords[0]);

              const intensity = 1.5;
              heatmapPoints.value.push([coords[1], coords[0], intensity]);

              const marker = L.marker(latLng, {
                icon: L.icon({
                  iconUrl: markerIcon,
                  iconSize: [30, 45],
                }),
              });

              marker.on("click", () => {
                selectedFeature.value = featureId;
              });

              marker.on("mouseover", () => {
                if (hoverPopup.value) {
                  toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
                }

                hoverPopup.value = L.popup({
                  closeButton: false,
                  offset: L.point(0, -30),
                })
                  .setLatLng(latLng)
                  .setContent(
                    `<b>Name:</b> ${feature.properties.name}<br><b>Coordinates:</b> ${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`
                  )
                  .openOn(toRaw(map.value));

                marker.on("mouseout", () => {
                  toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
                  hoverPopup.value = null;
                });
              });

              markersToAdd.push(marker);
            }
          }
        });

        toRaw(markerClusterGroup.value)?.addLayers(markersToAdd);

        nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        } else {
          console.error("Error fetching data:", err);
          reject(err);
        }
      }
    }

    if (heatmapLayer.value && heatmapLayer.value._map) {
      heatmapLayer.value.setLatLngs(heatmapPoints.value);
    }
    isLoading.value = false;
    resolve();
    abortController = null;
  });
};

// ---- Download helpers ----

const fetchAllSites = async (initialUrl) => {
  let allData = [];
  let nextUrl = initialUrl;

  isLoading.value = true;
  const token = sessionStorage.getItem("authToken");

  while (nextUrl) {
    try {
      const res = await fetch(nextUrl.replace(/^http:/, "https:"), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      allData = allData.concat(data.features);
      nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  }

  isLoading.value = false;
  return allData;
};

const downloadJSON = (data, filename) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

const handleDownloadChoice = async (format) => {
  showDownloadChoice.value = false;

  if (!drawnRectangleBounds.value) return;

  const bounds = drawnRectangleBounds.value;
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();
  const bboxString = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`;
  const token = await waitForAuthToken();

  if (drawnRectangleLayer.value && drawnItems.value) {
    drawnItems.value.removeLayer(drawnRectangleLayer.value);
    drawnRectangleLayer.value = null;
  }
  drawnRectangleBounds.value = null;

  const baseUrl = API_ENDPOINTS.DATA;
  const queryParams = {
    download_format: format,
    in_bbox: bboxString,
    ...props.params,
  };

  let downloadUrl = `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;

  if (format === "csv") {
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const res = await fetch(downloadUrl, {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/zip"
        }
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("CSV Download Error:", res.status, msg);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_csv.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("error downloading CSV:", err);
    }

    return;
  } else if (format === "json") {
    try {
      const res = await fetch(downloadUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        }
      });

      if (!res.ok) throw new Error("failed to fetch JSON data");

      const jsonData = await res.json();

      let delay = 0;
      for (const key in jsonData) {
        if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
          const fileData = jsonData[key];
          const filename = key.toLowerCase() + ".json";
          setTimeout(() => {
            downloadJSON(fileData, filename);
          }, delay);
          delay += 500;
        }
      }
    } catch (error) {
      console.error("error fetching JSON data.", error);
    }
  }
};

// ---- Watchers ----

watch(
  () => props.params,
  async (newParams) => {
    if (compareMode.value || !newParams) return;

    doneFetching.value = false;

    if (!map.value) {
      await nextTick();
    }
    if (!map.value) {
      console.error("Map is not initialized yet.");
      return;
    }

    fetchedIds.clear();
    clearMarkerClusterLayersInBatches();
    heatmapPoints.value = [];
    if (heatmapLayer.value && heatmapLayer.value._map) {
      heatmapLayer.value.setLatLngs([]);
    }

    const baseUrl = API_ENDPOINTS.SEARCH;

    await fetchData(baseUrl, { page_size: 500, ...newParams })
      .then(() => {
        doneFetching.value = true;
      })
      .catch((err) => {
        console.error("Error during fetching:", err);
      });
  }
);

watch(() => props.showConnections, (newVal) => {
  if (!newVal && polylineLayer.value) {
    toRaw(polylineLayer.value)?.clearLayers();
  }
});

watch(
  () => startRectangleDraw.value,
  (newVal) => {
    if (newVal && rectangleDrawer) {
      rectangleDrawer.enable();
      store.startRectangleDraw = false;
    }
  }
);

watch(
  () => showHeatMap.value,
  (newVal) => {
    if (newVal) {
      if (heatmapLayer.value) {
        if (map.value && !toRaw(map.value).hasLayer(toRaw(heatmapLayer.value))) {
          toRaw(map.value).addLayer(toRaw(heatmapLayer.value));
        }
        toRaw(heatmapLayer.value).setLatLngs(heatmapPoints.value);
      }
      if (
        map.value &&
        markerClusterGroup.value &&
        toRaw(map.value).hasLayer(toRaw(markerClusterGroup.value))
      ) {
        toRaw(map.value).removeLayer(toRaw(markerClusterGroup.value));
      }
    } else {
      if (heatmapLayer.value) {
        if (map.value && toRaw(map.value).hasLayer(toRaw(heatmapLayer.value))) {
          toRaw(map.value).removeLayer(toRaw(heatmapLayer.value));
        }
      }
      if (
        map.value &&
        markerClusterGroup.value &&
        !toRaw(map.value).hasLayer(toRaw(markerClusterGroup.value))
      ) {
        toRaw(map.value).addLayer(toRaw(markerClusterGroup.value));
      }
    }
  }
);

// Compare mode watchers are handled by the composable
compare.setupWatchers();

// ---- Mount ----

onMounted(async () => {
  const token = await waitForAuthToken();

  if (token) {
    map.value = L.map("map", {
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([58.0, 12.0], 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      minZoom: 3,
    }).addTo(toRaw(map.value));

    drawnItems.value = L.featureGroup().addTo(toRaw(map.value));
    const drawControl = new L.Control.Draw({
      draw: {
        marker: false,
        circle: false,
        circlemarker: false,
        polygon: false,
        polyline: false,
        rectangle: false,
      }
    });

    toRaw(map.value)?.addControl(drawControl);

    rectangleDrawer = new L.Draw.Rectangle(toRaw(map.value), drawControl.options.draw.rectangle);

    toRaw(map.value)?.on(L.Draw.Event.CREATED, (e) => {
      const layerType = e.layerType;
      const layer = e.layer;

      if (layerType === "rectangle") {
        drawnRectangleLayer.value = layer;
        drawnRectangleBounds.value = layer.getBounds();
        showDownloadChoice.value = true;
        drawnItems.value?.addLayer(e.layer);
      }
    });

    const geojsonFiles = [
      { name: "Denmark", data: denmarkData, id: "2" },
      { name: "Sweden", data: swedenData, id: "10" },
      { name: "Germany", data: germanyData, id: "1" },
      { name: "Norway", data: norwayData, id: "7" },
      { name: "Finland", data: finlandData, id: "4" },
      { name: "UK", data: ukData, id: "6" },
      { name: "Portugal", data: portugalData, id: "9" },
      { name: "Poland", data: polandData, id: "8" },
      { name: "Ireland", data: irelandData, id: "11" },
      { name: "France", data: franceData, id: "5" },
      { name: "Netherlands", data: netherlandsData, id: "16" },
      { name: "Belgium", data: belgiumData, id: "15" },
      { name: "Czech", data: czechData, id: "13" },
      { name: "Aland", data: alandData, id: "14" },
      { name: "Russia", data: russiaData, id: "12" },
      { name: "Spain", data: spainData, id: "3" },
    ];

    renderGeoJSON(geojsonFiles);

    markerClusterGroup.value = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 100,
      chunkedLoading: true,
      iconCreateFunction: function (cluster) {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';

        if (childCount < 10) {
          c += 'small';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'large';
        }

        return L.divIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(40, 40),
        });
      },
    });

    markerClusterGroup.value._getExpandedVisibleBounds = function () {
      const rawThis = toRaw(this);
      return rawThis._map.getBounds();
    };

    heatmapLayer.value = L.heatLayer(heatmapPoints.value, { radius: 25 });

    // Initialize compare mode layers via composable
    compare.initLayers();

    toRaw(map.value)?.addLayer(toRaw(markerClusterGroup.value));

    const bbox = toRaw(map.value)?.getBounds().toBBoxString();
    const urlWithBBox = `${API_ENDPOINTS.SEARCH}?in_bbox=${bbox}&page_size=100`;

    fetchData(urlWithBBox, {})
      .then(() => {
        return fetchData(`${API_ENDPOINTS.SEARCH}?page_size=1000`, {});
      })
      .then(() => {
        doneFetching.value = true;
      })
      .catch((err) => {
        console.error("Error during fetching:", err);
      });

    toRaw(map.value)?.on('zoomstart', () => {
      if (hoverPopup.value) {
        toRaw(map.value)?.closePopup(toRaw(hoverPopup.value));
        hoverPopup.value = null;
      }
    });
  }
});
</script>

<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
  <div v-if="isLoading" class="download-spinner">
    <img src="@/assets/interface/bars-rotate-fade.svg" alt="Loading..." />
  </div>

  <!-- Compare Mode Legend -->
  <div v-if="compareMode && activeCompareTypes.length > 0" class="compare-legend">
    <div class="compare-legend-title">Resource Types</div>
    <div v-for="type in activeCompareTypes" :key="type" class="compare-legend-item">
      <span class="compare-legend-dot" :style="{ background: RESOURCE_COLORS[type] }"></span>
      <span class="compare-legend-label">{{ RESOURCE_LABELS[type] }}</span>
    </div>
    <div v-if="commonSitesData && commonSitesData.features" class="compare-legend-count">
      {{ commonSitesData.features.length }} site{{ commonSitesData.features.length !== 1 ? 's' : '' }} found
    </div>
    <div v-else-if="isLoading" class="compare-legend-count">Loading...</div>
  </div>

  <!-- Download Choice -->
  <div v-if="showDownloadChoice" class="download-choice-modal">
    <div class="modal-content">
      <h3>Select Download Format</h3>
      <button @click="handleDownloadChoice('csv')">CSV</button>
      <button @click="handleDownloadChoice('json')">JSON</button>
    </div>
  </div>
</template>

<style scoped>
.download-spinner {
  position: absolute;
  top: 10px;
  right: 0px;
  width: 50px;
  height: 50px;
  z-index: 9999;
}

/* Small Clusters */
:deep(.marker-cluster-small) {
  background-color: #dddddd !important;
}

:deep(.marker-cluster-small div) {
  background-color: #d0d0d0 !important;
}

/* Medium Clusters */
:deep(.marker-cluster-medium) {
  background-color: rgba(166, 189, 219, 0.6) !important;
}

:deep(.marker-cluster-medium div) {
  background-color: rgba(140, 165, 200, 0.6) !important;
}

/* Large Clusters */
:deep(.marker-cluster-large) {
  background-color: #6aa7c5 !important;
}

:deep(.marker-cluster-large div) {
  background-color: #2b8cbe !important;
}

.download-choice-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 20px;
}

.modal-content button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: var(--theme-3);
  color: white;
  font-size: 16px;
}

.modal-content button:hover {
  background: var(--theme-4);
}

/* Compare Mode Styles */
:deep(.compare-marker-icon) {
  background: none !important;
  border: none !important;
}

:deep(.compare-cluster) {
  background-color: rgba(231, 76, 60, 0.5) !important;
}

:deep(.compare-cluster div) {
  background-color: rgba(231, 76, 60, 0.7) !important;
  color: white !important;
}

.compare-legend {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 12px 16px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  min-width: 140px;
}

.compare-legend-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
  color: #333;
}

.compare-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}

.compare-legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.compare-legend-label {
  font-size: 12px;
  color: #555;
}

.compare-legend-divider {
  height: 1px;
  background: #ddd;
  margin: 8px 0;
}

.compare-legend-count {
  font-size: 11px;
  color: #888;
  margin-top: 6px;
  text-align: center;
}
</style>
