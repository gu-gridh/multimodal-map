<script setup>
import { ref, onMounted, inject, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector";
import WebGLPointsLayer from "ol/layer/WebGLPoints.js";
import { fromLonLat } from "ol/proj";
import markerIcon from "@/assets/marker-sonora.svg";
import Feature from "ol/Feature";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from "ol/interaction/Select";
import { sonoraStore } from "./settings/store";
import { pointerMove } from "ol/events/condition";
import Point from "ol/geom/Point";

const props = defineProps({
  map: Object,
  apiUrl: String,
  zIndex: {
    type: Number,
    default: 2,
  },
});

let selectHover; // Select interaction for hover
const { selectedBuilderId, noPlaceCount, builderLayerVisible } = storeToRefs(sonoraStore());
const { selectedFeature } = storeToRefs(mapStore());
const hoveredFeature = ref(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);
const map = inject("map");
const vectorSource = ref(
  new VectorSource({
    format: new GeoJSON(),
  })
);

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const geoJSONFormat = new GeoJSON({ featureProjection: "EPSG:3857" });

    //Clear existing features
    vectorSource.value.clear();

    // Map over the features and transform them
    const transformedFeatures = data.features
      .filter(feature => feature.geometry && feature.geometry.coordinates) // Filter out invalid features
      .map(feature => {
        const coords = feature.geometry.coordinates;
        feature.properties.name = feature.properties.Building;
        feature.properties.number = feature.properties.Nr;
        return feature;
      });

    const transformedData = {
      type: "FeatureCollection",
      features: transformedFeatures,
    };

    vectorSource.value.addFeatures(geoJSONFormat.readFeatures(transformedData));

    const lastFeature = data.features[data.features.length - 1];
    if (lastFeature && 'no_place' in lastFeature) {
      noPlaceCount.value = lastFeature.no_place;
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Create a WebGLPointsLayer
const webGLPointsLayer = ref(
  new WebGLPointsLayer({
    source: vectorSource.value,
    style: {
      symbol: {
        symbolType: "image",
        color: "#ffffff",
        offset: [0, 20],
        size: [25, 35],
        src: markerIcon,
      },
    },
  })
);

const clearPopups = () => {
  hoverCoordinates.value = null;
  hoveredFeature.value = null;
  selectedCoordinates.value = null;
};

const handleBuilderIdChange = async (newId) => {
  if (newId) {
    clearPopups();
    try {
      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/builder.php?id=${newId}&lang=sv`);
      const builderData = await response.json();

      //Clear existing features
      vectorSource.value.clear();

      Object.values(builderData).forEach(builder => {
        if (builder.lng && builder.lat) {
          const coordinates = fromLonLat([parseFloat(builder.lng), parseFloat(builder.lat)]);
          const builderFeature = new Feature({
            geometry: new Point(coordinates),
            name: builder.place,
            place_nr: builder.place_nr,
          });

          vectorSource.value.addFeature(builderFeature);
        }
      });

      if ('no_organs' in builderData) {
        noPlaceCount.value = builderData.no_organs;
      }

    } catch (error) {
      console.error("Error fetching builder data:", error);
    }
  }
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
    let debounceHoverTimer;
    selectHover.on("select", (event) => {
      clearTimeout(debounceHoverTimer);
      debounceHoverTimer = setTimeout(() => {
        handleHover(event);
      }, 20);
    });

    function handleHover(event) {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        hoveredFeature.value = feature;
        const geometry = feature.getGeometry();
        hoverCoordinates.value = geometry.getCoordinates();
      } else {
        //clear hover information when no feature is hovered
        hoveredFeature.value = null;
        hoverCoordinates.value = null;
      }
    }

    let clickedFeatures;
    map.on("click", function (evt) {
      clickedFeatures = []; // Clear the array before each click
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        clickedFeatures.push(feature);
      });

      if (clickedFeatures.length === 1) {
        // Unselect the hovered feature
        hoverCoordinates.value = null;
        hoveredFeature.value = null;

        // Select the clicked feature
        selectedFeature.value = clickedFeatures[0];
        const geometry = clickedFeatures[0].getGeometry();
        selectedCoordinates.value = geometry.getCoordinates();
      } else {
        selectedCoordinates.value = undefined;
        selectedFeature.value = undefined;
      }
    });

    //check if selectedBuilderId is not 0 on mount
    if (selectedBuilderId.value !== 0) {
      handleBuilderIdChange(selectedBuilderId.value);
    } else {
      fetchData(props.apiUrl);
    }
  } else {
    console.error("Map object is not initialized.");
  }
});

watch(selectedFeature, (newValue, oldValue) => {
  clearPopups();
});

watch(() => props.apiUrl, (newUrl) => {
  if (newUrl && selectedBuilderId.value === 0) {
    fetchData(newUrl);
  }
}, { immediate: true });

watch(selectedBuilderId, (newId) => {
  if (newId) {
    handleBuilderIdChange(newId);
  } else {
    fetchData(props.apiUrl);
  }
});

watch(() => builderLayerVisible.value, (newId) => {
  if (builderLayerVisible.value === false) {
    // Refetch the data when a place is deselected
    fetchData(props.apiUrl);
  }
});
</script>

<template>
  <ol-overlay class="ol-popup" v-if="hoveredFeature" :position="hoverCoordinates">
    <div class="ol-popup-content" v-html="(hoveredFeature ? hoveredFeature.get('name') : '')"></div>
  </ol-overlay>

  <ol-overlay class="ol-popup" v-if="selectedFeature" :position="selectedCoordinates">
    <div class="ol-popup-content" v-html="(selectedFeature ? selectedFeature.get('name') : '')"></div>
  </ol-overlay>
</template>
