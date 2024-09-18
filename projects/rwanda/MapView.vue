<script lang="ts" setup>
import { provide, ref, watch } from "vue";
import configRaw from "./settings/config";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import type { Project } from "@/types/project";
import { formatNames } from "./settings/names";
import type Feature from "ol/Feature";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import MapComponent from "@/components/MapComponentRwanda.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import type { Place } from "./types";
import About from "./About.vue";
import Instructions from "./Instructions.vue";
import AutocompleteComponent from "@/components/input/AutocompleteComponent.vue";
import { useRwandaMap } from "./settings/map.composable";
import { rwandaStore } from "./settings/rwandaStore";
import { useRoute } from "vue-router";

function getName(f: Feature): string {
  const place = f.getProperties() as Place;
  return formatNames(f.getId(), place.names);
}

const config: Project = { ...configRaw };
config.getFeatureDisplayName = getName;
provide("config", config);

const visibleAbout = ref(false);
const visibleInstructions = ref(false);

const route = useRoute();

const store = mapStore();
const { params } = storeToRefs(store);
const { periods, sources, placeTypes, allLayer, informants, languages, showAdvancedLayer } = storeToRefs(rwandaStore());
const { selectedFeature } = storeToRefs(store);

//for map marker zoom in
const showMarker = ref(false);

//MapViewControls
const { searchText } = useRwandaMap();
function displayName(p: Place): string {
  return formatNames(p.id, p.names);
}

//zoom to place on click
const featureZoom = 18; // zoom level when clicking on a feature

watch(
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry as any).getFirstCoordinate(); //Since polygon - only get first coordinates
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

watch(route, () => {
  if (route.params.placeId) {
    //set map marker
    showMarker.value = true;
  }
  else {
    showMarker.value = false;
  }
}, {immediate: true});

</script>

<template>
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false"/>
  <Instructions :visibleInstructions="visibleInstructions" @close="visibleInstructions = false"/>
  <MainLayout>
    <template #search>
      <button class="item"  @click="visibleAbout = true;">
        <div
          class="p-1 px-3 clickable category-button about-button"
          style="
            width: auto;
            text-align: center;
            margin-top: -5px;
            cursor: pointer;"
            >More info
        </div>
      </button>
      
      <button class="item"  @click="visibleInstructions = true;">
        <div
          class="p-1 px-3 clickable category-button about-button"
          style="
            width: auto;
            text-align: center;
            margin-top: -5px;
            cursor: pointer;
            margin-left:10px;"
            >User Guide
        </div>
      </button>

    
      <!--filter map layers-->
      <MapViewControls />
      <div class="search-container">
        <AutocompleteComponent
          placeholderText="Search place names..."
          noResultsText="No results found."
          :displayFunction="displayName"
          :searchItems="searchText"
        />
      </div>
    </template>

    <template #background>
    <div class="map-container">
      <MapComponent :min-zoom="14" :max-zoom="19" :restrictExtent="[30.01, -1.98, 30.1, -1.92]" :shouldAutoMove="true" class="greyscale">
        <template #layers>
          <!-- marker layer for zooming in -->
          <DianaPlaceLayer
            v-if="showMarker"
            path="rwanda/geojson/place/"
            :params="{
              id__in: route.params.placeId,
              corrected: true,
            }">
            <ol-style>
              <ol-style-stroke color="#dc6464" :width="4"></ol-style-stroke>
            </ol-style>
          </DianaPlaceLayer>
          <!-- Advanced search layers -->
          <DianaPlaceLayer 
            v-if="showAdvancedLayer"
            path="rwanda/advance/search/"
            :params="{
              corrected: true,
              source: sources[0] ? sources[0] : '',
              period: periods[0] ? periods[0] : '',
              place_type: placeTypes[0] ? placeTypes[0] : '',
              language: languages[0] ? languages[0] : '',
              informant: informants[0] ? informants[0] : '',
            }"
          >
          <ol-style >
              <ol-style-stroke color="rgb(100,100,250)" :width="4"></ol-style-stroke>
            </ol-style>
            <FeatureSelection/>
          </DianaPlaceLayer>
          <!--All layer-->
          <DianaPlaceLayer
            v-if="allLayer && !showMarker"
            path="rwanda/geojson/place/"
            :params="{
              has_no_name: false,
              id__in: params.searchIds ? params.searchIds : '',
              in_bbox:
                params.bbox && !params.searchIds ? params.bbox.toString() : '',
              page_size: 500,
              corrected: true,
            }"
          >
            <ol-style>
              <ol-style-stroke color="rgb(220,60,60)" :width="4"></ol-style-stroke>
            </ol-style>
            <FeatureSelection />
          </DianaPlaceLayer>
        </template>
      </MapComponent>
    </div>
    <div class="gradient-blur">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </template>

</MainLayout>
</template>

<style>
  
.about{
  display:none;
}

#app #map-component{
  width: 100% !important;
  height: 100% !important;
}

#app .tile-layer {
  filter: grayscale(65%);
}

.gradient-blur {
  position: fixed;
  z-index: 1;
  inset: auto 0 0 0;
  height: calc(100% - 80px);
  pointer-events: none;
  width: 550px;
  top:0px;
  opacity:1.0;
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

#app #transparent {
  background-color: transparent !important;
  display: none !important;
}

.map-container {
  height: calc(100vh - 80px) !important;
  position: relative;
  width: 100%!important;
}
.search-container {
  display:flex;
  flex-direction: column;
  height:auto;
  margin-top: 0px;
  width:360px;
  position:relative;
}
.mapoverlay{
z-index: 100;
position:absolute;
font-size: 18px;
font-weight: 500;
color: white;
bottom:100px;
}

#app .ol-popup {
  font-size: 1.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center;
  line-height: 1.2;
  position: absolute;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px;
  border-radius: 5px;
  border: 0px solid #cccccc;
  bottom: 35px;
  left: -50px;
  min-width: 200px;
}


</style>
