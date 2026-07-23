<script setup>
import { onMounted, onUnmounted, provide, ref, shallowRef } from "vue";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat, transformExtent } from "ol/proj";
import { iconographiaStore } from "./settings/store";
import config from "./settings/config";

const iconographia = iconographiaStore();
const mapEl = ref();

/** Shared with marker layers rendered in the default slot. */
const olMap = shallowRef(null);
provide("olMap", olMap);

let map = null;
let moveTimer = null;

function onMoveEnd() {
  // Debounce: the gallery refetches on every extent change.
  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => {
    const view = map.getView();
    const extent4326 = transformExtent(
      view.calculateExtent(map.getSize()),
      "EPSG:3857",
      "EPSG:4326"
    );
    iconographia.mapBbox = extent4326.map((v) => v.toFixed(4)).join(",");
    iconographia.mapCenter = view.getCenter();
    iconographia.mapZoom = view.getZoom();
  }, 250);
}

onMounted(() => {
  map = new Map({
    target: mapEl.value,
    layers: [new TileLayer({ source: new OSM() })],
    controls: defaultControls({ attributionOptions: { collapsible: false } }),
    view: new View({
      center: iconographia.mapCenter || fromLonLat(config.center),
      zoom: iconographia.mapZoom ?? config.zoom,
      minZoom: 4,
      maxZoom: 18,
      // Integer zoom levels only: OSM tiles stay crisp (fractional zoom
      // scales the tiles and makes the whole map look blurry).
      constrainResolution: true,
    }),
  });
  map.on("moveend", onMoveEnd);
  olMap.value = map;
});

onUnmounted(() => {
  clearTimeout(moveTimer);
  if (map) {
    map.setTarget(null);
    map = null;
  }
});
</script>

<template>
  <div ref="mapEl" class="ol-map-pane"></div>
  <slot></slot>
</template>

<style scoped>
.ol-map-pane {
  width: 100%;
  height: 100%;
}
</style>
