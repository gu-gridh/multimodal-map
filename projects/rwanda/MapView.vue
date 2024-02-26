<script lang="ts" setup>
import { inject, provide, ref, nextTick, watch , onMounted} from "vue";
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

const store = mapStore();
const { params } = storeToRefs(store);
const { periodsLayer, periods, sources, informants, sourcesLayer, placeTypeLayer, placeTypes, allLayer, informantsLayer, coordinate, languagesLayer, languages } = storeToRefs(rwandaStore());
const { selectedFeature } = storeToRefs(store);

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
          <!-- Source layer -->
          <DianaPlaceLayer 
            v-if="sources[0] == 'images'"
            path="rwanda/search/image"
          >
          <ol-style>
              <ol-style-stroke color="#2b90c8" :width="3"></ol-style-stroke>
            </ol-style>
            <FeatureSelection/>
          </DianaPlaceLayer>
          <!-- <DianaPlaceLayer 
            v-if="sources[0] == 'interviews'"
            path="rwanda/search/text/"
          >
          <ol-style>
              <ol-style-stroke color="#2b90c8" :width="3"></ol-style-stroke>
            </ol-style>
            <FeatureSelection/>
          </DianaPlaceLayer> -->
          <DianaPlaceLayer 
            v-if="sources[0] == 'documents'"
            path="rwanda/search/document/"
          >
          <ol-style>
              <ol-style-stroke color="#2b90c8" :width="3"></ol-style-stroke>
            </ol-style>
            <FeatureSelection/>
          </DianaPlaceLayer>
          <!-- Place types layer -->
          <DianaPlaceLayer 
            v-if="placeTypeLayer"
            path="rwanda/search/type/"
            :params = "{
              text: placeTypes[0],
            }"
            >
            <ol-style>
              <ol-style-stroke color="#64b464" :width="3"></ol-style-stroke>
            </ol-style>
              <FeatureSelection/>
            </DianaPlaceLayer>  
            <!-- Informants layer -->
          <DianaPlaceLayer 
            v-if="informantsLayer"
            path="rwanda/search/informant/"
            :params = "{
              text: informants[0],
            }"
            >
            <ol-style>
              <ol-style-stroke color="#6464b4" :width="3"></ol-style-stroke>
            </ol-style>
              <FeatureSelection/>
            </DianaPlaceLayer>  
          <!-- Periods layer -->
           <DianaPlaceLayer 
            v-if="periodsLayer"
            path="rwanda/search/period/"
            :params = "{
              period_name: periods[0],
            }"
            >
            <ol-style>
              <ol-style-stroke color="#64b4b4" :width="3"></ol-style-stroke>
            </ol-style>
              <FeatureSelection/>
            </DianaPlaceLayer>  
            <!-- Language layer -->
            <DianaPlaceLayer 
            v-if="languagesLayer"
            path="rwanda/search/language/"
            :params = "{
              q: languages[0],
            }"
            >
            <ol-style>
              <ol-style-stroke color="#b464b4" :width="3"></ol-style-stroke>
            </ol-style>
              <FeatureSelection/>
            </DianaPlaceLayer>  
            <!-- Initial layer -->
          <DianaPlaceLayer
            v-if="allLayer"
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
