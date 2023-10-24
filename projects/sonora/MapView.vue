<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponentRwanda.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayerEtruscan.vue";
import GeoJsonWebGLRenderer from "@/components/GeoJsonWebGLRenderer.vue";
import FeatureSelection from "./FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
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

const { categories, tags, necropoli, tombType, placesLayerVisible, tagsLayerVisible, dataParams, selectedNecropolisCoordinates, enable3D } = storeToRefs(etruscanStore());
const store = mapStore();
const { selectedFeature } = storeToRefs(store);
const minZoom = 9;
const maxZoom = 20;
const featureZoom = 16; //value between minZoom and maxZoom when you select a point 
const visibleAbout = ref(false);
const showGrid = ref(false);
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
watch(
  selectedNecropolisCoordinates,
  (newCoordinates, oldCoordinates) => {
    if (newCoordinates !== oldCoordinates && newCoordinates) {
      store.updateCenter(newCoordinates);
      store.updateZoom(16);
    }
  },
);

/* Response for generating the URL for filtering map points down */
const tagParams = computed(() => {
  const epoch = tags.value[0];
  const necropolis = necropoli.value[0];
  const type = tombType.value[0];

  const initialParams = { epoch, necropolis, type };
  
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
  if (enable3D.value) {
    params['with_3D'] = 'true';
  } else {
    delete params['with_3D'];
  }

  // Convert the params object to a URL search string
  const queryString = new URLSearchParams(params).toString();

  // Concatenate the base URL with the search string to form the full URL
  const fullUrl = queryString ? 
    `https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page_size=500&${queryString}` :
    `https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page_size=500`;

  console.log("Generated URL:", fullUrl); // Debug line
  
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
  const storedShowGrid = localStorage.getItem("showGrid");

  if (!visited) {
    // Hide the about component
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  }

  if (storedShowGrid) {
    showGrid.value = JSON.parse(storedShowGrid);
  }

})

const toggleAboutVisibility = async () => {
  console.log('fired')
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

watch(showGrid, (newValue) => {
  localStorage.setItem("showGrid", JSON.stringify(newValue));
});
</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay">
      <button class="item" v-bind:class="{ selected: !showGrid }" v-on:click="showGrid = false;">
        Karta
      </button>
      <button class="item" v-bind:class="{ selected: showGrid }" v-on:click="showGrid = true;">
       Galleri
      </button>
    </div>
  </div>
  <MapViewGallery v-if="showGrid" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <MainLayout>
    <template #search>
      <Title @toggle-about="toggleAboutVisibility" />
      <MapViewControls/>
    </template>

    <template #background>
      <div class="map-container">
        <MapComponent 
          :shouldAutoMove="true" 
          :min-zoom=minZoom
          :max-zoom=maxZoom 
            
          :key="showGrid.toString()"
        > 
        <!-- :restrictExtent="[11.9, 42.15, 12.2, 42.4]"      -->
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
            <DianaPlaceLayer v-if="placesLayerVisible" path="etruscantombs/geojson/place/" :params="tagParams" :zIndex=20>
            </DianaPlaceLayer>
          </template>
          
        </MapComponent>  
      </div> 
    </template>

    <template #details>
      <MapViewPreview v-if="!showGrid"/>
    </template>

  </MainLayout>
</template>

<style>

#app .tile-layer {
  filter: grayscale(80%);
}

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