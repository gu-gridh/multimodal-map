<script lang="ts" setup>
// @ts-nocheck
import { ref, computed, inject, onMounted } from "vue";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
import { DIANA_BASE } from "@/assets/dianaRephotography";
import Layer from 'ol/layer/Layer.js';

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
   zIndex: {
    type: Number,
    default: 0,
  },
  style: {
    type: Object,
    default: () => ({
      'stroke-color': [0, 0, 0, 0.2],
      'stroke-width': 1,
      'fill-color': [255, 255, 255, 0.6]
    }),
  },
});

const map = inject('map');
const format = inject("ol-format");
const geoJsonFormat = new format.GeoJSON();
const layer = ref(null); // Initialize the ref for the layer

const url = computed(() => {
  if (props.externalUrl) {
    return props.externalUrl;
  }
  const params = { page_size: "500", ...props.params };
  return DIANA_BASE + props.path + "?" + new URLSearchParams(params).toString();
});

class WebGLVectorLayer extends Layer {
  createRenderer() {
    try {
      return new WebGLVectorLayerRenderer(this, { style: props.style });
    } catch (error) {
      console.error('Failed to create WebGLVectorLayerRenderer:', error.message);
      return null;
    }
  }
}

const vectorSource = new VectorSource({
  url: url.value,
  format: geoJsonFormat
});

// Create the vector layer
const vectorLayer = new WebGLVectorLayer({
  source: vectorSource,
  zIndex: props.zIndex // Set the zIndex from props
});

onMounted(() => {
  try {
    if (map) {
      console.log("Current map layers: ", map.getLayers().getArray());
      map.addLayer(vectorLayer);
      console.log('Layer added');
    }
  } catch (e) {
    console.error("An error occurred during component mounting: ", e);
  }
});

</script>

<template>

</template>
