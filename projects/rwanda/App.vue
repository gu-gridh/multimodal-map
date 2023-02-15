<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>

    <template #background>
      <MapComponent>
        <template #layers>
          <DianaPlaceLayer
            path="rwanda/geojson/place"
            :params="{
              has_no_name: false,
              id__in: params.searchIds ? params.searchIds : '',
              in_bbox:
                params.bbox && !params.searchIds ? params.bbox.toString() : '',
              page_size: 500,
            }"
          >
            <template #style>
              <ol-style-circle :radius="10">
                <ol-style-fill color="rgb(255,255,255,0.7)"></ol-style-fill>
                <ol-style-stroke color="gray"></ol-style-stroke>
              </ol-style-circle>
              <ol-style-stroke color="gray" :width="7"></ol-style-stroke>
            </template>
          </DianaPlaceLayer>
        </template>
      </MapComponent>
    </template>
  </MainLayout>
</template>

<script lang="ts" setup>
import { inject, provide } from "vue";
import configRaw from "./project.json";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import type { Project } from "@/types/project";
import { formatNames } from "./names";
import type Feature from "ol/Feature";
import type { Place } from "@/types/map";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";

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
