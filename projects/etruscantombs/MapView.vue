<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import LocalGeoJSONLayer from "@/components/LocalGeoJSONLayer.vue";
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
import i18n from '../../src/translations/etruscan';

const { categories, years, tags, placesLayerVisible, tagsLayerVisible } = storeToRefs(etruscanStore());
const store = mapStore();
const { selectedFeature } = storeToRefs(store);
const minZoom = 14;
const maxZoom = 20;
const featureZoom = 16; //value between minZoom and maxZoom when you select a point 
const visibleAbout = ref(false);
const showGrid = ref(false);
let visited = true; // Store the visited status outside of the hook

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

// const placeParams = computed(() =>
//   clean({
//     type: categories.value.filter((x) => x !== "all").join(","),
//     start_date: years.value[0],
//     end_date: years.value[1],
//   })
// );

const tagParams = computed(() => {
  const epoch = tags.value[0];
  return clean({
    epoch,
  });
});

const toggleLanguage = () => {
  if (i18n.global.locale === 'en') {
    i18n.global.locale = 'it';
  } else {
    i18n.global.locale = 'en';
  }
};

const toggleAboutVisibility = async () => {
  console.log('fired')
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

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

watch(showGrid, (newValue) => {
  localStorage.setItem("showGrid", JSON.stringify(newValue));
});
</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay">
      <button class="item" v-bind:class="{ selected: !showGrid }" v-on:click="showGrid = false;">
        {{ $t('map') }}
      </button>
      <button class="item" v-bind:class="{ selected: showGrid }" v-on:click="showGrid = true;">
        {{ $t('gallery') }}
      </button>
    </div>
  </div>
  <MapViewGallery v-if="showGrid" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <MainLayout>
    <template #search>
      <div class="main-title">{{ $t('etruscantitle') }}</div>
      <div class="about">{{ $t('etruscanabout') }}</div>
      <button class="item" @click="toggleAboutVisibility">
        <div class="p-1 px-2 clickable category-button about-button" style="
                width: 90px;
                text-align: center;
                cursor: pointer;
              ">{{ $t('infobutton') }}</div>
      </button>
      <button @click="toggleLanguage">
        <div class="p-1 px-2 clickable category-button about-button" style="
                text-align: center;
                margin-left: 10px;
                cursor: pointer;
              ">{{ $t('languagebutton') }}</div>
      </button>
      <MapViewControls />
    </template>

    <template #background>
      <div class="map-container">
        <MapComponent 
          :shouldAutoMove="true" 
          :min-zoom=minZoom
          :max-zoom=maxZoom 
          :restrictExtent="[11.9, 42.15, 12.2, 42.4]"       
          :key="showGrid.toString()"
        > 
        <!-- 11.9, 42.15, 12.2, 42.4   11.973, 57.93, 12.006, 57.690-->
          
          <template #layers>
            <!-- Layer for testing -->
             <!--it is possible to change color with :color="[180,100,100,1.0]", but then the marker becomes badly rasterized-->
            <DianaPlaceLayer v-if="placesLayerVisible" path="etruscantombs/geojson/place/" :params="tagParams">
              <ol-style>
                <ol-style-icon 
                :src="markerIcon" 
                :scale="1.8" 
                :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"></ol-style-icon>
              </ol-style>
              <FeatureSelection />
            </DianaPlaceLayer>

            <!-- Local layer for testing -->
            <!-- <LocalGeoJSONLayer :zIndex="0" geoJsonPath="/SGElevationMain.geojson">
              <ol-style>
                <ol-style-stroke color="rgba(0,0,0,0.05)" :width="2"></ol-style-stroke>  
              </ol-style>
            </LocalGeoJSONLayer>

            <LocalGeoJSONLayer :zIndex="0" geoJsonPath="/SGElevationEdge.geojson">
              <ol-style>
                <ol-style-stroke color="rgba(0,0,0,0.04)" :width="2"></ol-style-stroke>  
              </ol-style>
            </LocalGeoJSONLayer> -->
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
.map-container {
  height: calc(100vh - 80px) !important;
  position: relative;
  width: 100%;
}
</style>
