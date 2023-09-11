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
</script>

<template>
 <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <MainLayout>
    <template #search>
      <button class="item"  @click="toggleAboutVisibility">
            <div
              class="p-1 px-2 clickable category-button"
              style="
                width: 90px;
                text-align: center;
                margin-top: -10px;
                cursor: pointer;
              "
            >More info</div>
          </button>
      <MapViewControls />
    </template>

    <template #background>
      <div class="map-container">
      <MapComponent :min-zoom="10" :max-zoom="18" :restrictExtent="[11.9, 57.72, 11.99, 57.69]" > <!-- 11.9, 42.15, 12.2, 42.4   11.9, 57.72, 11.99, 57.69--> 
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
