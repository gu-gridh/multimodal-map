<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import { onMounted, ref, watch } from "vue";
import { useSportsStore } from "./settings/store";

const map = ref(null);
const sportsStore = useSportsStore();
const geojsonData = ref(null);
const layerGroup = ref(null); // Stores the active layer group

const travelTimes = ref({
  15: "15_total",
  30: "30_total",
  60: "60_total",
});

const mapStyles = ref({
  arcGisTopo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  OSM: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  topPlus: "http://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_grau/default/WEBMERCATOR/{z}/{y}/{x}.png",
});

onMounted(async () => {
  await initMap();
});

// Watch for store updates and refresh the map layer
watch(
  () => [sportsStore.travelTime, sportsStore.travelMode],
  () => {
    updateMapLayer();
  }
);

const initMap = async () => {
  map.value = L.map("map").setView([59.8586, 17.6389], 10); // Uppsala

  L.tileLayer(mapStyles.value.OSM, {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  // Load GeoJSON data
  const response = await fetch("./uppsala_t1.geojson");
  geojsonData.value = await response.json();
  console.log("GeoJSON Loaded:", geojsonData.value);

  // Initialize layer group
  layerGroup.value = L.layerGroup().addTo(map.value);

  // Draw polygons
  updateMapLayer();
};

//  update the map layer dynamically
const updateMapLayer = () => {
  if (!map.value || !geojsonData.value) return;

  // Clear previous layers
  layerGroup.value.clearLayers();

  const utm33n = "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";
  const allLatLngPolygons = [];

  geojsonData.value.features.forEach((feature) => {
    if (feature.properties.mode === sportsStore.travelMode) {
      const geometry = feature.geometry;

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          const latLngPolygon = polygon[0].map((coord) => {
            const [lon, lat] = proj4(utm33n, "WGS84", coord); // Convert UTM to WGS84
            return [lat, lon]; // Flip latitude and longitude
          });

          allLatLngPolygons.push(latLngPolygon);

          const time = feature.properties[travelTimes.value[sportsStore.travelTime]];

          L.polygon(latLngPolygon, {
            color: "white",
            fillColor: setColor(time),
            fillOpacity: 0.7,
            weight: 1,
            dashArray: "2, 2",
          }).addTo(layerGroup.value);
        });
      }
    }
  });

  // Fit the map bounds to new polygons
  if (allLatLngPolygons.length > 0) {
    const bounds = L.polygon(allLatLngPolygons.flat()).getBounds();
    map.value.fitBounds(bounds);
  }
};

// determine polygon color based on amount of activities
const setColor = (time) => {
  return time === null || time === 0 ? "blue" : time > 0 && time < 6 ? "yellow" : time >= 6 && time < 10 ? "orange" : "red";
};
</script>

<style scoped>
.legend {
  line-height: 18px;
  color: #555;
  padding-bottom: 20px;
  background-color: white !important;
}
.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

#map.leaflet-container {
  height: calc(100vh - 80px) !important;
}
</style>
