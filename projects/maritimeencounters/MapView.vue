<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import MaritimePlaceLayer from "./MaritimePlaceLayer.vue";
import GeoJsonWebGLRenderer from "@/components/GeoJsonWebGLRenderer.vue";
import FeatureSelection from "./FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { maritimeencountersStore } from "./store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-white.svg";
import MapViewGallery from "./MapViewGallery.vue";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import GeoJSON from "ol/format/GeoJSON";
import Title from "./Title.vue"
import apiConfig from "./apiConfig"

const { categories, tags, selectedRange, showUnknownRange, tagsLayerVisible, dataSetValue, dataParams, imgParams } = storeToRefs(maritimeencountersStore());
const store = mapStore();
const maritimeencounters = maritimeencountersStore();  // Get the instance of maritimeencountersStore
const { selectedFeature } = storeToRefs(store);
const minZoom = 5;
const maxZoom = 22;
const featureZoom = 15; //value between minZoom and maxZoom when you select a point;
const visibleAbout = ref(false);
const showGallery = ref(false);
let visited = true; // Store the visited status outside of the hook

// Watcher for selectedFeature changes
watch(
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry as any).getCoordinates();
        store.updateCenter(coordinates);
        if (store.zoom < featureZoom)
          {          
            store.updateZoom(featureZoom);
          }
      }
    }
  },
  { immediate: true }
);

// Watcher for selectedNecropolisCoordinates changes
// watch(
//   selectedNecropolisCoordinates,
//   (newCoordinates, oldCoordinates) => {
//     if (newCoordinates !== oldCoordinates && newCoordinates) {
//       store.updateCenter(newCoordinates);
//       store.updateZoom(16);
//     }
//   },
// );

/* Response for generating the URL for filtering map points down */
const tagParams = computed(() => {
  // const necropolis = necropoli.value[0];
  // const type = tombType.value[0];
  const dataset = dataSetValue.value[0];
  const selectedRangeValue = selectedRange.value;
  const show_unknown = showUnknownRange.value;

  const initialParams: any  = { dataset, show_unknown: show_unknown.toString() };

   if (selectedRangeValue.length === 2) {
    initialParams.minyear = Math.round(Math.abs(selectedRangeValue[0]));
    initialParams.maxyear = Math.round(Math.abs(selectedRangeValue[1]));
  }
  
  // Remove parameters that are set to "all"
  const cleanedParams = Object.keys(initialParams)
  .filter((key) => initialParams[key as keyof typeof initialParams] !== "all")
  .reduce((obj, key) => {
    obj[key as keyof typeof initialParams] = initialParams[key as keyof typeof initialParams];
    return obj;
  }, {} as typeof initialParams);
  
  // Further clean to remove null or undefined values
  const params = clean(cleanedParams);

  //filter for just 3D points
  // if (enable3D.value) {
  //   (params as any)['with_3D'] = 'true';
  // } else {
  //   delete (params as any)['with_3D'];
  // }

  // if (enablePlan.value) {
  //   (params as any)['with_plan'] = 'true';
  // } else {
  //   delete (params as any)['with_plan'];
  // }

  maritimeencounters.imgParams = params;
  return params;
});

watch(
  tagParams, 
  (newParams) => {
    dataParams.value = newParams;
  }, 
  { immediate: true }
);

onMounted(() => {
  // Check if the "visited" key exists in session storage
  visited = sessionStorage.getItem("visited") === "true"; // Retrieve the visited status from session storage
  const storedShowGallery = localStorage.getItem("showGallery");

  if (!visited) {
    // Hide the about component
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  }

  if (storedShowGallery) {
    showGallery.value = JSON.parse(storedShowGallery);
  }

})

const toggleAboutVisibility = async () => {
  console.log('fired')
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

watch(showGallery, (newValue) => {
  localStorage.setItem("showGallery", JSON.stringify(newValue));
});
</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay">
      <!-- <button class="item" v-bind:class="{ selected: !showGallery }" v-on:click="showGallery = false;">
        {{ $t('map') }}
      </button>
      <button class="item" v-bind:class="{ selected: showGallery }" v-on:click="showGallery = true;">
        {{ $t('gallery') }}
      </button> -->
    </div>
  </div>
  <MapViewGallery v-if="showGallery" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <MainLayout>
    <template #search>
      <Title @toggle-about="toggleAboutVisibility" />
      <!-- <MapViewControls/> -->
    </template>

    <template #background>
      <div class="map-container">
        <MapComponent 
          :shouldAutoMove="true" 
          :min-zoom=minZoom
          :max-zoom=maxZoom 
          :restrictExtent="[-27.5, 35.10, 24.6, 66.0]"    
        > 
          <template #layers>
            <GeoJsonWebGLRenderer
              :externalUrl="'https://data.dh.gu.se/geography/SGElevationMain.geojson'"
              :zIndex=-0
              :style="{
                'stroke-color': [0, 0, 0, 0.18],
                'stroke-width': 1,
                'fill-color': [255, 0, 0, 1]
              }"
            >
            </GeoJsonWebGLRenderer>
            <GeoJsonWebGLRenderer
              :externalUrl="'https://data.dh.gu.se/geography/SGElevationEdge.geojson'"
              :zIndex=0
              :style="{
                'stroke-color': [0, 0, 0, 0.1],
                'stroke-width': 1,
                'fill-color': [0, 255, 0, 1]
              }"
            >
            </GeoJsonWebGLRenderer>
             <MaritimePlaceLayer :params="tagParams" :zIndex=20>
             </MaritimePlaceLayer> 
          </template>
          
        </MapComponent>  
      </div> 
    </template>

    <template #details>
      <MapViewPreview v-if="!showGallery"/>
    </template>

  </MainLayout>
</template>

<style>
.map-container {
  height: calc(100vh - 80px) !important;
  position: relative;
  width: 100%;
}

/* Overides the settings in ui_modules.css */
#app .ol-popup {
  left: -55px;
  width: 110px;
  min-width: 90px;
  bottom:55px;
}

#app .ol-popup:before {
  left: 30px;
}
</style>
