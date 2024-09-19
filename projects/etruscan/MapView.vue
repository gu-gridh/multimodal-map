<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import MapViewMarkers from "./MapViewMarkers.vue";
import GeoJsonWebGLRenderer from "@/components/GeoJsonWebGLRenderer.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./settings/store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import MapViewGallery from "./MapViewGallery.vue";
import { ref } from "vue";
import About from "./About.vue";
import { transform } from "ol/proj";
import Instructions from "./Instructions.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import Title from "./MapViewTitle.vue"

const { selectedRange, necropoli, showUnknownRange, tombType, dataSetValue, dataParams, enable3D, enablePlan, selectedSite } = storeToRefs(etruscanStore());
const store = mapStore();
const etruscan = etruscanStore();  // Get the instance of etruscanStore
const { selectedFeature } = storeToRefs(store);
const minZoom = 10;
const maxZoom = 22;
const featureZoom = 15; //value between minZoom and maxZoom when you select a point 
const visibleAbout = ref(false);
const visibleInstructions = ref(false);
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

/* Response for generating the URL for filtering map points down */
const tagParams = computed(() => {
  const necropolis = necropoli.value[0];
  const type = tombType.value[0];
  const dataset = dataSetValue.value[0];
  const selectedRangeValue = selectedRange.value;
  const show_unknown = showUnknownRange.value;
  const site = selectedSite.value[0];

  const initialParams: any  = { necropolis, type, dataset, site, show_unknown: show_unknown.toString() };

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
  if (enable3D.value) {
    (params as any)['with_3D'] = 'true';
  } else {
    delete (params as any)['with_3D'];
  }

  if (enablePlan.value) {
    (params as any)['with_plan'] = 'true';
  } else {
    delete (params as any)['with_plan'];
  }

  etruscan.imgParams = params;
  return params;
});

watch(
  tagParams, 
  async (newParams) => {
    dataParams.value = newParams;
    //fetch bounding box data based on tagParams
    const queryString = new URLSearchParams(newParams).toString();
    const response = await fetch(`https://diana.dh.gu.se/api/etruscantombs/boundingbox/?${queryString}`);
    if (response.ok) {
      const bbox = await response.json();

      if (bbox && bbox.min_latitude && bbox.max_latitude && bbox.min_longitude && bbox.max_longitude) {
        //transform the coordinates from EPSG:4326 to EPSG:3857
        const minCoords = transform([bbox.min_longitude, bbox.min_latitude], 'EPSG:4326', 'EPSG:3857');
        const maxCoords = transform([bbox.max_longitude, bbox.max_latitude], 'EPSG:4326', 'EPSG:3857');

        if (Array.isArray(minCoords) && Array.isArray(maxCoords)) {
          //update map bounds
          store.updateBounds([minCoords, maxCoords]);
        } else {
          console.error("Failed to transform bounding box coordinates.");
        }
      }
    } else {
      console.error("Failed to fetch bounding box data.");
    }
  }
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

const toggleInstructionsVisibility = async () => {
  await nextTick();
  visibleInstructions.value = !visibleInstructions.value;
};

watch(showGallery, (newValue) => {
  localStorage.setItem("showGallery", JSON.stringify(newValue));
});
</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay">
      <button class="item" v-bind:class="{ selected: !showGallery }" v-on:click="showGallery = false;">
        {{ $t('map') }}
      </button>
      <button class="item" v-bind:class="{ selected: showGallery }" v-on:click="showGallery = true;">
        {{ $t('gallery') }}
      </button>
    </div>
  </div>
  <MapViewGallery v-if="showGallery" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <Instructions :visibleInstructions="visibleInstructions" @close="visibleInstructions = false" />
  <MainLayout>
    <template #search>
      <Title @toggle-about="toggleAboutVisibility" @toggle-instructions="toggleInstructionsVisibility"/>
      <MapViewControls/>
    </template>

    <template #background>
      <div class="map-container">
        <MapComponent 
          :shouldAutoMove="true" 
          :min-zoom=minZoom
          :max-zoom=maxZoom 
          :restrictExtent="[11.4, 42.15, 12.4, 42.4]"    
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
            <MapViewMarkers :params="tagParams" :zIndex=20>
            </MapViewMarkers>
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
