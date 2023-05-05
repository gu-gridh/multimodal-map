<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import PlaceDetails from "./PlaceDetails.vue";
import { storeToRefs } from "pinia";
import { jubileumStore } from "./store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-white.svg";
import MasonryGrid from "./MasonryGrid.vue";
import { ref } from "vue";

const { categories } = storeToRefs(jubileumStore());

const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
  })
);

const showGrid = ref(false);

function toggleGrid() {
  showGrid.value = !showGrid.value;
}

</script>

<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>
    <template #background>
      <div class="map-container">
        <button class="toggle-grid-btn" @click="toggleGrid">
          {{ showGrid.value ? "Hide Grid" : "Show Grid" }}
        </button>
        <MapComponent
          :min-zoom="16"
          :max-zoom="18"
          :restrictExtent="[11.922, 57.7215, 11.996, 57.69035]"
        >
          <template #layers>
            <DianaPlaceLayer path="jubileum/geojson/place/" :params="placeParams">
              <ol-style>
                <ol-style-icon
                  :src="markerIcon"
                  :scale="2.0"
                  :displacement="[-10, 45]"
                  :anchor="[0.0, 0.0]"
                ></ol-style-icon>
              </ol-style>
              <FeatureSelection />
            </DianaPlaceLayer>
            <ol-tile-layer>
              <ol-source-xyz
                url="https://data.dh.gu.se/tiles/gbg_1921b/{z}/{x}/{y}.png"
              />
            </ol-tile-layer>
          </template>
        </MapComponent>
        <MasonryGrid v-if="showGrid" />
      </div>
    </template>
    <template #details>
      <PlaceDetails />
    </template>
  </MainLayout>
</template>

<style>
.map-container {
  position: relative;
}

.toggle-grid-btn {
  position: absolute;
  top: 10px;
  left: 50%; 
  transform: translateX(-50%); 
  z-index: 1001;
  background-color: #f8f9e5;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.toggle-grid-btn:hover {
  background-color: #dc8c8c;
  color: white;
}

#app .ol-popup {
  font-size: 1.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center;
  line-height: 1.2;
  position: absolute;
  background-color: white;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px;
  border-radius: 5px;
  border: 0px solid #cccccc;
  bottom: 35px;
  left: -50px;
  min-width: 100px;
}

#app .ol-control button {
  font-family: "Barlow Condensed", sans-serif;
  border-radius: 50% !important;
  background-color: rgb(248, 249, 228) !important;
  color: black !important;
}

#app .ol-control button:hover,
.ol-control button:focus {
  background-color: rgb(220, 140, 140) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}

#app .ol-control button:active {
  background-color: rgb(180, 100, 100) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}
</style>
