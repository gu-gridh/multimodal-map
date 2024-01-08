<script lang="ts" setup>
import { computed, ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector";
import WebGLPointsLayer from "ol/layer/WebGLPoints.js";
import { fromLonLat } from "ol/proj";
import { DIANA_BASE } from "@/assets/diana";
import markerIcon from "@/assets/marker-white.svg";
import markerGold from "@/assets/marker-gold.svg";
import Style from "ol/style/Style";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import Icon from "ol/style/Icon";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from "ol/interaction/Select";
import { sonoraStore } from "./store";
import { pointerMove } from "ol/events/condition";
import type Map from "ol/Map";
import Point from "ol/geom/Point";

const { selectedFeature } = storeToRefs(mapStore());

let selectHover; // Select interaction for hover
const hoveredFeature = ref<Feature<Geometry> | null>(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);
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

const fetchData = async () => {
  const apiUrl = "https://orgeldatabas.gu.se/webgoart/goart/map.php?bbox=-5.229492,54.495568,34.101563,70.065585";
  
  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const geoJSONFormat = new GeoJSON({ featureProjection: "EPSG:3857" });
      const transformedFeatures = data.features.map(feature => {
        const coords = feature.geometry.coordinates;
        feature.properties.name = feature.properties.Building;
        return feature;
    });

    const transformedData = {
      type: "FeatureCollection",
      features: transformedFeatures,
    };

    vectorSource.value.addFeatures(geoJSONFormat.readFeatures(transformedData));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
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

const clearPopups = () => {
  hoverCoordinates.value = null;
  hoveredFeature.value = null;
  selectedCoordinates.value = null;
};

onMounted(() => {
  if (map) {
    fetchData();

    map.addLayer(webGLPointsLayer.value as any);

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

// watch(
//   () => props.params,
//   async (newParams) => {
//     areMapPointsLoaded.value = false; // Reset before fetching new data
//     const initialUrl =
//       "https://diana.dh.gu.se/api/etruscantombs/coordinates";

//     vectorSource.value.clear();
//     clearPopups(); // Clear the popups

//     await fetchData(initialUrl, newParams);
//   },
//   { immediate: true }
// );

</script>

<template>
  <ol-overlay
    class="ol-popup"
    v-if="hoveredFeature"
    :position="hoverCoordinates"
  >
    <div
      class="ol-popup-content"
      v-html="(hoveredFeature ? hoveredFeature.get('name') : '')"
    ></div>
  </ol-overlay>

  <ol-overlay
    class="ol-popup"
    v-if="selectedFeature"
    :position="selectedCoordinates"
  >
    <div
      class="ol-popup-content"
      v-html="(selectedFeature ? selectedFeature.get('name') : '')"
    ></div>
  </ol-overlay>
</template>
