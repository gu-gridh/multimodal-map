<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 100%; width: 100%; z-index: !important"
    ref="map"
  >

  <ol-view
    ref="view"
    style="z-index=0"
    :min-zoom="minZoom"
    :max-zoom="maxZoom"
    :extent="transformedRestrictExtent"
  />

  
    <!-- <ol-fullscreen-control v-if="fullscreencontrol" /> -->
    <!--<ol-attribution-control v-if="attributioncontrol" /> -->
    <!-- <ol-overviewmap-control v-if="overviewmapcontrol">
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-overviewmap-control> -->

    <!-- <ol-scaleline-control v-if="scalelinecontrol" /> -->
    <ol-zoom-control v-if="zoomcontrol" />
    <!-- <ol-zoomslider-control v-if="zoomslidercontrol" /> -->

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <slot name="layers"></slot>
  </ol-map>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, watch, nextTick} from "vue";
import { fromLonLat, transformExtent } from "ol/proj";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import type { Project } from "@/types/project";

const config = inject("config") as Project;

const store = mapStore();
const { extent, center, zoom } = storeToRefs(store);

let isInitialSettingDone = false; //don't fire the watchers before setting the map location
const isAnimating = ref(false);

const projection = ref(config.projection);
const rotation = ref(0);
const view = ref();
const map = ref();
const projectedCenter = fromLonLat(config.center, projection.value);

// Controls
const fullscreencontrol = ref(true);
const attributioncontrol = ref(true);
const zoomcontrol = ref(true);
const zoomslidercontrol = ref(true);
const scalelinecontrol = ref(true);
const overviewmapcontrol = ref(true);

const props = defineProps({
   shouldAutoMove: {
    type: Boolean,
    default: false,
  },
  minZoom: {
    type: Number,
    default: 0,
  },
  maxZoom: {
    type: Number,
    default: 28,
  },
  restrictExtent: {
    type: Array,
    default: () => [],
  },
});

const minZoom = ref(props.minZoom);
const maxZoom = ref(props.maxZoom);
const shouldAutoMove = ref(props.shouldAutoMove);

const transformedRestrictExtent = computed(() => {
  if (props.restrictExtent.length > 0) {
    return transformExtent(
      props.restrictExtent as [number, number, number, number],
      "EPSG:4326",
      projection.value
    );
  }
  return undefined;
});

onMounted(() => {
  let storeCenter = store.center;
  let storeZoom = store.zoom;
  
  
  if (storeCenter[0] !== 0 && storeZoom !== 1) {
    map.value.map.getView().setCenter(storeCenter);
    map.value.map.getView().setZoom(storeZoom);
  } else {
    // No stored center and zoom, use default values.
    map.value.map.getView().setCenter(fromLonLat(config.center, projection.value));
    map.value.map.getView().setZoom(config.zoom);
  }

  // Listen to the end of map movement.
  map.value.map.on('moveend', onMoveEnd);

  nextTick(() => {
    isInitialSettingDone = true;
  });

  watch(
    () => store.center,
    (newCenter) => {
      // Checking multiple conditions before animating the map.
      if (
        shouldAutoMove.value &&
        newCenter &&
        isInitialSettingDone &&
        JSON.stringify(newCenter) !== JSON.stringify(map.value.map.getView().getCenter())
      ) {
        isAnimating.value = true; // Set the flag
        map.value.map.getView().animate(
          {
            center: newCenter,
            duration: 500,
          },
          () => {
            nextTick(() => {
              isAnimating.value = false; // Unset the flag
            });
          }
        );
      }
    },
  );

  watch(
    () => store.zoom,
    (newZoom) => {
      // Checking multiple conditions before animating the map.
      if (
        shouldAutoMove.value &&
        newZoom !== null &&
        isInitialSettingDone &&
        newZoom !== map.value.map.getView().getZoom()
      ) {
        isAnimating.value = true; // Set the flag
        map.value.map.getView().animate(
          {
            zoom: newZoom,
            duration: 500,
          },
          () => {
            // Using nextTick to update isAnimating after the DOM updates
            nextTick(() => {
              isAnimating.value = false; // Unset the flag
            });
          }
        );
      }
    },
  );
});

function onMoveEnd() {
  if (isAnimating.value) {
    return;
  }
  const currentCenter = map.value.map.getView().getCenter();
  const currentZoom = map.value.map.getView().getZoom();
  // Only update the store if the values have actually changed.
  if (JSON.stringify(currentCenter) !== JSON.stringify(store.center)) {
    store.updateCenter(currentCenter);
  }
  if (currentZoom !== store.zoom) {
    store.updateZoom(currentZoom);
  }
}
</script>

<style>
.ol-control button {
  font-family: "Barlow Condensed", sans-serif;
  border-radius: 50% !important;
  background-color: rgb(40, 40, 40) !important;
  color: white !important;
}

.ol-control button:active,
.ol-control button:hover,
.ol-control button:focus {
  background: #ff9900 !important;
  border-width: 0px !important;
  outline:0px solid var(--ol-subtle-foreground-color)!important;
}

.ol-scaleline-control {
  right: 20px !important;
  display:none!important;
}

.ol-full-screen {
  display:none!important;
  right: 25px !important;
  top: 20px !important;
  position: fixed !important;
  font-size: 30px !important;
  color: black;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  padding: 0px !important;
  box-shadow: 0rem 0.5rem 1rem rgba(0, 0, 0, 0.2) !important;
  opacity: 0.9 !important;
}

.ol-zoom {
  font-size: 30px !important;
  color: white !important;
  width: 40px;
  height: 40px;
  padding: 0px !important;
  box-shadow: 0rem 0.5rem 1rem rgba(0, 0, 0, 0.2) !important;
  opacity: 0.9 !important;
  right: 20px !important;
  position: absolute !important;
}

.ol-zoom-in {
  right: 20px !important;
  top: 20px !important;
  position: fixed;
}
.ol-zoom-in:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
.ol-zoom-out {
  right: 20px;
  top: 68px;
  position: fixed;
  margin-top: 3px;
}
.ol-zoom-out:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.ol-control {
  position: fixed;
}
#app .ol-zoomslider {
  top: 1rem !important;
  border-radius: 5px !important;
  background: rgba(255, 255, 255, 0.4) !important;
  border: 0px solid rgba(0, 60, 136, 0) !important;
  right: 60px !important;
  height: 200px !important;
  width: 25px !important;
  position: fixed !important;
}

.ol-zoomslider-thumb {
  width: 60px !important;
}

.overlay-content {
  background: #ff0000;
  box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
  padding: 10px 20px;
  font-size: 16px;
}

.ol-popup {
  text-align: center;
  position: absolute;
  color: white;
  background-color: rgb(40, 40, 40) !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
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
  border-top-color: rgb(40, 40, 40) !important;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: rgb(40, 40, 40) !important;
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
  content: "✖";
}
</style>
