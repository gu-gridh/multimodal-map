<template>
  <div class="map-container h-full">
    <div class="non-clickable absolute z-10 grid grid-cols-6 gap-4 mx-12 mt-8">
      <div class="col-span-2 flex flex-col">
        <slot name="title">
          <div class="px-8 py-6 bg-white rounded-t-lg shadow-lg">
            <div
              class="font-display text-5xl leading-tight"
              v-html="config.name"
            ></div>
          </div>
        </slot>

        <slot name="about">
          <div class="px-8 py-6 bg-white rounded-b-lg shadow-lg">
            <p class="text-gray-700 text-base" v-html="config.about"></p>
          </div>
        </slot>

        <slot name="search"></slot>
      </div>

      <div class="col-start-6 col-span-1">
        <slot name="details">
          <div class="bg-white rounded-lg shadow-lgmb-4">
            <div class="px-8 py-6">
              <div>
                Here you'll find more information and media on the selected
                location.
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <slot name="background">
      <MapComponent :urls="mapUrls" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import MapComponent from "./components/MapComponent.vue";

import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";

import type { Place } from "./types/map";

import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Project } from "./types/project";

const config = inject<Project>("config");

const store = mapStore();
const { mapUrls } = storeToRefs(store);
</script>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
}

#app {
  height: inherit;
  width: inherit;
  /* display: flex !important; */
}

.map-container {
  height: inherit;
  width: inherit;
}
</style>
