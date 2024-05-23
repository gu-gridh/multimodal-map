<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponentRwanda.vue";
import SophiaPlaceLayer from "./SophiaPlaceLayer.vue";
import GeoJsonWebGLRenderer from "@/components/GeoJsonWebGLRenderer.vue";
import FeatureSelection from "./FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { inscriptionsStore } from "./store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-white.svg";
import MapViewGallery from "./MapViewGallery.vue";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import GeoJSON from "ol/format/GeoJSON";
import Title from "./Title.vue";
import apiConfig from "./apiConfig"

const { categories, tags, tagsLayerVisible, dataParams, imgParams } = storeToRefs(inscriptionsStore());
const store = mapStore();
const inscriptions = inscriptionsStore();  // Get the instance of inscriptionsStore
const { selectedFeature } = storeToRefs(store);
const minZoom = 20;
const maxZoom = 24;
const featureZoom = 15; //value between minZoom and maxZoom when you select a point 
const visibleAbout = ref(false);
const showGallery = ref(false);
const showSecondFloor = ref(false);
let visited = true; // Store the visited status outside of the hook

// Watcher for selectedFeature changes
watch(
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry as any).getFirstCoordinate();
        store.updateCenter(coordinates);
        if (store.zoom < featureZoom) {
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
  // const epoch = tags.value[0];
  //const necropolis = necropoli.value[0];
  // const type = panelType.value[0];

  const initialParams = { }; // no initialParams at the moment!

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
/*   if (enable3D.value) {
    (params as any)['with_3D'] = 'true';
  } else {
    delete (params as any)['with_3D'];
  }

  if (enablePlan.value) {
    (params as any)['with_plan'] = 'true';
  } else {
    delete (params as any)['with_plan'];
  } */

  // Convert the params object to a URL search string
  const queryString = new URLSearchParams(params).toString();

  // Concatenate the base URL with the search string to form the full URL
  const fullUrl = queryString
    ? `${apiConfig.PANEL}?page_size=500&${queryString}`
    : `${apiConfig.PANEL}?page_size=500`;

  inscriptions.imgParams = params;
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
  const storedShowSecondFloor = localStorage.getItem("showSecondFloor");

  if (!visited) {
    // Hide the about component
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  }

  if (storedShowGallery) {
    showGallery.value = JSON.parse(storedShowGallery);
  }

  if (storedShowSecondFloor) {
    showSecondFloor.value = JSON.parse(storedShowSecondFloor);
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

watch(showSecondFloor, (newValue) => {
  localStorage.setItem("showSecondFloor", JSON.stringify(newValue));
});
</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay ui-overlay-top">
      <button class="item" v-bind:class="{ selected: !showGallery }" v-on:click="showGallery = false;">
        {{ $t('plans') }}
      </button>
      <button class="item" v-bind:class="{ selected: showGallery }" v-on:click="showGallery = true;">
        {{ $t('panels') }}
      </button>
      <button class="item" style="pointer-events:none" v-bind:class="{ selected: showGalleryInscriptions }" v-on:click="showGallery = true;">
        {{ $t('inscriptions') }}
      </button>
    </div>

    <div class="ui-mode ui-overlay tile-switcher ui-overlay-bottom" style="" v-if="!showGallery">
      <button class="item" v-bind:class="{ selected: !showSecondFloor }" v-on:click="showSecondFloor = false;">
        {{ $t('groundfloor') }}
      </button>
      <button class="item" v-bind:class="{ selected: showSecondFloor }" v-on:click="showSecondFloor = true;">
        {{ $t('secondfloor') }}
      </button>
    </div>

  </div>
  <MapViewGallery v-if="showGallery" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <div class="gradient-blur">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  <MainLayout>
   
    <template #search>
      <Title @toggle-about="toggleAboutVisibility" />
      <MapViewControls />
    </template>

    <template #background>
      <div class="map-container">
       
        <MapComponent :shouldAutoMove="true" :min-zoom=minZoom :max-zoom=maxZoom v-if="!showGallery">
          <template #layers>
            <SophiaPlaceLayer :params="tagParams" :zIndex=3 :showSecondFloor="showSecondFloor" />
          <div >
            <ol-tile-layer className="floor-plans" v-if="!showSecondFloor">
              <ol-source-xyz url="https://data.dh.gu.se/tiles/saint_sophia_ground_floor/{z}/{x}/{y}.png" />
              
            </ol-tile-layer>

            <ol-tile-layer className="floor-plans" v-if="showSecondFloor">
              <ol-source-xyz  url="https://data.dh.gu.se/tiles/saint_sophia_second_floor/{z}/{x}/{y}.png" />
            </ol-tile-layer>
          </div>
          
       
          
        </template>
        </MapComponent>
        
      </div>
    </template>

    <template #details>
      <MapViewPreview v-if="!showGallery" />
    </template>

  </MainLayout>
</template>

<style>
.map-container {
  height: calc(100% - 80px) !important;
  position: relative;
  width: 100%;
}

.gradient-blur {
  position: fixed;
  z-index: 1;
  inset: auto 0 0 0;
  height: calc(100% - 80px);
  pointer-events: none;
  width: 750px;
  top:0px;
  opacity:1.0;
}

.floor-plans{
  opacity:0.7;

}

@media screen and (max-width: 900px) {
  .gradient-blur {
display:none;
  }
}

.gradient-blur>div,
.gradient-blur::before,
.gradient-blur::after {
  position: absolute;
  inset: 0;
}

.gradient-blur::before {
  content: "";
  z-index: 1;
  backdrop-filter: blur(0.5px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 0) 37.5%);
}

.gradient-blur>div:nth-of-type(1) {
  z-index: 2;
  backdrop-filter: blur(1px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 0) 50%);
}

.gradient-blur>div:nth-of-type(2) {
  z-index: 3;
  backdrop-filter: blur(2px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 62.5%);
}

.gradient-blur>div:nth-of-type(3) {
  z-index: 4;
  backdrop-filter: blur(4px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 0) 75%);
}

.gradient-blur>div:nth-of-type(4) {
  z-index: 5;
  backdrop-filter: blur(8px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 87.5%);
}

.gradient-blur>div:nth-of-type(5) {
  z-index: 6;
  backdrop-filter: blur(16px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 0) 100%);
}

.gradient-blur>div:nth-of-type(6) {
  z-index: 7;
  backdrop-filter: blur(32px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 1) 100%);
}

.gradient-blur::after {
  content: "";
  z-index: 8;
  backdrop-filter: blur(64px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 87.5%,
      rgba(0, 0, 0, 1) 100%);
}

#app .tile-layer {
  filter: grayscale(0%);
  filter: opacity(0.0);
}

/* Overides the settings in ui_modules.css */
#app .ol-popup {
  left: -55px;
  width: 110px;
  min-width: 90px;
  bottom: 55px;
}

#app .ol-popup:before {
  left: 30px;
}

#app .ol-zoom-in {
  top: calc(100vh - 190px) ;
  background-color:rgba(0,0,0,0.9)!important;
  border-radius:8px 0px 0px 8px!important;
}

#app .ol-zoom-out {
  top: calc(100vh - 190px) ;
  background-color:rgba(0,0,0,0.9)!important;
  border-radius:0px 8px 8px 0px!important;
}

.tile-switcher{
  top:calc(100vh - 210px)!important;
}

@media screen and (max-width: 900px) {
  .tile-switcher{
  top:calc(60px)!important;
}
}

</style>
