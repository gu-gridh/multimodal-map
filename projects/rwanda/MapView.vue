<script lang="ts" setup>
import { inject, provide, ref, nextTick, watch } from "vue";
import configRaw from "./config";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import type { Project } from "@/types/project";
import { formatNames } from "./names";
import type Feature from "ol/Feature";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
// import AreaSearch from "@/components/AreaSearch.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import type { Place } from "./types";
import About from "./About.vue";
import AutocompleteComponent from "@/components/input/AutocompleteComponent.vue";
import { useRwandaMap } from "./map.composable";
import GeoJSON from 'ol/format/GeoJSON.js'

function getName(f: Feature): string {
  const place = f.getProperties() as Place;
  return formatNames(f.getId(), place.names);
}

const config: Project = { ...configRaw };
config.getFeatureDisplayName = getName;
provide("config", config);

const store = mapStore();
const { params } = storeToRefs(store);

// GeoJSON formatting
const format = inject("ol-format");
const GeoJSONFormat = new format.GeoJSON({
  featureProjection: config.projection,
});

const visibleAbout = ref(false);
/* const toggleAboutVisibility = async () => {
  console.log('fired')
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
}; */

//MapViewControls
const { searchText } = useRwandaMap();
function displayName(p: Place): string {
  return formatNames(p.id, p.names);
}

//zoom on click
const featureZoom = 17; // zoom level when clicking on a feature
const { selectedFeature } = storeToRefs(store);
watch(
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      console.log('fired')
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry as any).getFirstCoordinate(); //Since polygon - only get first coordinates
        console.log(coordinates)
        store.updateCenter(coordinates);
        console.log('in store' + store.center)
        if (store.zoom < featureZoom)
        {
          store.updateZoom(featureZoom);
        }
      }
    }
  },
  { immediate: true }
);

</script>

<template>
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false"/>
  <MainLayout>
    <template #search>
      <button class="item"  @click="visibleAbout = true;">
        <div
              class="p-1 px-3 clickable category-button"
              style="
                width: auto;
                text-align: center;
                margin-top: -5px;
                cursor: pointer;
              "
            >More info</div>
          </button>
      <div class="search-container">
        <AutocompleteComponent
          placeholderText="Search place names..."
          noResultsText="No results found."
          :displayFunction="displayName"
          :searchItems="searchText"
        />
      </div>
      <!--filter map-->
      <MapViewControls />
    </template>

    <template #background>
     
      <div style="display:flex; align-items: center; justify-content: center;">

</div>
<div class="map-container">
  <MapComponent :min-zoom="14" :max-zoom="19" :restrictExtent="[30.1, -1.92, 30.01, -1.980]" :shouldAutoMove="true">
        <template #layers>
          <DianaPlaceLayer
            path="rwanda/geojson/place/"
            :params="{
              has_no_name: false,
              id__in: params.searchIds ? params.searchIds : '',
              in_bbox:
                params.bbox && !params.searchIds ? params.bbox.toString() : '',
              page_size: 500,
            }"
          >
            <ol-style>
              <ol-style-circle :radius="10">
                <ol-style-fill color="rgb(255,255,255,0.7)"></ol-style-fill>
                <ol-style-stroke color="gray"></ol-style-stroke>
              </ol-style-circle>
              <ol-style-stroke color="rgba(100,100,100,0.8)" :width="5"></ol-style-stroke>
            </ol-style>
            <FeatureSelection />
          </DianaPlaceLayer>
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
  height: calc(100vh - 80px) !important;
  position: relative;
  width: 100%;
}
.search-container {
  display:flex;
  flex-direction: column;
  height:auto;
  margin-top: 20px;
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

#app .ol-control button {
  font-family: "Barlow Condensed", sans-serif;
  border-radius: 50% !important;
  background-color: rgb(50, 50, 50) !important;
  color: white !important;
}

#app .ol-control button:hover,
.ol-control button:focus {
  background-color: rgb(180, 100, 100) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}

#app .ol-control button:active {
  background-color: rgb(180, 100, 100) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}
</style>
