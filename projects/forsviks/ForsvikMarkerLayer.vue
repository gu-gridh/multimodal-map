<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { fromLonLat, transformExtent } from "ol/proj";
import { unByKey } from "ol/Observable";
import Supercluster from "supercluster";
import ForsvikMarker from "./ForsvikMarker.vue";
import ForsvikMarkerPopup from "./ForsvikMarkerPopup.vue";

const props = defineProps({
  markers: { type: Array, default: () => [] },
  types: { type: Object, required: true },
  projection: { type: String, default: "EPSG:3857" },
  clusterDistance: { type: Number, default: 15 },
  mapInstance: { type: Object, default: null }
});

const displayedFeatures = ref([]);
const selectedArticle = ref(null);
const selectedArticles = ref([]);
const selectedClusterId = ref(null);
const popupPosition = ref(null);
const mapRevision = ref(0);
const markerHost = ref(null);

let olMap = null;
let renderListener = null;
let clickListener = null;
let clusterIndex = null;
let featureSignature = "";
let isCentering = false;

const points = computed(() =>
  props.markers
    .filter(marker =>
      Array.isArray(marker.coordinates) &&
      marker.coordinates.length === 2 &&
      marker.coordinates.every(value => Number.isFinite(Number(value)))
    )
    .map(marker => ({
      ...marker,
      coordinates: marker.coordinates.map(Number),
      icon: props.types[marker.type]?.icon
    }))
);

function closePopup() {
  selectedArticle.value = null;
  selectedArticles.value = [];
  selectedClusterId.value = null;
  popupPosition.value = null;
}

function rebuildIndex() {
  clusterIndex = new Supercluster({
    radius: props.clusterDistance,
    maxZoom: 21
  }).load(points.value.map(point => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: point.coordinates },
    properties: { point }
  })));

  featureSignature = "";
  renderFeatures();
}

function renderFeatures() {
  const size = olMap?.getSize();
  const view = olMap?.getView();
  if (!size || !view || !clusterIndex) return;

  const bounds = transformExtent(
    view.calculateExtent(size),
    props.projection,
    "EPSG:4326"
  );
  const zoom = Math.floor(view.getZoom() || 0);
  const features = clusterIndex.getClusters(bounds, zoom);
  const signature = `${zoom}:` + features.map(feature =>
    feature.properties.cluster
      ? `c${feature.properties.cluster_id}:${feature.properties.point_count}`
      : `p${feature.properties.point.id}`
  ).join("|");

  if (signature === featureSignature) return;
  if (featureSignature && !isCentering) closePopup();
  featureSignature = signature;

  displayedFeatures.value = features.map((feature, index) => ({
    key: feature.properties.cluster
      ? `c${feature.properties.cluster_id}`
      : `p${feature.properties.point.id}`,
    index,
    position: fromLonLat(feature.geometry.coordinates, props.projection),
    clusterId: feature.properties.cluster_id,
    count: feature.properties.point_count,
    point: feature.properties.point
  }));
}

function renderMap() {
  mapRevision.value++;
  renderFeatures();
}

function pixelStyle(position) {
  mapRevision.value;
  const pixel = position && olMap?.getPixelFromCoordinate(position);
  return pixel ? { left: `${pixel[0]}px`, top: `${pixel[1]}px` } : {};
}

function openPoint(point, position) {
  centerMap(position);
  selectedArticle.value = point;
  selectedArticles.value = [];
  selectedClusterId.value = null;
  popupPosition.value = position;
}

function openCluster(feature) {
  if (selectedClusterId.value === feature.clusterId) {
    closePopup();
    return;
  }

  centerMap(feature.position);
  selectedArticle.value = null;
  selectedArticles.value = clusterIndex
    .getLeaves(feature.clusterId, Infinity)
    .map(leaf => leaf.properties.point);
  selectedClusterId.value = feature.clusterId;
  popupPosition.value = feature.position;
}

