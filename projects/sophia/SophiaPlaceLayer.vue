<script lang="ts" setup>
import { computed, ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector";
import WebGLPointsLayer from "ol/layer/WebGLPoints.js";
import { fromLonLat } from "ol/proj";
import { SOPHIA_BASE } from "@/assets/saintsophia";
import markerIcon from "@/assets/marker-white.svg";
import markerGold from "@/assets/marker-gold.svg";
import View from 'ol/View.js';
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import Icon from "ol/style/Icon";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from "ol/interaction/Select";
import { inscriptionsStore } from "./store";
import { pointerMove } from "ol/events/condition";
import type Map from "ol/Map";
import { Vector as VectorLayer } from "ol/layer.js"


const { selectedFeature } = storeToRefs(mapStore());

let selectHover; // Select interaction for hover
const hoveredFeature = ref<Feature<Geometry> | null>(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);
const { areMapPointsLoaded } = storeToRefs(inscriptionsStore());
const map = inject("map") as Map;
const vectorSource = ref(
  new VectorSource({
    format: new GeoJSON(),
  })
);

const props = defineProps({
  map: Object,
  params: {
    type: Object,
    default: () => ({}),
  },
  zIndex: {
    type: Number,
    default: 2,
  },
});

const updateFeatures = (features: Feature[]) => {
  const geoJSONFormat = new GeoJSON({ featureProjection: "EPSG:3857" });
  const transformedFeatures = geoJSONFormat.readFeatures({
    type: "FeatureCollection",
    features,
  });
  console.log(vectorSource.value)
  vectorSource.value.addFeatures(transformedFeatures);
};

const fetchData = async (initialUrl: string, params: Record<string, any>) => {
  let nextUrl = initialUrl;
  let initialParams = new URLSearchParams({ page_size: '500', ...params }).toString();

  if (nextUrl && initialParams) {
    nextUrl = `${nextUrl}?${initialParams}`;
  }

  while (nextUrl) {
    const res = await fetch(nextUrl.replace(/^http:/, "https:")).catch((err) => {
      throw err;
    });

    if (!res) continue;

    const data = await res.json();
    const features = data.features || [];
    // Update features immediately after fetching a batch
    updateFeatures(features);

    nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
  }
  areMapPointsLoaded.value = true; // Set to true once all points are loaded
};

// Create a WebGLPointsLayer
const webGLPointsLayer = ref(
  new WebGLPointsLayer({
    source: vectorSource.value as any,
    style: {
      symbol: {
        symbolType: "image",
        color: "#ffffff",
        offset: [0, 20],
        size: [30, 45],
        src: markerIcon, // Use white marker
      },
    },
  })
);

const styles = {
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'rgba(200,50,50)',
      width: 4,
    }),
  }),
};

// @ts-ignore
const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

const vectorLayer = new VectorLayer({
  source: vectorSource.value,
  style: styleFunction,
});

const clearPopups = () => {
  hoverCoordinates.value = null;
  hoveredFeature.value = null;
  selectedCoordinates.value = null;
};

onMounted(() => {
  if (map) {

    // map.addLayer(webGLPointsLayer.value as any);
    map.addLayer(vectorLayer as any);

    // Initialize the select interaction for hover
    selectHover = new Select({
      condition: pointerMove,
      layers: [webGLPointsLayer.value as any],
    });

    // Add select interaction to the map for hover
    map.addInteraction(selectHover);

    // Add an event listener for when a feature is hovered over
    selectHover.on("select", (event) => {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        hoveredFeature.value = feature as any;

        const geometry = feature.getGeometry() as any;
        hoverCoordinates.value = geometry.getCoordinates();
      } else {
        //clear hover information when no feature is hovered
        hoveredFeature.value = null;
        hoverCoordinates.value = null;
      }
    });

    let clickedFeatures: Feature[] = [];
    map.on("click", function (evt) {
      clickedFeatures = []; // Clear the array before each click
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        clickedFeatures.push(feature as Feature<Geometry>);
      });

      if (clickedFeatures.length === 1) {
        // Unselect the hovered feature
        hoverCoordinates.value = null;
        hoveredFeature.value = null;

        // Select the clicked feature
        selectedFeature.value = clickedFeatures[0];
        const geometry = clickedFeatures[0].getGeometry() as any;
        selectedCoordinates.value = geometry.getCoordinates();
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
  async (newParams) => {
    areMapPointsLoaded.value = false; // Reset before fetching new data
    const initialUrl =
      "https://saintsophia.dh.gu.se/api/inscriptions/coordinates/";

    vectorSource.value.clear();
    clearPopups(); // Clear the popups

    await fetchData(initialUrl, newParams);
  },
  { immediate: true }
);
</script>
<template>
  <ol-overlay class="ol-popup" v-if="hoveredFeature" :position="hoverCoordinates">
    <div class="ol-popup-content" v-html="'Panel ' + (hoveredFeature ? hoveredFeature.get('name') : '')"></div>
  </ol-overlay>

  <ol-overlay class="ol-popup" v-if="selectedFeature" :position="selectedCoordinates">
    <div class="ol-popup-content" v-html="'Panel ' + (selectedFeature ? selectedFeature.get('name') : '')"></div>
  </ol-overlay>
</template>
