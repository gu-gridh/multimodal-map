<script lang="ts" setup>
import { ref, onMounted, defineProps, toRaw, watch } from "vue";
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

(window as any).type = true;

const map = ref<L.Map | null>(null);
const markerClusterGroup = ref<L.MarkerClusterGroup | null>(null);
const layerGroupMap = ref<Record<string, L.LayerGroup>>({});
const fetchedIds = new Set<number>();
const { selectedFeature } = storeToRefs(mapStore());
const store = maritimeencountersStore();
const { startRectangleDraw, showHeatMap, doneFetching } = storeToRefs(store);
const isDownloading = ref(false); //spinner visibility

// Heatmap
const heatmapLayer = ref<L.HeatLayer | null>(null);
const heatmapPoints = ref<Array<[number, number, number]>>([]);

let hoverPopup = ref<L.Popup | null>(null); //active hover popup
let polylineLayer = ref<L.LayerGroup | null>(null);
let abortController: AbortController | null = null;
let rectangleDrawer: L.Draw.Rectangle | null = null;

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
const renderGeoJSON = (geojsonArray: { name: string, data: any, id: string }[]) => {
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
      const polygon = layer as L.Polygon;

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

    layerGroup.addTo(toRaw(map.value)!);
    layerGroupMap.value[name] = layerGroup;
  });
};

//draw the markers on the map
const fetchData = async (initialUrl: string, params: Record<string, any>) => {
  if (abortController) {
    abortController.abort();
    console.log("Previous fetch aborted");
  }

  abortController = new AbortController();
  const signal = abortController.signal;

  return new Promise(async (resolve, reject) => {
    let nextUrl = initialUrl;
    let initialParams = new URLSearchParams({ ...params }).toString();
    if (nextUrl && initialParams) {
      nextUrl = `${nextUrl}?${initialParams}`;
    }

    while (nextUrl) {
      try {
        const res = await fetch(nextUrl.replace(/^http:/, "https:"), { signal });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        const markersToAdd = [];
        data.features.forEach((feature: any) => {
          const featureId = feature.id;

          if (fetchedIds.has(featureId)) return;

          fetchedIds.add(featureId); // add id to set to prevent duplicates

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
                  .openOn(toRaw(map.value) as L.Map);

                marker.on("mouseout", () => {
                  toRaw(map.value)?.closePopup(toRaw(hoverPopup.value) as L.Popup);
                  hoverPopup.value = null;
                });
              });

              markersToAdd.push(marker);
            }
          }
        });

        toRaw(markerClusterGroup.value)?.addLayers(markersToAdd);

        nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
      } catch (err: any) {
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
    resolve(); //when all pages are processed
    abortController = null;
  });
};

//for downloading site data
const fetchAllSites = async (initialUrl: string): Promise<any[]> => {
  let allData: any[] = [];
  let nextUrl: string | null = initialUrl;

  isDownloading.value = true; //show the spinner

  while (nextUrl) {
    try {
      const res = await fetch(nextUrl.replace(/^http:/, "https:"));
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      allData = allData.concat(data.features);

      nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
        }
      }

  isDownloading.value = false; //hide the spinner
  return allData;
};

//download the data as a JSON file
const downloadJSON = (data: any, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
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

watch(() => props.showConnections, (newVal) => {  //clear lines when showConnections is off
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
      },
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
  map.value = L.map("map", {
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true,
    // zoomControl: false,
  }).setView([58.0, 12.0], 9); //gothenburg

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 3,
  }).addTo(toRaw(map.value)!);

  const drawnItems = L.featureGroup().addTo(toRaw(map.value)!);
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

  rectangleDrawer = new L.Draw.Rectangle(toRaw(map.value)!, drawControl.options.draw.rectangle);

  toRaw(map.value)?.on(L.Draw.Event.CREATED, async function (e: any) {
    const layerType = e.layerType;
    const layer = e.layer;

    if (layerType === "rectangle") {
      const bounds: L.LatLngBounds = layer.getBounds();

      //convert bounds to bbox string
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      const bboxString = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`;
      const baseUrl = `https://maritime-encounters.dh.gu.se/api/resources/search/`;
      const params = { in_bbox: bboxString, page_size: 100, ...props.params };
      const queryString = new URLSearchParams(params).toString();
      const apiUrl = `${baseUrl}?${queryString}`;

      try {
        const jsonData = await fetchAllSites(apiUrl);

        downloadJSON(jsonData, 'data.json');

        //remove the rectangle from the map
        drawnItems.removeLayer(layer);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  });

  const geojsonFiles = [
    { name: "Denmark", url: "./polygons/denmark_simplified.json", id: "2" },
    { name: "Sweden", url: "./polygons/sweden_simplified.json", id: "10" },
    { name: "Germany", url: "./polygons/germany_simplified.json", id: "1" },
    { name: "Norway", url: "./polygons/norway_simplified.json", id: "7" },
    { name: "Finland", url: "./polygons/finland_simplified.json", id: "4" },
    { name: "UK", url: "./polygons/uk_simplified.json", id: "6" },
    { name: "Portugal", url: "./polygons/portugal_simplified.json", id: "9" },
    { name: "Poland", url: "./polygons/poland_simplified.json", id: "8" },
    { name: "Ireland", url: "./polygons/ireland_simplified.json", id: "11" },
    { name: "France", url: "./polygons/france_simplified.json", id: "5" },
    { name: "Netherlands", url: "./polygons/netherlands_simplified.json", id: "16" },
    { name: "Belgium", url: "./polygons/belgium_simplified.json", id: "15" },
    { name: "Czech", url: "./polygons/czech_simplified.json", id: "13" },
    { name: "Aland", url: "./polygons/aland_simplified.json", id: "14" },
    { name: "Russia", url: "./polygons/russia_simplified.json", id: "12" },
    { name: "Spain", url: "./polygons/spain_simplified.json", id: "3" },
  ];

  try {
    const geojsonArray = await Promise.all(
      geojsonFiles.map(async (file) => {
        const response = await fetch(file.url);
        const data = await response.json();
        return { name: file.name, data, id: file.id };
      })
    );

    //render the countries
    renderGeoJSON(geojsonArray);
  } catch (error) {
    console.error("Error fetching GeoJSON files:", error);
  }

  markerClusterGroup.value = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 100,
    chunkedLoading: true,
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
});
</script>

<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
  <div v-if="isDownloading" class="download-spinner">
    <img src="@/assets/interface/bars-rotate-fade.svg" alt="Loading..." />
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
</style>
