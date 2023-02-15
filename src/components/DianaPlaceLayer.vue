<script lang="ts" setup>
import { computed, inject } from "vue";

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});

const format = inject("ol-format");
const geoJsonFormat = new format.GeoJSON();

const urlBase = "https://diana.dh.gu.se/api/";
const url = computed(
  () =>
    urlBase + props.path + "?" + new URLSearchParams(props.params).toString()
);
</script>

<template>
  <ol-vector-layer :z-index="1">
    <ol-source-vector :url="url" :format="geoJsonFormat" ref="source" />
    <ol-style>
      <slot name="style">
        <ol-style-circle :radius="10">
          <ol-style-fill color="rgb(232 157 59)" />
          <ol-style-stroke :width="0" />
        </ol-style-circle>
      </slot>
    </ol-style>
  </ol-vector-layer>
</template>
