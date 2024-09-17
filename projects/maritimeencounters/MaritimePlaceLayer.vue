<script lang="ts" setup>
import { ref, onMounted, defineProps, toRaw } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css"; 
import "leaflet.markercluster/dist/MarkerCluster.Default.css"; 
import markerIcon from "@/assets/marker-white.svg";

const map = ref<L.Map | null>(null);
const markerClusterGroup = ref<L.MarkerClusterGroup | null>(null);
let hoverPopup = ref<L.Popup | null>(null);  //active hover popup

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
});

const fetchData = async (initialUrl: string, params: Record<string, any>) => {
  let nextUrl = initialUrl;
  let initialParams = new URLSearchParams({ page_size: '1000', ...params }).toString();
  if (nextUrl && initialParams) {
    nextUrl = `${nextUrl}?${initialParams}`;
  }

  while (nextUrl) {
    const res = await fetch(nextUrl.replace(/^http:/, "https:")).catch((err) => {
      throw err;
    });

    if (!res) continue;

    const data = await res.json();

    const markersToAdd = [];
    data.features.forEach((feature: any) => {
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

          //show coordinates and name on hover
          marker.on("mouseover", () => {
            //close any existing hover popup
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
  }
};

onMounted(() => {
  map.value = L.map("map", {
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true
  }).setView(props.mapOptions.center, props.mapOptions.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, //11
  }).addTo(toRaw(map.value));

  markerClusterGroup.value = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,  //spiderfy
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 100,
    chunkedLoading: true,  //Enable chunked loading
  });

  // Override _getExpandedVisibleBounds to limit to current map bounds
  markerClusterGroup.value._getExpandedVisibleBounds = function () {
    return toRaw(markerClusterGroup.value)?._map?.getBounds();
  };

  toRaw(map.value)?.addLayer(toRaw(markerClusterGroup.value));

  fetchData("https://maritime-encounters.dh.gu.se/api/resources/site_coordinates", props.params);

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
