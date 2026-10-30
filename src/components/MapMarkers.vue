<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { fromLonLat } from "ol/proj";

const props = defineProps({
  markers: { type: Array, default: () => [] },
  types: { type: Object, required: true },
  projection: { type: String, default: "EPSG:3857" },
});

const map = inject("map");
const layer = ref();
const hovered = shallowRef(null);

function clearHover() {
  hovered.value = null;
}

function onPointerMove(event) {
  hovered.value = event.dragging ? null : map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => feature,
    { hitTolerance: 5, layerFilter: (candidate) => candidate === layer.value?.vectorLayer }
  ) || null;
}

onMounted(() => {
  map.on("pointermove", onPointerMove);
  map.on("movestart", clearHover);
  map.getViewport().addEventListener("pointerleave", clearHover);
});

onBeforeUnmount(() => {
  map.un("pointermove", onPointerMove);
  map.un("movestart", clearHover);
  map.getViewport().removeEventListener("pointerleave", clearHover);
});

const points = computed(() => props.markers.map((marker) => ({
  ...marker,
  position: fromLonLat(marker.coordinates, props.projection),
  icon: props.types[marker.type]?.icon,
})));

watch(points, clearHover);
</script>

<template>
  <ol-vector-layer ref="layer" :z-index="10">
    <ol-source-vector>
      <ol-feature v-for="point in points" :key="point.id"
        :properties="{ name: point.name, type: point.type, id: point.id }">
        <ol-geom-point :coordinates="point.position" />
        <ol-style>
          <ol-style-icon v-if="point.icon" :src="point.icon" :anchor="[0.5, 1]" />
          <ol-style-circle v-else :radius="8">
            <ol-style-fill color="#feae00" />
            <ol-style-stroke color="white" :width="2" />
          </ol-style-circle>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>
  <ol-overlay v-if="hovered" :position="hovered.getGeometry().getCoordinates()" :stop-event="false">
    <div class="ol-popup marker-tooltip">{{ hovered.get("type") }}</div>
  </ol-overlay>
</template>

<style scoped>
#app .marker-tooltip {
  width: 80px;
  min-width: 0;
  left: 0;
  transform: translateX(-50%);
}

#app .marker-tooltip::before {
  left: 50%;
  margin-left: -11px;
}
</style>
