<script lang="ts" setup>
import { provide, ref, watch } from "vue";
import configRaw from "./config";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import type { Project } from "@/types/project";
import { formatNames } from "./names";
import type Feature from "ol/Feature";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import MapComponent from "@/components/MapComponentRwanda.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import type { Place } from "./types";
import About from "./About.vue";
import AutocompleteComponent from "@/components/input/AutocompleteComponent.vue";
import { useRwandaMap } from "./map.composable";
import { rwandaStore } from "./rwandaStore";
import { useRoute } from "vue-router";

function getName(f: Feature): string {
  const place = f.getProperties() as Place;
  return formatNames(f.getId(), place.names);
}

const config: Project = { ...configRaw };
config.getFeatureDisplayName = getName;
provide("config", config);

const visibleAbout = ref(false);

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
              <ol-style-stroke color="rgb(180,100,100)" :width="2"></ol-style-stroke>
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
              /* text: informants[0], */
            }"
          >
          <ol-style>
              <ol-style-stroke color="#2b90c8" :width="3"></ol-style-stroke>
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
              <ol-style-stroke color="rgb(180,100,100)" :width="3"></ol-style-stroke>
            </ol-style>
            <FeatureSelection />
          </DianaPlaceLayer>
        </template>
      </MapComponent>
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
  filter: grayscale(80%);
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
  margin-top: 30px;
  width:80%;
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
