<script lang="ts" setup>
import { DIANA_BASE } from "@/assets/diana";
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

const url = computed(
  () =>
    DIANA_BASE + props.path + "?" + new URLSearchParams(props.params).toString()
);
</script>

<template>
  <ol-vector-layer :z-index="1">
    <ol-source-vector :url="url" :format="geoJsonFormat" ref="source" />
    <slot />
  </ol-vector-layer>
</template>
