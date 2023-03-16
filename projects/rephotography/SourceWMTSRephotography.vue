<template>
  <div v-if="false"></div>
</template>

<script lang="ts">
/**
 * A copy of SourceWMTS from vue3-openlayers but can handle custom projection.
 * See https://github.com/MelihAltintas/vue3-openlayers/issues/134
 */

import WMTS, { type Options } from "ol/source/WMTS";
import Projection from "ol/proj/Projection";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { get as getProjection } from "ol/proj";
import { getTopLeft, getWidth } from "ol/extent";
import { inject, onMounted, onUnmounted, watch, computed, type Ref } from "vue";
import { toRefs, reactive } from "vue";
import type TileLayer from "ol/layer/Tile";

function usePropsAsObjectProperties(props: any, ignoredKeys: string[] = []) {
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
  setup(props: any) {
    const tileLayer = inject("tileLayer") as Ref<TileLayer<any>>;
    const { properties } = usePropsAsObjectProperties(props);

    const source = computed(() => new WMTS(properties as any));

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
