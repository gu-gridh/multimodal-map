<script lang="ts" setup>
import { ref, onMounted, defineProps, toRaw, watch } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css"; 
import "leaflet.markercluster/dist/MarkerCluster.Default.css"; 
import markerIcon from "@/assets/marker-white.svg";

const map = ref<L.Map | null>(null);
const markerClusterGroup = ref<L.MarkerClusterGroup | null>(null);
const layerGroupMap = ref<Record<string, L.LayerGroup>>({});
const fetchedIds = new Set<number>();
const { selectedFeature } = storeToRefs(mapStore());

let hoverPopup = ref<L.Popup | null>(null);  //active hover popup
let polylineLayer = ref<L.LayerGroup | null>(null);
let abortController: AbortController | null = null;

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

//coordinates to draw lines to
const targetCoordinates = [
  L.latLng(4.1129, 2.5911),
  L.latLng(70.81392, 27.96125),
  L.latLng(53.1258, -9.7681),
  L.latLng(48.8427, 8.0221)
];

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
          maxZoom: 10,
        });

        //clear markers
        toRaw(markerClusterGroup.value)?.clearLayers();
        fetchedIds.clear();

        //fetch new data based on the clicked country's ID
        const url = `https://maritime-encounters.dh.gu.se/api/resources/site_coordinates/?ADM0=${id}&page_size=1000`;

        try {
          await fetchData(url, {});
        } catch (error) {
          console.error("Error fetching data for country ID:", id, error);
        }
      });
    });

    layerGroup.addTo(toRaw(map.value)!);
    layerGroupMap.value[name] = layerGroup;
  });
};

//draw lines to the specified coordinates for testing
const drawConnections = (startLatLng: L.LatLng) => {
  const lines = targetCoordinates.map(targetLatLng => 
    L.polyline([startLatLng, targetLatLng], { color: 'red' })
  );

  if (!polylineLayer.value) {
    polylineLayer.value = L.layerGroup().addTo(toRaw(map.value)!);
  }
  polylineLayer.value.clearLayers();
  lines.forEach(line => polylineLayer.value?.addLayer(line));
};

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

              const marker = L.marker(latLng, {
                icon: L.icon({
                  iconUrl: markerIcon,
                  iconSize: [30, 45],
                }),
              });

              marker.on("click", () => {
                selectedFeature.value = featureId;

                if (props.showConnections && coords[1] === 55.99446 && coords[0] === 55.99446) {
                  drawConnections(latLng);
                }
              });

              marker.on("mouseover", () => {
                if (hoverPopup.value) {
                  toRaw(map.value)?.closePopup(hoverPopup.value);
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

      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch request was aborted");
          return; //if fetch is aborted
        } else {
          console.error("Error fetching data:", err);
          reject(err);
        }
      }
    }

    resolve(); //when all pages are processed
    abortController = null;
  });
};

watch(() => props.showConnections, (newVal) => {  //clear lines when showConnections is off
  if (!newVal && polylineLayer.value) {
    polylineLayer.value.clearLayers(); 
  }
});

onMounted(async () => {
  map.value = L.map("map", {
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true
  }).setView([58.0, 12.0], 9); //gothenburg

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 3
  }).addTo(toRaw(map.value));

  const geojsonFiles = [
    { name: "Denmark", url: "./polygons/denmark_simplified.json",  id:"2"}, 
    { name: "Sweden", url: "./polygons/sweden_simplified.json",  id:"10" }, 
    { name: "Germany", url: "./polygons/germany_simplified.json",  id:"1"},
    { name: "Norway", url: "./polygons/norway_simplified.json",  id:"7" },
    { name: "Finland", url: "./polygons/finland_simplified.json",  id:"4"},
    { name: "UK", url: "./polygons/uk_simplified.json",  id:"6"},
    { name: "Portugal", url: "./polygons/portugal_simplified.json",  id:"9"},
    { name: "Poland", url: "./polygons/poland_simplified.json",  id:"8" },
    { name: "Ireland", url: "./polygons/ireland_simplified.json",  id:"11" },
    { name: "France", url: "./polygons/france_simplified.json",  id:"5" },
    { name: "Netherlands", url: "./polygons/netherlands_simplified.json",  id:"16"},
    { name: "Belgium", url: "./polygons/belgium_simplified.json",  id:"15"},
    { name: "Czech", url: "./polygons/czech_simplified.json",  id:"13"},
    { name: "Aland", url: "./polygons/aland_simplified.json",  id:"14"},
    { name: "Russia", url: "./polygons/russia_simplified.json",  id:"12"},
    { name: "Spain", url: "./polygons/spain_simplified.json",  id:"3"},
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
    return toRaw(markerClusterGroup.value)?._map?.getBounds();
  };

  toRaw(map.value)?.addLayer(toRaw(markerClusterGroup.value));

  //fetch bounding box
  const bbox = map.value?.getBounds().toBBoxString();
  const urlWithBBox = `https://maritime-encounters.dh.gu.se/api/resources/site_coordinates/?in_bbox=${bbox}&page_size=100`;

  //fetch the full dataset after bounding box
  fetchData(urlWithBBox, {})
    .then(() => {
      console.log('bbox fetch completed. Now fetching the full dataset.');
      return fetchData("https://maritime-encounters.dh.gu.se/api/resources/site_coordinates?page_size=1000", {});
    })
    .then(() => {
      console.log('Full dataset fetch completed.');
    })
    .catch(err => {
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
</template>
