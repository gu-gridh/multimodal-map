<script lang="ts" setup>
import { inject } from "vue";

const format = inject("ol-format");
const geoJsonFormat = new format.GeoJSON();
</script>

<template>
  <ol-vector-layer z-index="1">
    <ol-source-vector
      url="https://diana.dh.gu.se/api/rephotography/place/"
      :format="geoJsonFormat"
      ref="source"
    />
    <ol-style>
      <ol-style-circle :radius="10">
        <ol-style-fill color="rgb(232 157 59)" />
        <ol-style-stroke :width="0" />
      </ol-style-circle>
    </ol-style>
  </ol-vector-layer>
</template>
