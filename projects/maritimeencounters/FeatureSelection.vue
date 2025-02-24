<script setup>
import { ref, inject, watch} from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import markerIconRed from "@/assets/marker-red.svg";
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

  if (features.length === 1 && features[0].get('name')) {
    hoverCoordinates.value = event.mapBrowserEvent.coordinate;
    hoveredFeature.value = features[0];
  } else {
    hoverCoordinates.value = undefined;
    hoveredFeature.value = undefined;
  }
};

const onClick = (event) => {
const features = event.selected;

  if (features.length === 1 && features[0].get('name')) {
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

const getFeatureDisplayName =
  config.getFeatureDisplayName ||
((feature) => {
  let name = feature.get("Name") || feature.get("name") || feature.get("NAME") || '';
  let rawDate = feature.get("Date");
  let rawYear = feature.get("YEAR_")
  //check if rawDate is available
  if (rawDate) {
    let date = rawDate.toString(); 

    //break the date into component parts
    let year = date.substr(0, 4);
    let month = date.substr(4, 2);
    let day = date.substr(6, 2);

    //parse the date string into a Date object
    let dateObject = new Date(`${year}-${month}-${day}`);

    //format the date for display
    let formattedDate = dateObject.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return `${name} ${formattedDate}`;
  } else if (rawYear)
  {
    return `${name} ${rawYear}`;
  } else {
    return `${name}`;
  }
})
</script>

<template>
  <ol-interaction-select
    @select="onClick"
    :condition="selectCondition"
    :features="selectedFeaturesCollection"
  >
    <ol-style>
      <ol-style-icon
        :src="markerIconRed"
        :scale="1.9"
        :displacement="[-9, 47]"
        :anchor="[0.0, 0.0]"
      ></ol-style-icon>
    </ol-style>
  </ol-interaction-select>

  <ol-interaction-select @select="onHover" :condition="hoverCondition">
    <ol-style>
      <ol-style-icon
        :src="markerIconRed"
        :scale="1.9"
        :displacement="[-9, 47]"
        :anchor="[0.0, 0.0]"
      ></ol-style-icon>
      <ol-style-stroke color="rgb(0,0,0,0.2)" :width="1"></ol-style-stroke>
      <ol-style-fill color="rgba(0,0,0,0)"></ol-style-fill>
    </ol-style>
  </ol-interaction-select>

  <ol-overlay
    class="ol-popup"
    v-if="hoveredFeature"
    :position="hoverCoordinates"

  >
    <div
      class="ol-popup-content"
      v-html="'Tomb ' + getFeatureDisplayName(hoveredFeature)"
    ></div>
  </ol-overlay>

  <ol-overlay
    class="ol-popup"
    v-if="selectedFeature"
    :position="selectedCoordinates"
  >
    <div
      class="ol-popup-content"
      v-html="'Tomb ' + getFeatureDisplayName(selectedFeature)"
    ></div>
  </ol-overlay>
</template>
