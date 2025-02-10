<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import { onMounted, ref, watch } from "vue";
import {useSportsStore} from "./settings/store";

const map = ref(null);

const sportsStore = useSportsStore();

//this is for all types of sports
const travelTimes = ref({
  15: "15_total", 
  30: "30_total", 
  60: "60_total",
});

const mapStyles = ref({
  arcGisTopo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  OSM: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  topPlus: "http://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_grau/default/WEBMERCATOR/{z}/{y}/{x}.png"
})

onMounted(async () => {
  map.value = L.map("map").setView([59.8586, 17.6389], 10); //uppsala

  L.tileLayer(mapStyles.value.OSM, { 
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);
  

  const response = await fetch("./uppsala_t1.geojson");
  const geojsonData = await response.json();

  console.log("GeoJSON Loaded:", geojsonData);

  const utm33n = "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";

  const allLatLngPolygons = []; 


  geojsonData.features.forEach((feature) => { 
    if (feature.properties.mode == sportsStore.travelMode){ // this can be chaneged to car/bike/walking or ALL but that will put them on top of each other
      const geometry = feature.geometry;

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          const latLngPolygon = polygon[0].map((coord) => {
            const [lon, lat] = proj4(utm33n, "WGS84", coord); //convert UTM to WGS84
            return [lat, lon]; //flip latitude and longitude
          });

          allLatLngPolygons.push(latLngPolygon);

          //set polygon color depending on value of number of unique activities
          const time = feature.properties[travelTimes.value[sportsStore.travelTime]]; //set the time value to be displayed
          if (time === null || time === 0) { // no activites
            L.polygon(latLngPolygon, { 
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.6,
              weight: 1,
            }).addTo(map.value);
          }
          else if (time > 0 && time < 6) { // low activites 1-6
            L.polygon(latLngPolygon, {
              color: "yellow",
              fillColor: "yellow",
              fillOpacity: 0.6,
              weight: 1,
            }).addTo(map.value);
          }
          else if (time >= 6 && time < 10) { // medium activites 6-10
            L.polygon(latLngPolygon, {
              color: "orange",
              fillColor: "orange",
              fillOpacity: 0.6,
              weight: 1,
            }).addTo(map.value);
          }
          
          else {
            L.polygon(latLngPolygon, { // high activites 10+
              color: "red",
              fillColor: "red",
              fillOpacity: 0.6,
              weight: 1,
            }).addTo(map.value);
          }
        });
      }
    }

  });

  //fit the map bounds
  const bounds = L.polygon(allLatLngPolygons.flat()).getBounds();
  map.value.fitBounds(bounds);
});

//watch for store updates
watch(() => sportsStore, () => {
  //redraw map
});

</script>
