<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>

    <template #background>
      <MapComponent>
        <template #layers>
          <ol-vector-layer v-for="url in mapUrls" v-bind:key="url">
            <ol-source-vector :url="url" :format="GeoJSONFormat" ref="source">
            </ol-source-vector>
            <ol-style>
              <ol-style-circle :radius="10">
                <ol-style-fill color="rgb(255,255,255,0.7)"></ol-style-fill>
                <ol-style-stroke color="gray"></ol-style-stroke>
              </ol-style-circle>
              <ol-style-stroke color="gray" :width="7"></ol-style-stroke>
            </ol-style>
          </ol-vector-layer>
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

function getName(f: Feature): string {
  const place = f.getProperties() as Place;
  return formatNames(f.getId(), place.names);
}

const config: Project = { ...configRaw };
config.getFeatureDisplayName = getName;
provide("config", config);

const store = mapStore();
const { mapUrls } = storeToRefs(store);

// GeoJSON formatting
const format = inject("ol-format");
const GeoJSONFormat = new format.GeoJSON({
  featureProjection: config.projection,
});
</script>
