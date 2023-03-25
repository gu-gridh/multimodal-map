<script lang="ts" setup>
import { ref } from "vue";
import proj4 from "proj4";
import { get as getProjection } from "ol/proj";
import { register } from "ol/proj/proj4";
import { type Options, optionsFromCapabilities } from "ol/source/WMTS";
import axios from "axios";
import { WMTSCapabilities } from "ol/format";
import SourceWMTSRephotography from "./SourceWMTSRephotography.vue";

const props = defineProps({
  capabilitiesUrl: {
    type: String,
    required: true,
  },
});

const options = ref<Options>();

proj4.defs(
  "EPSG:25833",
  "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
);
register(proj4);
const projection = getProjection("EPSG:25833");

(async () => {
  const response = await axios.get(props.capabilitiesUrl);
  const parser = new WMTSCapabilities();
  const capabilities = parser.read(response.data);
  options.value =
    optionsFromCapabilities(capabilities, {
      layer: capabilities.Contents.Layer[0].Identifier,
      projection,
    }) || undefined;
  console.log({
    projection,
    capabilities,
    options: options.value,
  });
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
  /></ol-tile-layer>
</template>
