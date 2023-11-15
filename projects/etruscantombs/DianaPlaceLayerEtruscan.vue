<script lang="ts" setup>
// @ts-nocheck
import { computed, ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import { fromLonLat } from 'ol/proj';
import { DIANA_BASE } from "@/assets/diana";
import markerIcon from "@/assets/marker-white.svg";
import markerGold from "@/assets/marker-gold.svg";
import Style from 'ol/style/Style';
import type Feature from 'ol/Feature';
import Icon from 'ol/style/Icon';
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from 'ol/interaction/Select';
import { etruscanStore } from "./store";
import { pointerMove } from 'ol/events/condition';
import {transformExtent} from 'ol/proj';

const { selectedFeature } = storeToRefs(mapStore());

let selectHover; // Select interaction for hover
let controller = new AbortController();
let signal = controller.signal;
const hoveredFeature = ref(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);
const { areMapPointsLoaded } = storeToRefs(etruscanStore());
const map = inject('map');
const vectorSource = ref(new VectorSource());

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
    default: 2,
  },
});

const getCurrentBoundingBox = () => {
  if (!map || !map.getView() || !map.getView().getCenter()) {
    console.error("Map view or center is not initialized.");
    return;
  }

  const extent = map.getView().calculateExtent();
  const transformedExtent = transformExtent(extent, 'EPSG:3857', 'EPSG:4326'); 
  let [minX, minY, maxX, maxY] = transformedExtent; 

  const offsetX = (maxX - minX) * 0.15;  // reduce the width by 15%
  const offsetY = (maxY - minY) * 0.25;  // increase the height by 25%

  // Adjust the bounding box
  minX += offsetX;  
  minY -= offsetY;  
  maxX -= offsetX;  
  maxY += offsetY; 

  return `${minX},${minY},${maxX},${maxY}`;
};

const updateFeatures = (features) => {
  const geoJSONFormat = new GeoJSON({ featureProjection: "EPSG:3857" });
  const transformedFeatures = geoJSONFormat.readFeatures(
    { type: "FeatureCollection", features }
  );
  
  vectorSource.value.addFeatures(transformedFeatures);
};

const fetchData = async (initialUrl, params) => {
  let nextUrl = initialUrl;
  const bbox = getCurrentBoundingBox();
  let initialParams = new URLSearchParams({ page_size: 70, in_bbox: bbox, ...params }).toString();

  // Cancel the previous fetch
  controller.abort();
  controller = new AbortController();
  signal = controller.signal;

  if (nextUrl && initialParams) {
    nextUrl = `${nextUrl}?${initialParams}`;
  }

  while (nextUrl) {
    const res = await fetch(nextUrl.replace(/^http:/, 'https:'), { signal })
      .catch(err => {
        // Handle the abort error gracefully
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          nextUrl = null;  // Stop the loop
          return null;
        }
        // If it's another error, it will propagate
        throw err;
      });
    
    // If the fetch was aborted, skip to the next iteration
    if (!res) continue;

    const data = await res.json();
    const features = data.features || [];

    // Update features immediately after fetching a batch
    updateFeatures(features);

    nextUrl = data.next ? data.next.replace(/^http:/, 'https:') : null;
  }
  areMapPointsLoaded.value = true; // Set to true once all points are loaded
};

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
    map.on('moveend', async () => {
      const initialUrl = "https://diana.dh.gu.se/api/etruscantombs/geojson/place/";
      fetchData(initialUrl, props.params);
    });
  } else {
    console.error("Map object is not initialized.");
  }
});

watch(
  () => props.params,
  async (newParams) => {
    areMapPointsLoaded.value = false;  // Reset before fetching new data
    const initialUrl = "https://diana.dh.gu.se/api/etruscantombs/geojson/place/";

    vectorSource.value.clear();
    clearPopups(); // Clear the popups
    
    await fetchData(initialUrl, newParams);
  },
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
