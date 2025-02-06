<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMounted, ref } from "vue";

const map = ref(null);

onMounted(async () => {
  map.value = L.map("map").setView([59.8586, 17.6389], 10); //Uppsala
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 3,
  }).addTo(map.value);

  // const response = await fetch("./uppsala_t1.geojson");
  // const geojsonData = await response.json();
  // console.log(geojsonData.features[0].geometry);
  // L.geoJSON(geojsonData).addTo(map.value);
});
</script>
