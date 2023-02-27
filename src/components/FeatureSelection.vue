<script lang="ts" setup>
import { ref, inject } from "vue";
import type Feature from "ol/Feature";
import type { SelectEvent } from "ol/interaction/Select";
import type { DisplayFunction } from "@/types/diana";
import type { Project } from "@/types/project";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

const { selectedFeature } = storeToRefs(mapStore());

const config = inject("config") as Project;

const selectedCoordinates = ref();
const hoverCoordinates = ref();

const hoveredFeature = ref<Feature>();

const selectConditions = inject("ol-selectconditions");
const hoverCondition = selectConditions.pointerMove;
const selectCondition = selectConditions.click;

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

const getFeatureDisplayName: DisplayFunction =
  config.getFeatureDisplayName ||
  ((feature) => feature.get("name") || String(feature.getId()));
</script>

<template>
  <ol-interaction-select @select="onClick" :condition="selectCondition">
    <ol-style>
      <ol-style-circle :radius="15">
        <ol-style-fill color="rgb(232 157 59)" />
        <ol-style-stroke :width="0" />
      </ol-style-circle>
      <ol-style-stroke color="teal" :width="10"></ol-style-stroke>
    </ol-style>
  </ol-interaction-select>

  <ol-interaction-select @select="onHover" :condition="hoverCondition">
    <ol-style>
      <ol-style-circle :radius="15">
        <ol-style-fill color="rgb(232 157 59)" />
        <ol-style-stroke :width="0" />
      </ol-style-circle>
      <ol-style-stroke color="teal" :width="10"></ol-style-stroke>
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
