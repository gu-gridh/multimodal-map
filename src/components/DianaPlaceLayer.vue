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
    <slot />
  </ol-vector-layer>
</template>
