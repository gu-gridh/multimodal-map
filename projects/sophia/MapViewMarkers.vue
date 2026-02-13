<script setup>
import { ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from "ol/interaction/Select";
import { inscriptionsStore } from "./settings/store";
import { pointerMove } from "ol/events/condition";
import { Vector as VectorLayer } from "ol/layer.js";

let selectHover;
let currentFloorRequestId = 0;

const emit = defineEmits(["deselect-surface"]);
const mapState = mapStore();
const { selectedFeature } = storeToRefs(mapStore());
const { zoom } = storeToRefs(mapState);
const hoveredFeature = ref(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);
const { areMapPointsLoaded, panelStr, panelId, inscriptionId } = storeToRefs(inscriptionsStore());
const map = inject("map");
const vectorSource = ref(
  new VectorSource({
    format: new GeoJSON(),
  })
);

const props = defineProps({
  map: Object,
  zIndex: {
    type: Number,
    default: 2,
  },
  showSecondFloor: {
    type: Boolean,
    default: false,
  },
});

const updateFeatures = (features) => {
  const geoJSONFormat = new GeoJSON({ featureProjection: "EPSG:3857" });
  const transformedFeatures = geoJSONFormat.readFeatures({
    type: "FeatureCollection",
    features,
  });
  vectorSource.value.addFeatures(transformedFeatures);
};

const fetchData = async (initialUrl, isSecondFloor, requestId) => {
  let nextUrl = initialUrl;
  const initialParams = new URLSearchParams({ page_size: "500" }).toString();

  if (nextUrl && initialParams) {
    if (!isSecondFloor) {
      nextUrl = `${nextUrl}?${initialParams}&floor=1&published=true`;
    } else {
      nextUrl = `${nextUrl}?${initialParams}&floor=2&published=true`;
    }
  }

  while (nextUrl) {
    if (requestId !== currentFloorRequestId) {
      return;
    }

    const res = await fetch(nextUrl.replace(/^http:/, "https:")).catch((err) => {
      throw err;
    });

    if (!res) continue;

    const data = await res.json();
    const features = data.features || [];

    if (requestId !== currentFloorRequestId) {
      return;
    }

    updateFeatures(features);

    nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
  }

  if (requestId === currentFloorRequestId) {
    areMapPointsLoaded.value = true;
  }
};

const styles = {
  MultiLineString: new Style({
    stroke: new Stroke({
      color: "rgba(180,80,80, 0.7)",
      width: 10,
    }),
  }),
};

// hover style
const hoverStyle = new Style({
  stroke: new Stroke({
    color: "rgba(220, 0, 0, 1.0)",
    width: 13,
  }),
});

const colorMappingByInscriptions = [
  { min: 1, max: 5, color: "rgba(255, 255, 128, 0.7)" }, //few inscriptions
  { min: 6, max: 10, color: "rgba(255, 200, 100, 0.7)" },
  { min: 11, max: 19, color: "rgba(255, 150, 80, 0.7)" },
  { min: 20, max: 39, color: "rgba(255, 100, 60, 0.8)" },
  { min: 40, max: 59, color: "rgba(255, 60, 40, 0.9)" },
  { min: 60, max: 79, color: "rgba(200, 40, 30, 0.9)" },
  { min: 80, max: Infinity, color: "rgba(180, 0, 0, 1.0)" }, //many inscriptions
];

const getColorByInscriptions = (numberOfInscriptions) => {
  const mapping = colorMappingByInscriptions.find(
    (range) =>
      numberOfInscriptions >= range.min &&
      numberOfInscriptions <= range.max
  );
  return mapping ? mapping.color : "rgba(0, 0, 0, 0.0)";
};

const styleFunction = function (feature) {
  const numInscriptions = feature.get("number_of_inscriptions");
  const dataAvailable = feature.get("data_available");

  let color;

  if (typeof numInscriptions !== "number" || numInscriptions === 0) {
    color = "rgba(50, 0, 0, 0.1)"; //default gray for no inscriptions
    if (dataAvailable > 1) {
      color = "rgba(155, 55, 0, 0.3)"; //if there is visible data but no registered inscriptions
    }
  } else {
    color = getColorByInscriptions(numInscriptions);
  }

  return new Style({
    stroke: new Stroke({
      color: color,
      width: 10,
    }),
  });
};

const vectorLayer = new VectorLayer({
  source: vectorSource.value,
  style: styleFunction,
});

const getFeatureCenterCoordinate = (feature) => {
  const geometry = feature?.getGeometry();
  if (!geometry) return null;

  const type = geometry.getType();
  if (type === "MultiLineString" && geometry.getLineString) {
    return geometry.getLineString(0).getCoordinateAt(0.5);
  }

  return geometry.getFirstCoordinate ? geometry.getFirstCoordinate() : null;
};

const clearPopups = () => {
  hoverCoordinates.value = null;
  hoveredFeature.value = null;
  selectedCoordinates.value = null;
};

onMounted(() => {
  if (map) {
    vectorLayer.setZIndex(props.zIndex); //set the zIndex based on props

    map.addLayer(vectorLayer);

    selectHover = new Select({
      condition: pointerMove,
      style: null,
    });

    map.addInteraction(selectHover);

    let debounceHoverTimer;

    selectHover.on("select", (event) => {
      clearTimeout(debounceHoverTimer);

      debounceHoverTimer = setTimeout(() => {
        handleHover(event);
      }, 20);

      event.deselected.forEach((feature) => {
        feature.setStyle(undefined);
      });
    });

    function handleHover(event) {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        hoveredFeature.value = feature;
        feature.setStyle(hoverStyle); //apply the hover style
        const geometry = feature.getGeometry();
        hoverCoordinates.value =
          geometry.getLineString(0).getCoordinateAt(0.5);
      } else {
        //clear hover information when no feature is hovered
        hoveredFeature.value = null;
        hoverCoordinates.value = null;
      }
    }

    let clickedFeatures = [];
    map.on("click", function (evt) {
      clickedFeatures = []; // Clear the array before each click
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        clickedFeatures.push(feature);
      });

      if (clickedFeatures.length >= 1) {
        //unselect the hovered feature
        hoverCoordinates.value = null;
        hoveredFeature.value = null;

        //select the clicked feature
        selectedFeature.value = clickedFeatures[0];
        const centerCoordinate = getFeatureCenterCoordinate(
          clickedFeatures[0]
        );
        selectedCoordinates.value = centerCoordinate;
        if (centerCoordinate) {
          mapState.updateCenter(centerCoordinate);
          if (zoom.value < 15) {
            mapState.updateZoom(15);
          }
        }

        //set store value
        inscriptionId.value = null;
        panelStr.value = selectedFeature.value.values_?.title || "";
      } else {
        selectedCoordinates.value = undefined;
        selectedFeature.value = undefined;
        emit("deselect-surface");
      }
    });
  } else {
    console.error("Map object is not initialized.");
  }
});

