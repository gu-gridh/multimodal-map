<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import proj4 from "proj4";
import { onMounted, ref } from "vue";

const map = ref(null);


onMounted(async () => {
  map.value = L.map("map").setView([59.8586, 17.6389], 10); //uppsala

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    minZoom: 3,
  }).addTo(map.value);

  const response = await fetch("./uppsala_t1.geojson");
  const geojsonData = await response.json();

  console.log("GeoJSON Loaded:", geojsonData);

  const utm33n = "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";

  const allLatLngPolygons = []; 

  geojsonData.features.forEach((feature) => { //only show sustainable data // this can be chaneged to car/bike/walking or ALL but that will put them on top of each other
    if (feature.properties.mode == "sustainable"){ 
      const geometry = feature.geometry;

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          const latLngPolygon = polygon[0].map((coord) => {
            const [lon, lat] = proj4(utm33n, "WGS84", coord); //convert UTM to WGS84
            return [lat, lon]; //flip latitude and longitude
          });

          allLatLngPolygons.push(latLngPolygon);

          //set polygon color depending on value of dd_15_min_total // this can be changed to other values
          const dd_15 = feature.properties.dd_15_min_;
          if (dd_15 === null || dd_15 === 0) {
            L.polygon(latLngPolygon, {
              color: "whitee",
              fillColor: "white",
              fillOpacity: 0.4,
              weight: 1,
            }).addTo(map.value);
          }
          else if (dd_15 > 0 && dd_15 < 6) {
            L.polygon(latLngPolygon, {
              color: "yellow",
              fillColor: "yellow",
              fillOpacity: 0.4,
              weight: 1,
            }).addTo(map.value);
          }
          else if (dd_15 >= 6 && dd_15 < 10) {
            L.polygon(latLngPolygon, {
              color: "orange",
              fillColor: "orange",
              fillOpacity: 0.4,
              weight: 1,
            }).addTo(map.value);
          }
          
          else {
            L.polygon(latLngPolygon, {
              color: "red",
              fillColor: "red",
              fillOpacity: 0.4,
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
</script>
