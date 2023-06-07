<script lang="ts" setup>
import { DIANA_BASE } from "@/assets/dianaRephotography";
import { computed, inject } from "vue";

const props = defineProps({
  path: {
    type: String,
    required: false,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  externalUrl: {
    type: String,
    default: null,
  },
});

const format = inject("ol-format");
const geoJsonFormat = new format.GeoJSON();

const url = computed(() => {
  if (props.externalUrl) {
    return props.externalUrl;
  }
  const params = { page_size: "500", ...props.params };
  return DIANA_BASE + props.path + "?" + new URLSearchParams(params).toString();
});
</script>

<template>
  <ol-vector-layer :z-index="1">
    <ol-source-vector :url="url" :format="geoJsonFormat" ref="source" />
    <slot />
  </ol-vector-layer>
</template>
