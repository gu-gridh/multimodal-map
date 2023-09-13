<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import LocalGeoJSONLayer from "@/components/LocalGeoJSONLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-gold.svg";
import markerBlue from "@/assets/marker-blue.svg";
import MapViewGallery from "./MapViewGallery.vue";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import GeoJSON from "ol/format/GeoJSON";

const { categories, years, tags, placesLayerVisible, tagsLayerVisible } = storeToRefs(etruscanStore());

const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
    start_date: years.value[0],
    end_date: years.value[1],
  })
);

const tagParams = computed(() => {
  const tag_set = tags.value[0]; // Assuming that tags always contains at least one element
  return clean({
    tag_set,
  });
});


const visibleAbout = ref(false);
const showGrid = ref(false);
let visited = true; // Store the visited status outside of the hook

onMounted(() => {
  // Check if the "visited" key exists in session storage
  visited = sessionStorage.getItem("visited") === "true"; // Retrieve the visited status from session storage

  if (!visited) {
    // Hide the about component
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  } 
})

const toggleAboutVisibility = async () => {
  console.log('fired')
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};




onMounted(() => {
  const storedShowGrid = localStorage.getItem("showGrid");
  if (storedShowGrid) {
    showGrid.value = JSON.parse(storedShowGrid);
  }
});

watch(showGrid, (newValue) => {
  localStorage.setItem("showGrid", JSON.stringify(newValue));
});
</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center;">
        <div class="ui-mode ui-overlay">
          <button class="item" v-bind:class="{ selected: !showGrid}" v-on:click="showGrid = false;">
          Map
        </button>
        <button class="item" v-bind:class="{ selected: showGrid}" v-on:click="showGrid = true;">
         Gallery
        </button>
      </div>
    </div>

 <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <MainLayout>
    <template #search>
      <button class="item"  @click="toggleAboutVisibility">
            <div
              class="p-1 px-2 clickable category-button"
              style="
                width: 90px;
                text-align: center;
                margin-top: 10px;
                cursor: pointer;
              "
            >More info</div>
          </button>
      <MapViewControls />
    </template>

    <template #background>
      <div class="map-container">
      <MapComponent :min-zoom="10" :max-zoom="18" :restrictExtent="[11.9, 57.72, 11.99, 57.69]" :key="showGrid.toString()"> <!-- 11.9, 42.15, 12.2, 42.4   11.9, 57.72, 11.99, 57.69--> 
        <template #layers>
          <!-- Layer for testing -->
          <DianaPlaceLayer
            v-if="placesLayerVisible"
            path="jubileum/geojson/place/"
            :params="placeParams"
          >
            <ol-style>
              <ol-style-icon
                :src="markerIcon"
                :scale="1.8"
                :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"
              ></ol-style-icon>
            </ol-style>
            <FeatureSelection />
          </DianaPlaceLayer>

          <!-- Local layer for testing -->
          <LocalGeoJSONLayer :zIndex="1">
            <!-- style components -->
          </LocalGeoJSONLayer>
        </template>
      </MapComponent>
      <MapViewGallery v-if="showGrid" />
    </div>
    </template>

    <template #details>
      <MapViewPreview />
    </template>
  </MainLayout>
</template>

<style>
.map-container {
  position: relative;
  width:100%;
}

.ui-overlay {
margin-top: 20px;
z-index: 250;
position:absolute;
border-radius: 8px;
font-size: 18px;
font-weight: 700;
color: white;
margin-left:200px;
background-color: rgb(0, 0, 0, 0.8);
backdrop-filter: blur(3px);
transition: all 0.5s ease-in-out;
}

.ui-mode {
top: 0px;
padding: 4px 10px 4px 10px;
}

.ui-mode .item {
cursor: pointer;
display: inline;
font-weight: 400;
color:rgba(255,255,255,0.5);
padding: 0px 15px 0px 15px;

}

.ui-mode .item:hover {
  color:white;
}

.ui-mode .selected{
font-weight: 500;
color:rgba(255,255,255,1.0);
}

#app .ol-popup {
  font-size: 1.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center;
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
</style>
