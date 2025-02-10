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

const geojsonData = ref(null);

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
  initMap();
});

//watch for store updates
watch(() => sportsStore.travelTime, () => {
  console.log("Travel time changed to", sportsStore.travelTime);

});

const initMap = async () => {
  map.value = L.map("map").setView([59.8586, 17.6389], 10); //uppsala

  L.tileLayer(mapStyles.value.OSM, { 
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);


  const response = await fetch("./uppsala_t1.geojson");
  geojsonData.value = await response.json();

  console.log("GeoJSON Loaded:", geojsonData);

  const utm33n = "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs";

  const allLatLngPolygons = []; 


  geojsonData.value.features.forEach((feature) => { 
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

            L.polygon(latLngPolygon, { 
              color: "white",
              fillColor: setColor(time),
              fillOpacity: 0.4,
              weight: 1,
              dashArray: "2, 2"
            }).addTo(map.value);
          

        });
      }


  }

});

        //add legend
        // const legend = L.control({ position: "bottomright" });
        // legend.onAdd = function (map) {
        //   const div = L.DomUtil.create("div", "info legend");
        //   const grades = [0, 6, 10];
        //   const labels = [];
        //   for (let i = 0; i < grades.length; i++) {
        //     div.innerHTML += 
        //       '<i style="background:' + setColor(grades[i] + 1) + '"></i> ' +
        //       grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")
            
        //   }
        //   return div;
        // };
        // legend.addTo(map.value);

//fit the map bounds
const bounds = L.polygon(allLatLngPolygons.flat()).getBounds();
map.value.fitBounds(bounds);
};

const setColor = (time) => {
  return time === null || time === 0 ? "blue" : time > 0 && time < 6 ? "yellow" : time >= 6 && time < 10 ? "orange" : "red";
}

</script>

<style scoped>
.legend {
    line-height: 18px;
    color: #555;
    padding-bottom: 20px ;
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
