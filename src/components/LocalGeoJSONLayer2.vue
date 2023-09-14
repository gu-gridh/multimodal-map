<template>
  <ol-vector-layer :z-index="zIndex">
    <ol-source-vector :features="features" ref="source" />
    <slot />
  </ol-vector-layer>
</template>

<script lang="ts" setup>
// Used for testing local GeoJSONlayers
import { ref, onMounted } from "vue";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import type { Feature } from "ol";

const props = defineProps({
  zIndex: {
    type: Number,
    default: 1,
  },
});

const features = ref<Feature[]>([]);
const geoJsonFormat = new GeoJSON();

async function loadLocalGeoJson() {
  try {
    const response = await fetch("/SGElevationEdge.geojson");
    const geojson = await response.json();
    features.value = geoJsonFormat.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
  } catch (error) {
    console.error("Failed to load local GeoJSON file:", error);
  }
}

onMounted(loadLocalGeoJson);
</script>
