<script setup lang="ts">
import { ref, onMounted } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps({
  src: String,
});

const viewerEl = ref();

onMounted(() =>
  OpenSeadragon({
    /** @see https://openseadragon.github.io/docs/OpenSeadragon.html#.Options */
    element: viewerEl.value,
    immediateRender: true,
    visibilityRatio: 1,
    minZoomImageRatio: 1,
    showZoomControl: true,
    showHomeControl: false,
    showFullPageControl: true,
    prefixUrl: "/openseadragon/",
    // If a proper tileSource is not given, use src prop.
    tileSources: props.src,
  })
);
</script>

<template>
  <div ref="viewerEl" class="osd"></div>
</template>

<style scoped></style>
