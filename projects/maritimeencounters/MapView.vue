<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import MaritimePlaceLayer from "./MaritimePlaceLayer.vue";
// import MapViewPreview from "./MapViewPreview.vue";
import MapViewThumbnail from "./MapViewThumbnail.vue";
import { storeToRefs } from "pinia";
import { maritimeencountersStore } from "./store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import Title from "./Title.vue"

const { selectedRange, showUnknownRange, dataSetValue, dataParams, doneFetching } = storeToRefs(maritimeencountersStore());
const store = mapStore();
const maritimeencounters = maritimeencountersStore();  // Get the instance of maritimeencountersStore
const { selectedFeature } = storeToRefs(store);
const minZoom = 1;
const maxZoom = 25;
const featureZoom = 10; //value between minZoom and maxZoom when you select a point;
const visibleAbout = ref(false);
const showConnections = ref(false);
let visited = true; // Store the visited status outside of the hook

// const toggleConnections = () => {
//   showConnections.value = !showConnections.value;
// };

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

const startRectangleDraw = () => {
  maritimeencounters.startRectangleDraw = true;
};

const toggleHeatMap = () => {
  maritimeencounters.showHeatMap = !maritimeencounters.showHeatMap;
};

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

  if (!visited) {
    // Hide the about component
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  }
})

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};
</script>

<template>
  <!-- <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay" style="z-index: 1000;">
      <button 
        class="item" 
        @click="toggleConnections" 
        :style="{ color: showConnections ? 'white' : 'grey' }"
      >
        Show Connections 
      </button>
    </div>
  </div> -->
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <MainLayout>
    <template #search>
      <Title @toggle-about="toggleAboutVisibility" />
      <MapViewControls/>
    </template>

    <template #background>
      <div class="map-container">
        <div class="map-buttons">
          <button  @click="startRectangleDraw" class="map-button" >
            <img src="/images/download.svg" alt="Download" />
          </button>
          <button v-if="maritimeencounters.doneFetching"  @click="toggleHeatMap" class="map-button">
            <img src="/images/heat.svg" alt="Heatmap" />
          </button>
        </div>
        <MapComponent 
          :shouldAutoMove="true" 
          :min-zoom=minZoom
          :max-zoom=maxZoom 
          :restrictExtent="[-45.0, 32.00, 55.0, 75.0]"    
        > 
          <template #layers>
            <MaritimePlaceLayer :params="tagParams" :showConnections="showConnections">
            </MaritimePlaceLayer> 
          </template>
          
        </MapComponent>  
      </div> 
    </template>

    <template #details>
      <!-- <MapViewPreview/> -->
      <MapViewThumbnail/>
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

/* Overides the settings in ui_modules.css */
#app .ol-zoom-in {
    display: none !important;
}

#app .ol-zoom-out {
    display: none !important;
}

#map .leaflet-control-zoom-in {
  left: calc(50% + 50px) !important;
  top: calc(100vh - 140px) !important;
  position: fixed;
  border-radius: 10px 0px 0px 10px !important;
  height: 35px;
  border-bottom: none;
  background-color: var(--theme-3);
  color: white;
  width: 50px;
}

#map .leaflet-control-zoom-in:hover {
  background-color: var(--theme-4);
}

#map .leaflet-control-zoom-out {
  left: calc(50% + 100px);
  top: calc(100vh - 140px) !important;
  position: fixed;
  border-radius: 0px 10px 10px 0px !important;
  height: 35px;
  border-bottom: none;
  background-color: var(--theme-3);
  color: white;
  width: 50px;
}

#map .leaflet-control-zoom-out:hover {
  background-color: var(--theme-4);
}

@media screen and (max-width: 900px) {
  #map .leaflet-control-zoom-in {
    display:none!important;
    left: calc(50% - 50px) !important;
    top: calc(100vh - 320px) !important;
  }
  #map .leaflet-control-zoom-out {
    display:none!important;
    left: calc(50% + 0px) !important;
    top: calc(100vh - 320px) !important;
  }
}

#app .ol-popup:before {
  left: 30px;
}

.map-buttons {
  position: absolute;
  top: 20px;
  left: calc(50% + 100px);
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.map-button {
  background-color: var(--theme-3);
  border: none;
  border-radius: 10px 10px 10px 10px;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.map-button img {
  width: 24px;
  height: 24px;
}

.map-button:hover {
  background-color: var(--theme-4);
}
</style>
