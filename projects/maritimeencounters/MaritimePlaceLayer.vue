<script setup>
import { ref, onMounted, defineProps, toRaw, watch, nextTick } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import { mapStore } from "@/stores/store";
import { maritimeencountersStore } from "./store";
import { storeToRefs } from "pinia";
import markerIcon from "@/assets/marker-white.svg";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet.heat";
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
const { startRectangleDraw, showHeatMap, doneFetching } = storeToRefs(store);
const isLoading = ref(false); //spinner visibility
const showDownloadChoice = ref(false);
const drawnRectangleBounds = ref(null);
const drawnRectangleLayer = ref(null);
const drawnItems = ref(null); //drawn bbox rectangle

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
  showConnections: {
    type: Boolean,
    default: false,
  },
});

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

//draw polygons for each country
const renderGeoJSON = (geojsonArray) => {
  geojsonArray.forEach((geojsonItem) => {
    const { name, data, id } = geojsonItem;

    const geoJSONLayer = L.geoJSON(data, {
      style: {
        color: "#ff7800",
        weight: 2,
        opacity: 0.0, //initially hidden
      },
    });

    const layerGroup = L.layerGroup([geoJSONLayer]);

    //add hover event listeners to each polygon
    geoJSONLayer.eachLayer((layer) => {
      const polygon = layer;

      polygon.on('mouseover', () => {
        polygon.setStyle({
          opacity: 0.65, //show polygon on hover
        });
      });

      polygon.on('mouseout', () => {
        polygon.setStyle({
          opacity: 0, //hide polygon when not hovering
        });
      });

      //when clicking on the polygon clear the markers and fetch new data
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

//draw the markers on the map
const fetchData = async (initialUrl, params) => {
  if (abortController) {
    abortController.abort();
    console.log("Previous fetch aborted");
  }

  isLoading.value = true; //show spinner 
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

          fetchedIds.add(featureId); //add id to set to prevent duplicates

          if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates.length === 2) {
            const coords = feature.geometry.coordinates;
            if (!isNaN(coords[0]) && !isNaN(coords[1])) {
              const latLng = L.latLng(coords[1], coords[0]);

              const intensity = 1.5; //default intensity
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
          console.log("Fetch request was aborted");
          return;  //if fetch is aborted
        } else {
          console.error("Error fetching data:", err);
          reject(err);
        }
      }
    }

    if (heatmapLayer.value && heatmapLayer.value._map) {
      heatmapLayer.value.setLatLngs(heatmapPoints.value);
    }
    isLoading.value = false; //hide spinner
    resolve(); //when all pages are processed
    abortController = null;
  });
};

//for downloading site data
const fetchAllSites = async (initialUrl) => {
  let allData = [];
  let nextUrl = initialUrl;

  isLoading.value = true; //show the spinner
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

  isLoading.value = false; //hide the spinner
  return allData;
};

//download the data as a JSON file
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

  const baseUrl = `https://maritime-encounters.dh.gu.se/api/resources/data/`;
  const queryParams = {
    download_format: format,
    in_bbox: bboxString,
    ...props.params,
  };
  const queryString = new URLSearchParams(queryParams).toString();
  const downloadUrl = `${baseUrl}?${queryString}`;

  if (format === "csv") {
    try {
      const res = await fetch(downloadUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("CSV Download Error:", errorData.error);
        return; 
      }
      window.location.href = downloadUrl;
    } catch (err) {
      console.error("error checking CSV data:", err);
      return;
    }
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

      //for each key in the JSON response, trigger a separate file download.
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

watch(
  () => props.params,
  async (newParams) => {
    doneFetching.value = false;

    if (!map.value) {
      await nextTick();
    }
    if (!map.value) {
      console.error("Map is not initialized yet.");
      return;
    }

    //clear existing data
    fetchedIds.clear();
    clearMarkerClusterLayersInBatches();
    heatmapPoints.value = [];
    if (heatmapLayer.value && heatmapLayer.value._map) {
      heatmapLayer.value.setLatLngs([]);
    }

    const baseUrl = `https://maritime-encounters.dh.gu.se/api/resources/search/`;

    await fetchData(baseUrl, { page_size: 500, ...newParams })
      .then(() => {
        console.log("full dataset fetch completed with new params.");
        doneFetching.value = true;
      })
      .catch((err) => {
        console.error("Error during fetching:", err);
      });
  }
);

watch(() => props.showConnections, (newVal) => { //clear lines when showConnections is off
  if (!newVal && polylineLayer.value) {
    toRaw(polylineLayer.value)?.clearLayers();
  }
});

watch( //Download the data
  () => startRectangleDraw.value,
  (newVal) => {
    if (newVal && rectangleDrawer) {
      rectangleDrawer.enable();
      store.startRectangleDraw = false;
    }
  }
);

watch( //toggle visibility between heatmap and marker clusters
  () => showHeatMap.value,
  (newVal) => {
    if (newVal) {
      //show heatmap layer
      if (heatmapLayer.value) {
        if (map.value && !toRaw(map.value).hasLayer(toRaw(heatmapLayer.value))) {
          toRaw(map.value).addLayer(toRaw(heatmapLayer.value));
        }
        toRaw(heatmapLayer.value).setLatLngs(heatmapPoints.value);
      }
      //hide marker clusters
      if (
        map.value &&
        markerClusterGroup.value &&
        toRaw(map.value).hasLayer(toRaw(markerClusterGroup.value))
      ) {
        toRaw(map.value).removeLayer(toRaw(markerClusterGroup.value));
      }
    } else {
      //hide heatmap layer
      if (heatmapLayer.value) {
        if (map.value && toRaw(map.value).hasLayer(toRaw(heatmapLayer.value))) {
          toRaw(map.value).removeLayer(toRaw(heatmapLayer.value));
        }
      }

      //show marker clusters
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

onMounted(async () => {
  const token = await waitForAuthToken(); 

  if (token) {
    map.value = L.map("map", {
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([58.0, 12.0], 9); //gothenburg

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

    // Override _getExpandedVisibleBounds to limit to current map bounds
    markerClusterGroup.value._getExpandedVisibleBounds = function () {
      const rawThis = toRaw(this);
      return rawThis._map.getBounds();
    };

    //initialize heatmap layer
    heatmapLayer.value = L.heatLayer(heatmapPoints.value, { radius: 25 });

    toRaw(map.value)?.addLayer(toRaw(markerClusterGroup.value));

    //fetch bounding box
    const bbox = toRaw(map.value)?.getBounds().toBBoxString();
    const urlWithBBox = `https://maritime-encounters.dh.gu.se/api/resources/search/?in_bbox=${bbox}&page_size=100`;

    //fetch the full dataset after bounding box
    fetchData(urlWithBBox, {})
      .then(() => {
        console.log('bbox fetch completed. Now fetching the full dataset.');
        return fetchData("https://maritime-encounters.dh.gu.se/api/resources/search/?page_size=1000", {});
      })
      .then(() => {
        console.log('Full dataset fetch completed.');
        doneFetching.value = true;
      })
      .catch((err) => {
        console.error("Error during fetching:", err);
      });

    //close any active hover popup before zooming
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
  background-color: #dddddd !important; /* outer circle color */
}

:deep(.marker-cluster-small div) {
  background-color: #d0d0d0 !important; /* inner circle color */
}

/* Medium Clusters */
:deep(.marker-cluster-medium) {
  background-color: rgba(166, 189, 219, 0.6) !important; /* outer circle color */
}

:deep(.marker-cluster-medium div) {
  background-color: rgba(140, 165, 200, 0.6) !important; /* inner circle color */
}

/* Large Clusters */
:deep(.marker-cluster-large) {
  background-color: #6aa7c5 !important; /* outer circle color */
}

:deep(.marker-cluster-large div) {
  background-color: #2b8cbe !important; /* inner circle color */
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
</style>