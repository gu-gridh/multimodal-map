


<script lang="ts" setup>
import { inject, provide } from "vue";
import configRaw from "./config.ts";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import type { Project } from "@/types/project";
import { formatNames } from "./names";
import type Feature from "ol/Feature";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import PlaceDetails from "./PlaceDetails.vue";
import type { Place } from "./types";


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
</script>

<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>

    <template #background>
      <MapComponent>
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
              <ol-style-stroke color="gray" :width="7"></ol-style-stroke>
            </ol-style>

            <FeatureSelection />
          </DianaPlaceLayer>
        </template>
      </MapComponent>
    </template>
    
    <template #details>
  <PlaceDetails />
</template>
</MainLayout>
</template>





<style>
#app .ol-popup {
  font-size: 1.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center;
  position: absolute;
  background-color: white;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px;
  border-radius: 5px;
  border: 0px solid #cccccc;
  bottom: 35px;
  left: -50px;
  min-width: 100px;
}
</style>