function centerMap(position) {
  const view = olMap?.getView();
  if (!view || !position) return;

  view.cancelAnimations();
  isCentering = true;
  view.animate({ center: position, duration: 300 }, () => {
    isCentering = false;
  });
}

function selectArticle(article) {
  selectedArticle.value = article;
  selectedArticles.value = [];
}

function initializeMap(map) {
  if (!map || typeof map.on !== "function") return;

  olMap = map;
  markerHost.value = document.createElement("div");
  Object.assign(markerHost.value.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none"
  });
  olMap.getOverlayContainerStopEvent().appendChild(markerHost.value);
  renderListener = olMap.on("postrender", renderMap);
  clickListener = olMap.on("singleclick", closePopup);
  rebuildIndex();
}

function cleanupMap() {
  if (renderListener) unByKey(renderListener);
  if (clickListener) unByKey(clickListener);
  const host = markerHost.value;
  markerHost.value = null;
  if (host) nextTick(() => host.remove());

  olMap = null;
  renderListener = null;
  clickListener = null;
  clusterIndex = null;
  featureSignature = "";
  isCentering = false;
  displayedFeatures.value = [];
  closePopup();
}

watch(
  () => props.mapInstance,
  map => {
    cleanupMap();
    if (map) initializeMap(map);
  },
  { immediate: true }
);

watch(points, rebuildIndex);
watch(() => props.clusterDistance, rebuildIndex);
onBeforeUnmount(cleanupMap);
</script>

<template>
  <Teleport v-if="markerHost" :to="markerHost">
    <div class="marker-layer">
      <div v-for="feature in displayedFeatures" :key="feature.key" class="map-item" :class="{ cluster: feature.count }"
        :style="pixelStyle(feature.position)">
        <button v-if="feature.count" class="marker-cluster"
          :class="{ selected: selectedClusterId === feature.clusterId }" type="button"
          :style="{ '--marker-delay': `${Math.min(feature.index, 5) * 25}ms` }" @click.stop="openCluster(feature)">
          {{ feature.count }}
        </button>
        <ForsvikMarker v-else :point="feature.point" :order="feature.index"
          :selected="selectedArticle?.id === feature.point.id" @select="openPoint($event, feature.position)" />
      </div>

      <div v-if="selectedArticle || selectedArticles.length" class="popup-position" :style="pixelStyle(popupPosition)">
        <ForsvikMarkerPopup :article="selectedArticle" :articles="selectedArticles" @close="closePopup"
          @select="selectArticle" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.marker-layer {
  position: absolute;
  z-index: 100;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.map-item,
.popup-position {
  position: absolute;
  pointer-events: auto;
}

.map-item {
  transform: translate(-50%, -100%);
}

.map-item.cluster {
  transform: translate(-50%, -50%);
}

.marker-cluster {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 4px solid #fff8ed;
  border-radius: 50%;
  background: #9c5b43;
  color: white;
  font: bold 18px "Barlow Condensed";
  cursor: pointer;
  transform-origin: 50% 100%;
  transition: transform .25s ease, filter .25s ease;
  animation: marker-pop 2.45s var(--marker-delay) cubic-bezier(.2, 1.5, .4, 1) both;
}

.marker-cluster:hover,
.marker-cluster.selected {
  transform: translateY(-30px) scale(1.1);
  filter: drop-shadow(0 6px 5px rgba(45, 20, 12, .35));
}

.popup-position {
  z-index: 1000;
  width: auto;
  transform: translate(-50%, calc(-100% - 55px));
  translate: 0px -20px;
}

@keyframes marker-pop {
  0% {
    opacity: 0;
    transform: translateY(-18px) scale(.2);
  }

  90% {
    opacity: 1;
    transform: translateY(3px) scale(1.12);
  }

  100% {
    opacity: 1;
    transform: translateY(3px) scale(1.12);
  }
}

@media (max-width: 600px) {
  .popup-position {
    width: min(250px, calc(100vw - 32px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .marker-cluster {
    animation: none;
  }
}
</style>
