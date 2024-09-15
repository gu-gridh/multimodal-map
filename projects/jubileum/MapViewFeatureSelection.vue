<script lang="ts" setup>
import { ref, inject, watch } from "vue";
import type Feature from "ol/Feature";
import type { SelectEvent } from "ol/interaction/Select";
import type { DisplayFunction } from "@/types/diana";
import type { Project } from "@/types/project";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import markerIcon from "@/assets/marker-white.svg";
import markerIconRedOutline from "@/assets/marker-red-outline.svg";
import Collection from "ol/Collection";

const { selectedFeature } = storeToRefs(mapStore());

const config = inject("config") as Project;

const selectedCoordinates = ref();
const hoverCoordinates = ref();

const hoveredFeature = ref<Feature>();

const selectConditions = inject("ol-selectconditions");

const hoverCondition = selectConditions.pointerMove;
const selectCondition = selectConditions.click;

// This list is connected to the ol-interaction-select element; this is to be able to deselect programmatically
  const selectedFeaturesCollection = new Collection(
  selectedFeature.value ? [selectedFeature.value] : []
);

const onHover = (event: SelectEvent) => {
  const features = event.selected;

  if (features.length === 1) {
    hoverCoordinates.value = event.mapBrowserEvent.coordinate;
    hoveredFeature.value = features[0];
  } else {
    hoverCoordinates.value = undefined;
    hoveredFeature.value = undefined;
  }
};

const onClick = (event: SelectEvent) => {
const features = event.selected;

  if (features.length === 1) {
    // Unselect the hovered feature
    hoverCoordinates.value = undefined;
    hoveredFeature.value = undefined;

    // Select the clicked feature
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

const getFeatureDisplayName: DisplayFunction =
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
        :scale="1.9"
        :displacement="[-10, 45]"
        :anchor="[0.0, 0.0]"
      ></ol-style-icon>
      <ol-style-stroke color="rgb(220,100,100)" :width="6"></ol-style-stroke>
    </ol-style>
  </ol-interaction-select>
  
  <ol-interaction-select @select="onHover" :condition="hoverCondition">
    <ol-style>
      <ol-style-icon
        :src="markerIconRedOutline"
        :scale="1.9"
        :displacement="[-10, 45]"
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
      v-html="getFeatureDisplayName(selectedFeature as Feature)"
    ></div>
  </ol-overlay>
</template>