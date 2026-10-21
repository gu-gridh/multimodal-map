<script setup>
import GeoJSON from "ol/format/GeoJSON.js";

const props = defineProps({
  geojsonUrl: { type: String, required: true },
  zIndex: { type: Number, default: 2 },
  isVisible: { type: Boolean, required: true },
  color: { type: String, default: "rgb(0,100,255)" },
});

const geoJsonFormat = new GeoJSON();
const makeFill = (rgb, alpha = 0.15) =>
  rgb.startsWith("rgba") ? rgb : rgb.replace("rgb", "rgba").replace(")", `, ${alpha})`);
</script>

<template>
  <ol-vector-layer :z-index="zIndex" :visible="isVisible">
    <ol-source-vector :url="geojsonUrl" :format="geoJsonFormat" />
    <ol-style>
      <ol-style-stroke :color="color" :width="3" />
      <ol-style-fill :color="makeFill(props.color)" />
    </ol-style>
  </ol-vector-layer>
</template>
