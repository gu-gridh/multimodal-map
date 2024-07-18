<script lang="ts" setup>
import { computed, ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector";
import WebGLPointsLayer from "ol/layer/WebGLPoints.js";
import { fromLonLat, toLonLat } from "ol/proj";
import { MARITIMEENCOUNTERS_BASE } from "@/assets/maritimeencounters";
import markerIcon from "@/assets/marker-white.svg";
import markerGold from "@/assets/marker-gold.svg";
import Style from "ol/style/Style";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import Icon from "ol/style/Icon";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from "ol/interaction/Select";
import { maritimeencountersStore } from "./store";
import { pointerMove } from "ol/events/condition";
import type Map from "ol/Map";

const { selectedFeature } = storeToRefs(mapStore());

let selectHover; // Select interaction for hover
const hoveredFeature = ref<Feature<Geometry> | null>(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);
const { areMapPointsLoaded } = storeToRefs(maritimeencountersStore());
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

const fetchData = async (initialUrl: string, params: Record<string, any>) => {
  let nextUrl = initialUrl;
  let initialParams = new URLSearchParams({ page_size: '1000', ...params }).toString();
  if (nextUrl && initialParams) {
    nextUrl = `${nextUrl}?${initialParams}`;
  }

  const geoJSONFormat = new GeoJSON();

  while (nextUrl) {
    const res = await fetch(nextUrl.replace(/^http:/, "https:")).catch((err) => {
      throw err;
    });

    if (!res) continue;

    const data = await res.json();

    let olFeatures = geoJSONFormat.readFeatures(data);

    //convert coordinates using fromLonLat
    olFeatures.forEach(feature => {
      let geometry = feature.getGeometry();
      if (geometry.getType() === 'Point') {
        let coords = geometry.getCoordinates();
        //Ensure valid coordinates
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          const convertedCoords = fromLonLat([coords[0], coords[1]]);
          geometry.setCoordinates(convertedCoords);
        } else {
          console.error(`Invalid coordinates for feature ID: ${feature.getId()}, Coordinates: ${coords}`);
        }
      }
    });

    //log coordinates of each feature
   /*  olFeatures.forEach(feature => {
      const geometry = feature.getGeometry();
      const coords = geometry.getCoordinates();
      const originalCoords = toLonLat(coords);
      console.log(`Feature ID: ${feature.getId()}, Coordinates: ${originalCoords}`);
    }); */

    vectorSource.value.addFeatures(olFeatures);

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
        offset: [0, 0],
        size: [30, 45],
        src: markerIcon, // Use white marker
      },
    },
    zIndex: props.zIndex,
  })
);

const clearPopups = () => {
  hoverCoordinates.value = null;
  hoveredFeature.value = null;
  selectedCoordinates.value = null;
};

onMounted(() => {
  if (map) {
    console.log(webGLPointsLayer.value)
    map.addLayer(webGLPointsLayer.value as any);

    // Initialize the select interaction for hover
    // selectHover = new Select({
    //   condition: pointerMove,
    //   layers: [webGLPointsLayer.value as any],
    // });

    // // Add select interaction to the map for hover
    // map.addInteraction(selectHover);

    // // Add an event listener for when a feature is hovered over
    // selectHover.on("select", (event) => {
    //   if (event.selected.length > 0) {
    //     const feature = event.selected[0];
    //     hoveredFeature.value = feature as any;

    //     const geometry = feature.getGeometry() as any;
    //     hoverCoordinates.value = geometry.getCoordinates();
    // } else {
    //     //clear hover information when no feature is hovered
    //     hoveredFeature.value = null;
    //     hoverCoordinates.value = null;
    //   }
    // });

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
      "https://maritime-encounters.dh.gu.se/api/resources/site_coordinates";

    vectorSource.value.clear();
    clearPopups(); // Clear the popups

    await fetchData(initialUrl, newParams);
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
      v-html="'Site ' + (hoveredFeature ? hoveredFeature.get('name') : '')"
    ></div>
  </ol-overlay>

  <ol-overlay
    class="ol-popup"
    v-if="selectedFeature"
    :position="selectedCoordinates"
  >
    <div
      class="ol-popup-content"
      v-html="'Site ' + (selectedFeature ? selectedFeature.get('name') : '')"
    ></div>
  </ol-overlay>
</template>
