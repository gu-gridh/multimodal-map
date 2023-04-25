<template>
  <router-view />
</template>

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

<style>
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
}

.main-title {
  font-size: 80px;
  line-height: 0.9;
  font-weight: 100;
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  padding: 60px 450px 50px 60px;
  background: url("@/assets/gradient-rephotography.png");
  background-size: contain;
}

#app .detail-view {
  height: 100vh !important;
  pointer-events: auto !important;
  overflow-y: scroll !important;
  background-color: rgba(0, 0, 0, 0.85);
  width: 100%;
  color: white;
  transition: all 0.5s ease-in-out;
  backdrop-filter: blur(7px);
}

.close-button {
  width: 40px;
  height: 40px;
  margin-left: -10px;
  margin-top: -5px;
  padding: 16px 15px 10px 9px;
  line-height: 1px;
  font-size: 50px;
  font-weight: 100;
  border-radius: 50%;
  background-color: rgb(100, 100, 100);
  color: white;
  transform: rotate(45deg);
  cursor: pointer;
  pointer-events: auto;
  margin-bottom: 30px;
}

.close-button:hover {
  background-color: rgb(140, 140, 140);
}
</style>