const selectFeatureByPanel = () => {
  if (!areMapPointsLoaded.value || (!panelId.value && !panelStr.value)) {
    return;
  }

  let feature =
    panelId.value !== null
      ? vectorSource.value.getFeatureById(panelId.value) ||
      vectorSource.value.getFeatureById(panelId.value?.toString())
      : null;

  if (!feature && panelStr.value) {
    feature = vectorSource.value.getFeatures().find((feat) => {
      const title = feat.get("title");
      return (
        typeof title === "string" &&
        title.toLowerCase() === panelStr.value.toLowerCase()
      );
    });
  }

  if (!feature) return;

  selectedFeature.value = feature;
  const centerCoordinate = getFeatureCenterCoordinate(feature);
  selectedCoordinates.value = centerCoordinate;

  if (centerCoordinate) {
    mapState.updateCenter(centerCoordinate);
    if (zoom.value < 15) {
      mapState.updateZoom(15);
    }
  }
};

watch(
  () => [areMapPointsLoaded.value, panelId.value, panelStr.value],
  () => {
    selectFeatureByPanel();
  },
  { immediate: true }
);

watch(
  () => props.showSecondFloor,
  (newFloor) => {
    const requestId = ++currentFloorRequestId;

    areMapPointsLoaded.value = false;
    const initialUrl =
      "https://saintsophia.dh.gu.se/api/inscriptions/coordinates/";

    vectorSource.value.clear();
    clearPopups(); // Clear the popups

    fetchData(initialUrl, newFloor, requestId);
  },
  { immediate: true }
);
</script>

<template>
  <ol-overlay v-if="hoveredFeature" :position="hoverCoordinates">
    <div class="ol-popup" v-html="'Surface ' + (hoveredFeature ? hoveredFeature.get('title') : '')"></div>
  </ol-overlay>

  <ol-overlay v-if="selectedFeature" :position="selectedCoordinates">
    <div class="ol-popup" v-html="'Surface ' + (selectedFeature ? selectedFeature.get('title') : '')"></div>
  </ol-overlay>
</template>

<style></style>
