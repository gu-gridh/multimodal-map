<script lang="ts" setup>
import { ref, onMounted, defineProps } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css"; 
import "leaflet.markercluster/dist/MarkerCluster.Default.css"; 
import markerIcon from "@/assets/marker-white.svg";

const map = ref<L.Map | null>(null);
const markerClusterGroup = ref<L.MarkerClusterGroup | null>(null);

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

          //popup to each marker
          marker.bindPopup(`<b>Feature ID:</b> ${feature.id}<br><b>Name:</b> ${feature.properties.name}`);

          markerClusterGroup.value?.addLayer(marker);
        }
      }
    });

    nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
  }
};

onMounted(() => {
  map.value = L.map("map").setView(props.mapOptions.center, props.mapOptions.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 11, //19
  }).addTo(map.value);

  markerClusterGroup.value = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,  //spiderfy
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    maxClusterRadius: 100,
  });

  //Override _getExpandedVisibleBounds to limit to current map bounds
  markerClusterGroup.value._getExpandedVisibleBounds = function () {
    return markerClusterGroup.value?._map?.getBounds();
  };

  map.value.addLayer(markerClusterGroup.value);

  fetchData("https://maritime-encounters.dh.gu.se/api/resources/site_coordinates", props.params);
});
</script>

<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>
