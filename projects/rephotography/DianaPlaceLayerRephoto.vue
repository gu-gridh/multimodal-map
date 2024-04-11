<template>
  <div v-if="hoveredFeatureInfo" :style="{position: 'absolute', left: `${hoverPosition.x}px`, top: `${hoverPosition.y}px`}" class="hover-info">{{ hoveredFeatureInfo }}</div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref, inject, watch, nextTick, reactive } from 'vue';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import type Feature from "ol/Feature";
import type Map from 'ol/Map';

const map = inject("map") as Map | undefined;
const props = defineProps({
  geojsonUrl: { type: String, required: true },
  zIndex: { type: Number, default: 2 },
  isVisible: { type: Boolean, required: true },
  date: { type: Boolean }
});

const vectorSource = new VectorSource({ format: new GeoJSON(), url: props.geojsonUrl });
const hoveredFeatureInfo = ref<string | null>(null);
const hoverPosition = reactive({ x: 0, y: 0 });

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({ color: 'rgba(255, 255, 255, 0.7)', width: 2 }),
    fill: new Fill({ color: 'rgba(255, 255, 255, 0.1)' }),
  }),
  zIndex: props.zIndex,
});

const featureOverlay = new VectorLayer({
  source: new VectorSource(),
  map: map,
  style: new Style({
    stroke: new Stroke({ color: '#f00', width: 2 }),
    fill: new Fill({ color: 'rgba(255,0,0,0.1)' }),
  }),
});

let highlight;

function initializeHoverLogic() {
  if (!map) return;
  map.on('pointermove', (evt) => {
    if (evt.dragging) return;

    const pixel = map.getEventPixel(evt.originalEvent);
    const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);

    if (feature) {
      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource().removeFeature(highlight);
        }
        featureOverlay.getSource().addFeature(feature);
        highlight = feature;

        let name = feature.get('NAME');
        let date = feature.get('Date') ? formatDate(feature.get('Date').toString()) : null;

        let info = '';
        if (name && date) {
          info = `${name} - ${date}`;
        } else if (name) {
          info = name;
        } else if (date) {
          info = date;
        }

        if (info) {
          hoveredFeatureInfo.value = info;
          hoverPosition.x = evt.pixel[0];
          hoverPosition.y = evt.pixel[1];
        } else {
          hoveredFeatureInfo.value = null;
        }
      }
    } else {
      if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
        highlight = null;
        hoveredFeatureInfo.value = null;
      }
    }
  });
}

function formatDate(dateStr) {
  if (!dateStr || dateStr.length !== 8) return 'Invalid date';
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}


onMounted(() => {
  nextTick(() => {
    if (map && props.isVisible) {
      map.addLayer(vectorLayer);
      initializeHoverLogic();
    }
  });
});

watch(() => props.isVisible, (newValue, oldValue) => {
  if (!newValue) {
    if (map && map.getLayers().getArray().includes(vectorLayer)) {
      map.removeLayer(vectorLayer);
    }
  } else {
    if (map && !map.getLayers().getArray().includes(vectorLayer)) {
      map.addLayer(vectorLayer);
      initializeHoverLogic();
    }
  }
});
</script>

<style>
.hover-info {
  background-color: white;
  padding: 5px;
  border-radius: 3px;
  z-index: 100;
}
</style>
