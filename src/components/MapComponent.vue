<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 100%; width: 100%; z-index: 0 !important"
    ref="map"
  >
    <ol-view
      ref="view"
      :center="projectedCenter"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
      style="z-index=0"
      @centerChanged="onCenterChange"
      @zoomChanged="zoomChanged"
    />

    <ol-fullscreen-control v-if="fullscreencontrol" />
    <ol-attribution-control v-if="attributioncontrol" />
    <ol-overviewmap-control v-if="overviewmapcontrol">
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-overviewmap-control>

    <ol-scaleline-control v-if="scalelinecontrol" />
    <ol-zoom-control v-if="zoomcontrol" />
    <ol-zoomslider-control v-if="zoomslidercontrol" />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <slot name="layers"></slot>
  </ol-map>
</template>

<script setup lang="ts">
import { ref, inject, defineProps } from "vue";
import { fromLonLat, transformExtent } from "ol/proj";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import type { Project } from "@/types/project";

const config = inject("config") as Project;

const store = mapStore();
const { extent } = storeToRefs(store);

const projection = ref(config.projection);
const zoom = ref(config.zoom);
const rotation = ref(0);
const view = ref();
const map = ref();
const projectedCenter = fromLonLat(config.center, projection.value);

// Controls
const fullscreencontrol = ref(true);
const attributioncontrol = ref(true);
const zoomcontrol = ref(true);
const zoomslidercontrol = ref(true);
const scalelinecontrol = ref(true);
const overviewmapcontrol = ref(true);

function zoomChanged() {
  let newExtent = map.value.map
    .getView()
    .calculateExtent(map.value.map.getSize());
  newExtent = transformExtent(newExtent, projection.value, "EPSG:4326");
  extent.value = newExtent;
}

function onCenterChange() {
  let newExtent = map.value.map
    .getView()
    .calculateExtent(map.value.map.getSize());
  newExtent = transformExtent(newExtent, projection.value, "EPSG:4326");
  extent.value = newExtent;
}
</script>

<style>
.overlay-content {
  background: #ff0000;
  box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
  padding: 10px 20px;
  font-size: 16px;
}

.ol-popup {
  text-align: center;
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 0px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 150px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "✖";
}
</style>
