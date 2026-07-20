<script setup>
import { ref, defineProps, onMounted, inject, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import { Style, Icon, Text, Fill, Stroke } from "ol/style";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./settings/store";
import markerWhite from "@/assets/marker-white.svg";
import markerGold from "@/assets/marker-gold.svg";
import markerRed from "@/assets/marker-red.svg";

const { selectedFeature } = storeToRefs(mapStore());
const { areMapPointsLoaded, showMapLabels } = storeToRefs(etruscanStore());
const hoveredFeature = ref(null);
const hoverCoordinates = ref(null);
const selectedCoordinates = ref(null);

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

const vectorSource = ref(
  new VectorSource({
    format: new GeoJSON(),
  })
);

const updateFeatures = (features) => {
  const geoJSONFormat = new GeoJSON({ featureProjection: "EPSG:3857" });
  const transformedFeatures = geoJSONFormat.readFeatures({
    type: "FeatureCollection",
    features,
  });
  vectorSource.value.addFeatures(transformedFeatures);
};

const fetchData = async (initialUrl, params) => {
  let nextUrl = initialUrl;
  const initialParams = new URLSearchParams({
    page_size: "1000",
    ...params,
  }).toString();
  if (nextUrl && initialParams) {
    nextUrl = `${nextUrl}?${initialParams}`;
  }

  while (nextUrl) {
    const res = await fetch(nextUrl.replace(/^http:/, "https:")).catch((err) => {
      throw err;
    });
    if (!res) break;

    const data = await res.json();
    const features = data.features || [];
    updateFeatures(features);

    nextUrl = data.next ? data.next.replace(/^http:/, "https:") : null;
  }
  areMapPointsLoaded.value = true;
};

const markerStyles = {
  standard: new Style({
    image: new Icon({
      src: markerWhite,
      anchor: [0.5, 1],
      scale: 1,
      declutterMode: "none",
    }),
  }),
  has3D: new Style({
    image: new Icon({
      src: markerGold,
      anchor: [0.5, 1],
      scale: 1,
      declutterMode: "none",
    }),
  }),
};
const labelStyles = new WeakMap();

function styleFunction(feature) {
  const markerStyle = feature === hoveredFeature.value
    ? markerRedStyle
    : feature.get("has_3D") ? markerStyles.has3D : markerStyles.standard;
  if (!showMapLabels.value) return markerStyle;

  if (!labelStyles.has(feature)) {
    labelStyles.set(feature, new Style({
      text: new Text({
        text: `${feature.get("dataset")?.short_name || ""} - ${feature.get("name") || ""}`,
        offsetY: -48,
        font: '14px "Barlow Condensed", sans-serif',
        fill: new Fill({ color: "#282828" }),
        stroke: new Stroke({ color: "rgba(255, 255, 255, 0.9)", width: 3 }),
        backgroundFill: new Fill({ color: "rgba(255, 255, 255, 0.8)" }),
        padding: [2, 4, 2, 4],
      }),
    }));
  }

  return [markerStyle, labelStyles.get(feature)];
}

const vectorLayer = ref(
  new VectorLayer({
    source: vectorSource.value,
    style: styleFunction,
    declutter: true,
  })
);

watch(showMapLabels, () => vectorLayer.value.changed());

//for hover...
const markerRedStyle = new Style({
  image: new Icon({
    src: markerRed,
    anchor: [0.5, 1],
    scale: 1,
    declutterMode: "none",
  }),
});

onMounted(() => {
  const map = inject("map");
  if (!map) {
    console.error("map is not available.");
    return;
  }

  map.addLayer(vectorLayer.value);

  map.on("pointermove", (evt) => {
    if (evt.dragging) return;

    const featureAtPixel = map.forEachFeatureAtPixel(
      evt.pixel,
      (feat) => feat,
      { hitTolerance: 5 }
    );

    if (hoveredFeature.value !== featureAtPixel) {
      hoveredFeature.value = featureAtPixel || null;
      hoverCoordinates.value = featureAtPixel
        ? featureAtPixel.getGeometry().getCoordinates()
        : null;
      vectorLayer.value.changed();
    }
  });

  map.on("click", (evt) => {
    const feature = map.forEachFeatureAtPixel(
      evt.pixel,
      (feat) => feat,
      { hitTolerance: 5 }
    );
    if (feature) {
      selectedFeature.value = feature;
      selectedCoordinates.value = feature.getGeometry().getCoordinates();
    } else {
      selectedFeature.value = null;
      selectedCoordinates.value = null;
    }
  });
});

watch(
  () => props.params,
  async (newParams) => {
    areMapPointsLoaded.value = false;
    vectorSource.value.clear();

    hoveredFeature.value = null;
    hoverCoordinates.value = null;
    selectedFeature.value = null;
    selectedCoordinates.value = null;

    const initialUrl = "https://diana.dh.gu.se/api/etruscantombs/coordinates";
    await fetchData(initialUrl, newParams);
  },
  { immediate: true }
);
</script>

<template>
  <ol-overlay v-if="hoveredFeature && !showMapLabels" :position="hoverCoordinates">
    <div class="ol-popup">
      {{ hoveredFeature?.get("dataset")?.short_name || "" }} -
      {{ hoveredFeature?.get("name") || "" }}
    </div>
  </ol-overlay>

  <ol-overlay v-if="selectedFeature" :position="selectedCoordinates">
    <div class="ol-popup">
      {{ selectedFeature?.get("dataset")?.short_name || "" }} -
      {{ selectedFeature?.get("name") || "" }}
    </div>
  </ol-overlay>
</template>
