<script lang="ts" setup>
import { ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import Select from "ol/interaction/Select";
import { inscriptionsStore } from "./settings/store";
import { pointerMove } from "ol/events/condition";
import type Map from "ol/Map";
import { Vector as VectorLayer } from "ol/layer.js"

let selectHover;
const { selectedFeature } = storeToRefs(mapStore());
const hoveredFeature = ref<Feature<Geometry> | null>(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);
const { areMapPointsLoaded, panelStr } = storeToRefs(inscriptionsStore());
const map = inject("map") as Map;
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
  }
});

const updateFeatures = (features: Feature[]) => {
  const geoJSONFormat = new GeoJSON({ featureProjection: "EPSG:3857" });
  const transformedFeatures = geoJSONFormat.readFeatures({
    type: "FeatureCollection",
    features,
  });
  vectorSource.value.addFeatures(transformedFeatures);
};

const fetchData = async (initialUrl: string, isSecondFloor: Boolean) => {
  let nextUrl = initialUrl;
  let initialParams = new URLSearchParams({ page_size: '500' }).toString();

  if (nextUrl && initialParams) {
    if (!isSecondFloor) {
      nextUrl = `${nextUrl}?${initialParams}&floor=1&published=true`;
    }
    else if (isSecondFloor) {
      nextUrl = `${nextUrl}?${initialParams}&floor=2&published=true`;
    }
  }
  while (nextUrl) {
    const res = await fetch(nextUrl.replace(/^http:/, "https:")).catch((err) => {
      throw err;
    });

    if (!res) continue;

    const data = await res.json();
    const features = data.features || [];
    updateFeatures(features);

    nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
  }
  areMapPointsLoaded.value = true; //set to true once all points are loaded
};

const styles = {
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'rgba(180,80,80, 0.7)',
      width: 10,
    }),
  }),
};

// hover style
const hoverStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(220, 0, 0, 1.0)',
    width: 13,
  }),
});

const colorMappingByInscriptions = [
  { min: 1, max: 5, color: 'rgba(255, 255, 128, 0.6)' },   //few inscriptions
  { min: 6, max: 10, color: 'rgba(255, 200, 100, 0.6)' },
  { min: 11, max: 19, color: 'rgba(255, 150, 80, 0.7)' },
  { min: 20, max: 39, color: 'rgba(255, 100, 60, 0.8)' },
  { min: 40, max: 59, color: 'rgba(255, 60, 40, 0.9)' },
  { min: 60, max: 79, color: 'rgba(200, 40, 30, 0.9)' },
  { min: 80, max: Infinity, color: 'rgba(180, 0, 0, 1.0)' }, //many inscriptions
];

const getColorByInscriptions = (numberOfInscriptions: number) => {
  const mapping = colorMappingByInscriptions.find(
    (range) => numberOfInscriptions >= range.min && numberOfInscriptions <= range.max
  );
  return mapping ? mapping.color : 'rgba(0, 0, 0, 0.0)';
};

const styleFunction = function (feature: Feature<Geometry>) {
  const numInscriptions = feature.get('number_of_inscriptions');
  const dataAvailable = feature.get('data_available');

  let color;

  if (typeof numInscriptions !== 'number' || numInscriptions === 0) {
    color = 'rgba(50, 0, 0, 0.1)'; // default gray for no inscriptions
    if (dataAvailable > 1) {
      color = 'rgba(155, 55, 0, 0.3)'; // if there is visible data but no registered inscriptions
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

const clearPopups = () => {
  hoverCoordinates.value = null;
  hoveredFeature.value = null;
  selectedCoordinates.value = null;
};

onMounted(() => {
  if (map) {
    vectorLayer.setZIndex(props.zIndex); //set the zIndex based on props

    map.addLayer(vectorLayer as any);

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
        hoveredFeature.value = feature as any;
        feature.setStyle(hoverStyle); //apply the hover style
        const geometry = feature.getGeometry() as any;
        hoverCoordinates.value = geometry.getFirstCoordinate();
      } else { //clear hover information when no feature is hovered
        hoveredFeature.value = null;
        hoverCoordinates.value = null;
      }
    }


    let clickedFeatures: Feature[] = [];
    map.on("click", function (evt) {
      clickedFeatures = []; // Clear the array before each click
      map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        clickedFeatures.push(feature as Feature<Geometry>);
      });

      if (clickedFeatures.length >= 1) {
        //unselect the hovered feature
        hoverCoordinates.value = null;
        hoveredFeature.value = null;

        //select the clicked feature
        selectedFeature.value = clickedFeatures[0];
        const geometry = clickedFeatures[0].getGeometry() as any;
        selectedCoordinates.value = geometry.getFirstCoordinate();

        //set store value
        panelStr.value = selectedFeature.value.values_?.title || '';
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
  () => props.showSecondFloor,
  async (newFloor) => {
    areMapPointsLoaded.value = false;
    const initialUrl =
      "https://saintsophia.dh.gu.se/api/inscriptions/coordinates/";

    vectorSource.value.clear();
    clearPopups(); // Clear the popups
    if (newFloor) {
      await fetchData(initialUrl, true);
    }
    else {
      await fetchData(initialUrl, false);
    }
  }, { immediate: true }
)

</script>
<template>
  <ol-overlay class="ol-popup" v-if="hoveredFeature" :position="hoverCoordinates">
    <div class="ol-popup-content" v-html="'Surface ' + (hoveredFeature ? hoveredFeature.get('title') : '')"></div>
  </ol-overlay>

  <ol-overlay class="ol-popup" v-if="selectedFeature" :position="selectedCoordinates">
    <div class="ol-popup-content" v-html="'Surface ' + (selectedFeature ? selectedFeature.get('title') : '')"></div>
  </ol-overlay>
</template>

<style></style>
