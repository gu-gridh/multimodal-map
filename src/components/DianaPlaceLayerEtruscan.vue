<script lang="ts" setup>
import { DIANA_BASE } from "@/assets/diana";
import { computed, inject } from "vue";
import Style from 'ol/style/Style';
import type Feature from 'ol/Feature';
import Icon from 'ol/style/Icon';
import markerIcon from "@/assets/marker-white.svg";
import markerGold from "@/assets/marker-gold.svg";

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  zIndex: {
    type: Number,
    default: 1,
  },
});

const format = inject("ol-format");
const geoJsonFormat = new format.GeoJSON();

const featureStyle = (feature: Feature) => {
  const properties = feature.getProperties();
  let iconSrc;

  if (
    properties.threedhop_count > 0 ||
    properties.pointcloud_count > 0
  ) {
    iconSrc = markerGold;
  } else {
    iconSrc = markerIcon;
  }

  return new Style({
    image: new Icon({
      src: iconSrc,
      scale: 1.8,
      displacement: [-10, 45],
      anchor: [0.0, 0.0]
    })
  });
};

const url = computed(() => {
  const params = { page_size: "500", ...props.params };
  return DIANA_BASE + props.path + "?" + new URLSearchParams(params).toString();
});
</script>

<template>
  <ol-vector-layer :z-index="props.zIndex" :style="featureStyle">
    <ol-source-vector :url="url" :format="geoJsonFormat" ref="source" />
    <slot />
  </ol-vector-layer>
</template>
