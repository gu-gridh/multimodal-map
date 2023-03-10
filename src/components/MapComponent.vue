<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 100%; width: 100%; z-index: 0 !important"
    ref="map"
  >
    <ol-view
      ref="view"
      :center="projectedCenter"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
      style="z-index=0"
      @centerChanged="onCenterChange"
      @zoomChanged="zoomChanged"
    />

    <ol-fullscreen-control v-if="fullscreencontrol" />
    <ol-attribution-control v-if="attributioncontrol" />
    <ol-overviewmap-control v-if="overviewmapcontrol">
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-overviewmap-control>

    <ol-scaleline-control v-if="scalelinecontrol" />
    <ol-zoom-control v-if="zoomcontrol" />
    <ol-zoomslider-control v-if="zoomslidercontrol" />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-vector-layer v-for="url in urls" v-bind:key="url">
      <ol-source-vector
        :url="url"
        :format="GeoJSONFormat"
        :projection="projection"
        ref="source"
      >
      </ol-source-vector>
      <ol-style>
        <ol-style-circle :radius="10">
          <ol-style-fill color="rgb(255,255,255,0.7)"></ol-style-fill>
          <ol-style-stroke color="gray"></ol-style-stroke>
        </ol-style-circle>
        <ol-style-stroke color="gray" :width="7"></ol-style-stroke>
      </ol-style>
    </ol-vector-layer>

    <ol-interaction-select
      @select="onClick"
      :condition="selectCondition"
      ref="selectInteraction"
    >
      <ol-style>
        <ol-style-circle :radius="15">
          <ol-style-fill color="teal"></ol-style-fill>
          <ol-style-stroke color="gray"></ol-style-stroke>
        </ol-style-circle>
        <ol-style-stroke color="teal" :width="10"></ol-style-stroke>
      </ol-style>
    </ol-interaction-select>

    <ol-interaction-select
      @select="onHover"
      :condition="hoverCondition"
      ref="hoverInteraction"
    >
      <ol-style>
        <ol-style-circle :radius="15">
          <ol-style-fill color="teal"></ol-style-fill>
          <ol-style-stroke color="gray"></ol-style-stroke>
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
  </ol-map>
</template>

<script setup lang="ts">
import { ref, inject, defineProps } from "vue";
import { fromLonLat, transformExtent } from "ol/proj";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import type Feature from "ol/Feature";
import type Geometry from "ol/geom/Geometry";
import type { SelectEvent } from "ol/interaction/Select";
import type { DisplayFunction } from "../types/map";

const format = inject("ol-format");
const selectConditions = inject("ol-selectconditions");

const store = mapStore();
const { extent } = storeToRefs(store);
const props = defineProps<{
  center: Array<number>;
  urls?: Array<string>;
  getFeatureDisplayName: DisplayFunction;
}>();

// const center = ref([1331838.7808, 7907869.1983]);
const projection = ref("EPSG:3857");
const zoom = ref(15);
const rotation = ref(0);
const view = ref();
const map = ref();
const source = ref();
const projectedCenter = fromLonLat(props.center, projection.value);

// Controls
const fullscreencontrol = ref(true);
const attributioncontrol = ref(true);
const zoomcontrol = ref(true);
const zoomslidercontrol = ref(true);
const scalelinecontrol = ref(true);
const overviewmapcontrol = ref(true);

// Interactions
const hoverInteraction = ref();
const selectInteraction = ref();

const selectedCoordinates = ref();
const hoverCoordinates = ref();

const hoveredFeature = ref<Feature<Geometry>>();
const selectedFeature = ref<Feature<Geometry>>();

const hoverCondition = selectConditions.pointerMove;
const selectCondition = selectConditions.click;

// GeoJSON formatting
const GeoJSONFormat = new format.GeoJSON({
  featureProjection: projection.value,
});

function zoomChanged() {
  let newExtent = map.value.map
    .getView()
    .calculateExtent(map.value.map.getSize());
  newExtent = transformExtent(newExtent, projection.value, "EPSG:4326");
  extent.value = newExtent;
}

function onCenterChange() {
  let newExtent = map.value.map
    .getView()
    .calculateExtent(map.value.map.getSize());
  newExtent = transformExtent(newExtent, projection.value, "EPSG:4326");
  extent.value = newExtent;
}

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
</script>

<style>
.overlay-content {
  background: #ff0000;
  box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
  padding: 10px 20px;
  font-size: 16px;
}

.ol-popup {
  text-align: center;
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 0px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 150px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "???";
}
</style>
