<script lang="ts" setup>
import { computed, ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import { fromLonLat } from 'ol/proj';
import { DIANA_BASE } from "@/assets/diana";
import markerIcon from "@/assets/marker-white-etruscan.svg";
import markerGold from "@/assets/marker-gold.svg";
import Style from 'ol/style/Style';
import type Feature from 'ol/Feature';
import Icon from 'ol/style/Icon';
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from 'ol/interaction/Select';
import { pointerMove } from 'ol/events/condition';

const { selectedFeature } = storeToRefs(mapStore());

let selectHover; // Select interaction for hover
const hoveredFeature = ref(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);

const props = defineProps({
  map: Object,
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

const map = inject('map');

const vectorSource = ref(new VectorSource({
  url: computed(() => {
    const params = { page_size: "500", ...props.params };
    return DIANA_BASE + props.path + "?" + new URLSearchParams(params).toString();
  }).value,
  format: new GeoJSON(),
}));

// Create a WebGLPointsLayer
const webGLPointsLayer = ref(
  new WebGLPointsLayer({
    source: vectorSource.value,
    style: {
      symbol: {
        symbolType: 'image',
        color: '#ffffff',
        offset: [0, 20], 
        size: [30, 45],
        src: markerIcon,  // Use white marker
      },
    },
  })
);

const clearPopups = () => {
  hoverCoordinates.value = null;
  hoveredFeature.value = null;
  selectedCoordinates.value = null;
};

onMounted(() => {
  if (map) {
    map.addLayer(webGLPointsLayer.value);

    // Initialize the select interaction for hover
    selectHover = new Select({
      condition: pointerMove,
      layers: [webGLPointsLayer.value],
    });

    // Add select interaction to the map for hover
    map.addInteraction(selectHover);

    // Add an event listener for when a feature is hovered over
    selectHover.on('select', (event) => {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        hoveredFeature.value = feature;
        hoverCoordinates.value = feature.getGeometry().getCoordinates();
      }
    });

    let clickedFeatures: Feature[] = [];
    map.on('click', function(evt) {
      clickedFeatures = [];  // Clear the array before each click
      map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        clickedFeatures.push(feature);  // Push each feature into the array
      });

      if (clickedFeatures.length === 1) {
        // Unselect the hovered feature
        hoverCoordinates.value = null;
        hoveredFeature.value = null;
        
        // Select the clicked feature
        selectedFeature.value = clickedFeatures[0];
        selectedCoordinates.value = clickedFeatures[0].getGeometry().getCoordinates();
      } else {
        selectedCoordinates.value = undefined as any;  
        selectedFeature.value = undefined;
      }
    });
  } else {
    console.error("Map object is not initialized.");
  }
});

watch(
  () => props.params,
  (newParams) => {
    const params = { page_size: "500", ...newParams };
    const newUrl = DIANA_BASE + props.path + "?" + new URLSearchParams(params).toString();
    
    // Debug log
    // console.log("New URL:", newUrl);

    vectorSource.value.setUrl(newUrl);
    vectorSource.value.refresh();  // Force a reload
    
    clearPopups(); // Clear the popups
  },
  { immediate: true }
);
</script>
<template>
    <ol-overlay
      class="ol-popup"
      v-if="hoveredFeature"
      :position="hoverCoordinates"
    >
      <div
        class="ol-popup-content"
        v-html="'Tomb ' + (hoveredFeature ? hoveredFeature.get('name') : '')"
      >
      </div>
    </ol-overlay>
    
    <ol-overlay
      class="ol-popup"
      v-if="selectedFeature"
      :position="selectedCoordinates"
    >
      <div
        class="ol-popup-content"
        v-html="'Tomb ' + (selectedFeature ? selectedFeature.get('name') : '')"
      >
      </div>
    </ol-overlay>
</template>
