<script setup>
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

const url = computed(() => {
  const params = { page_size: "500", ...props.params };
  return DIANA_BASE + props.path + "?" + new URLSearchParams(params).toString();
  
 /*  const finalUrl = DIANA_BASE + props.path + "?" + new URLSearchParams(params).toString();
  console.log("Generated URL: ", finalUrl);  // This will log the generated URL
  return finalUrl; */
});
</script>

<template>
  <ol-vector-layer :z-index="1">
    <ol-source-vector :url="url" :format="geoJsonFormat" ref="source"/>
    <slot />
  </ol-vector-layer>
</template>
