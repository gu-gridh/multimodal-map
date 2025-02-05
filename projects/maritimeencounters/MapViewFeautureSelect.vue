<script setup>
import { ref, inject, watch } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import markerIcon from "@/assets/marker-white.svg";
import markerIconRedOutline from "@/assets/marker-red-outline.svg";
import Collection from "ol/Collection";

const { selectedFeature } = storeToRefs(mapStore());
const config = inject("config");
const selectedCoordinates = ref();
const hoverCoordinates = ref();
const hoveredFeature = ref();
const selectConditions = inject("ol-selectconditions");
const hoverCondition = selectConditions.pointerMove;
const selectCondition = selectConditions.click;
const selectedFeaturesCollection = new Collection(
  selectedFeature.value ? [selectedFeature.value] : []
);

const onHover = (event) => {
  const features = event.selected;

  if (features.length === 1) {
    hoverCoordinates.value = event.mapBrowserEvent.coordinate;
    hoveredFeature.value = features[0];
  } else {
    hoverCoordinates.value = undefined;
    hoveredFeature.value = undefined;
  }
};

const onClick = (event) => {
  const features = event.selected;

  if (features.length === 1) {
    hoverCoordinates.value = undefined;
    hoveredFeature.value = undefined;
    selectedCoordinates.value = event.mapBrowserEvent.coordinate;
    selectedFeature.value = features[0];
  } else {
    selectedCoordinates.value = undefined;
    selectedFeature.value = undefined;
  }
};

// Sync selected feature from store to OL
watch(selectedFeature, () => {
  selectedFeaturesCollection.clear();
  selectedFeaturesCollection.extend(
    selectedFeature.value ? [selectedFeature.value] : []
  );
});

const getFeatureDisplayName =
  config.getFeatureDisplayName ||
  ((feature) => feature.get("name") || String(feature.getId()));
</script>

<template>
  <ol-interaction-select
    @select="onClick"
    :condition="selectCondition"
    :features="selectedFeaturesCollection"
  >
    <ol-style>
      <ol-style-icon
        :src="markerIconRedOutline"
        :scale="2.1"
        :displacement="[-10, 50]"
        :anchor="[0.0, 0.0]"
      ></ol-style-icon>
      <ol-style-stroke color="rgb(220,100,100)" :width="6"></ol-style-stroke>
    </ol-style>
  </ol-interaction-select>
  
  <ol-interaction-select @select="onHover" :condition="hoverCondition">
    <ol-style>
      <ol-style-icon
        :src="markerIcon"
        :scale="2.1"
        :displacement="[-10, 50]"
        :anchor="[0.0, 0.0]"
      ></ol-style-icon>
      <ol-style-stroke color="rgb(220,100,100)" :width="6"></ol-style-stroke>
    </ol-style>
  </ol-interaction-select>

  <ol-overlay
    class="ol-popup"
    v-if="hoveredFeature"
    :position="hoverCoordinates"
  >
    <div
      class="ol-popup-content"
      v-html="getFeatureDisplayName(hoveredFeature)"
    ></div>
  </ol-overlay>

  <ol-overlay
    class="ol-popup"
    v-if="selectedFeature"
    :position="selectedCoordinates"
  >
    <div
      class="ol-popup-content"
      v-html="getFeatureDisplayName(selectedFeature)"
    ></div>
  </ol-overlay>
</template>