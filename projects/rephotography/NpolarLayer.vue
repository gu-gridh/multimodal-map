<script setup>
import { ref } from "vue";
import { optionsFromCapabilities } from "ol/source/WMTS";
import axios from "axios";
import { WMTSCapabilities } from "ol/format";
import SourceWMTSRephotography from "./SourceWMTSRephotography.vue";

const props = defineProps({
  capabilitiesUrl: {
    type: String,
    required: true,
  },
});

const options = ref();

(async () => {
  const response = await axios.get(props.capabilitiesUrl);
  const parser = new WMTSCapabilities();
  const capabilities = parser.read(response.data);
  options.value =
    optionsFromCapabilities(capabilities, {
      layer: capabilities.Contents.Layer[0].Identifier,
    }) || undefined;
})();
</script>

<template>
  <ol-tile-layer v-if="options">
    <SourceWMTSRephotography
      :urls="options.urls"
      :format="options.format"
      :layer="options.layer"
      :matrix-set="options.matrixSet"
      :projection="options.projection"
      :request-encoding="options.requestEncoding"
      :style="options.style"
      :tile-grid="options.tileGrid"
      :wrap-x="options.wrapX"
      crossOrigin="anonymous"
  /></ol-tile-layer>
</template>
