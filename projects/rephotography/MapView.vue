<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-gold.svg";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";

const { categories, years, tags } = storeToRefs(rephotographyStore());
// tags add here

const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
    start_date: years.value[0],
    end_date: years.value[1],
  })

// tags: tags.value.join(","),  

);
const visibleAbout = ref(false);
let visited = false; // Store the visited status outside of the hook

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

watch(tags, (newTags) => {
  console.log("Tags changed:", newTags);
});
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
      <MapComponent :min-zoom="9" :max-zoom="16" :restrictExtent="[0.0, 75.0, 30.0, 81.0]" >
        <template #layers>
          <NpolarLayer
            capabilitiesUrl="https://geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Ortofoto_Svalbard_WMTS_25833/MapServer/WMTS/1.0.0/WMTSCapabilities.xml"
          />

          <DianaPlaceLayer
            path="rephotography/geojson/place/"
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
        </template>
      </MapComponent>
    </template>

    <template #details>
      <MapViewPreview />
    </template>
  </MainLayout>
</template>

<style>

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
