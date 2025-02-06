<template>
  <div v-if="false"></div>
</template>

<script>
/**
 * A copy of SourceWMTS from vue3-openlayers but can handle custom projection.
 * See https://github.com/MelihAltintas/vue3-openlayers/issues/134
 */

import WMTS from "ol/source/WMTS";
import { inject, onMounted, onUnmounted, watch, computed } from "vue";
import { toRefs, reactive } from "vue";

function usePropsAsObjectProperties(props, ignoredKeys = []) {
  let options = toRefs(props);
  Object.keys(options).forEach((key) => {
    options[key] = options[key].value;
  });

  const properties = reactive({
    ...options,
  });

  watch(props, () => {
    options = toRefs(props);
    Object.keys(options).forEach((key) => {
      if (properties[key] != options[key].value && !ignoredKeys.includes(key)) {
        properties[key] = options[key].value;
      }
    });
  });

  return {
    properties,
  };
}

export default {
  name: "ol-source-wmts",
  setup(props) {
    const tileLayer = inject("tileLayer");
    const { properties } = usePropsAsObjectProperties(props);

    const source = computed(() => new WMTS(properties));

    watch(source, () => {
      tileLayer.value.setSource(source.value);
    });

    watch(tileLayer, () => {
      tileLayer.value.setSource(source.value);
    });

    onMounted(() => {
      tileLayer.value.setSource(source.value);
    });

    onUnmounted(() => {
      tileLayer.value.setSource(null);
    });

    return {
      tileLayer,
      source,
    };
  },
  props: {
    tileZoomLevel: {
      type: Number,
      default: 30,
    },
    attributions: {
      type: String,
    },
    cacheSize: {
      type: Number,
    },
    crossOrigin: {
      type: String,
    },
    imageSmoothing: {
      type: Boolean,
      default: true,
    },
    projection: {
      type: [String, Object],
      default: "EPSG:3857",
    },
    reprojectionErrorThreshold: {
      type: Number,
      default: 0.5,
    },
    tilePixelRatio: {
      type: Number,
      default: 1,
    },
    format: {
      type: String,
      default: "image/jpeg",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    matrixSet: {
      type: String,
    },
    tileGrid: {
      type: Object,
    },
    dimensions: {
      type: Object,
    },
    requestEncoding: {
      type: String,
      default: "KVP",
    },
    url: {
      type: String,
    },
    urls: {
      type: Array,
    },
    wrapX: {
      type: Boolean,
      default: false,
    },
    transition: {
      type: Number,
    },
    layer: {
      type: String,
    },
    style: {
      type: String,
    },
  },
};
</script>

<style lang=""></style>
