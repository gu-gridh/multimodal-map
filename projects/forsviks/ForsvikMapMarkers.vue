<script setup>

import {computed, ref, watch, onBeforeUnmount, nextTick} from "vue";

import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import {Style, Circle as CircleStyle, Fill, Stroke, Text, Icon} from "ol/style";
import { unByKey } from "ol/Observable";

const props = defineProps({
  markers: { type: Array, default: () => [] },
  types: { type: Object, required: true },
  projection: { type: String, default: "EPSG:3857" },
  clusterDistance: { type: Number, default: 15 },
  mapInstance: { type: Object, default: null }
});

const popupElement = ref(null);
const selectedArticle = ref(null);
const selectedArticles = ref([]);

let olMap = null;
let vectorSource = null;
let clusterSource = null;
let clusterLayer = null;
let popupOverlay = null;
let clickListener = null;

const points = computed(() =>
  props.markers
    .filter(marker =>
      Array.isArray(marker.coordinates) &&
      marker.coordinates.length === 2 &&
      marker.coordinates.every(v => Number.isFinite(Number(v)))
    )
    .map(marker => ({
      ...marker,
      position: fromLonLat(
        marker.coordinates.map(Number),
        props.projection
      ),
      icon: props.types[marker.type]?.icon
    }))
);

function createFeatures() {
  return points.value.map(point => {
    const feature = new Feature({
      geometry: new Point(point.position),
      article: point
    });

    feature.setId(point.id);
    return feature;
  });
}

function markerStyle(feature) {
  const features = feature.get("features") || [];
  const count = features.length;

  if (count === 1) {
    const article = features[0].get("article");

    if (article.icon) {
      return new Style({
        image: new Icon({
          src: article.icon,
          scale: 1,
          anchor: [0.5, 1]
        })
      });
    }
  }

  return new Style({
    image: new CircleStyle({
      radius: count > 1 ? 22 : 14,
      fill: new Fill({ color: "#9c5b43" }),
      stroke: new Stroke({
        color: "#fff8ed",
        width: 3
      })
    }),
    text: count > 1
      ? new Text({
          text: String(count),
          fill: new Fill({ color: "#ffffff" }),
          font: "bold 18px Barlow Condensed"
        })
      : undefined
  });
}

function closePopup() {
  selectedArticle.value = null;
  selectedArticles.value = [];
  popupOverlay?.setPosition(undefined);
}

function selectArticle(article) {
  selectedArticle.value = article;
  selectedArticles.value = [];
}

function handleMapClick(event) {
  const feature = olMap.forEachFeatureAtPixel(
    event.pixel,
    feature => feature,
    {
      hitTolerance: 8,
      layerFilter: layer => layer === clusterLayer
    }
  );

  if (!feature) {
    closePopup();
    return;
  }

  const articles = feature
    .get("features")
    .map(f => f.get("article"));

  if (articles.length === 1) {
    selectedArticle.value = articles[0];
    selectedArticles.value = [];
  } else {
    selectedArticle.value = null;
    selectedArticles.value = articles;
  }

  popupOverlay.setPosition(
    feature.getGeometry().getCoordinates()
  );
}

function initializeMap(map) {
  if (!map || typeof map.addLayer !== "function") return;

  olMap = map;

  vectorSource = new VectorSource({
    features: createFeatures()
  });

  clusterSource = new Cluster({
    distance: props.clusterDistance,
    source: vectorSource
  });

  clusterLayer = new VectorLayer({
    source: clusterSource,
    style: markerStyle,
    zIndex: 100
  });

  olMap.addLayer(clusterLayer);

  popupOverlay = new Overlay({
    element: popupElement.value,
    positioning: "bottom-center",
    offset: [0, -55],
    stopEvent: true,
    autoPan: {
      animation: { duration: 250 }
    }
  });

  olMap.addOverlay(popupOverlay);

  clickListener = olMap.on("singleclick", handleMapClick);
}

function cleanupMap() {
  if (clickListener) unByKey(clickListener);
  clickListener = null;

  if (olMap) {
    if (clusterLayer) olMap.removeLayer(clusterLayer);
    if (popupOverlay) olMap.removeOverlay(popupOverlay);
  }

  olMap = null;
  vectorSource = null;
  clusterSource = null;
  clusterLayer = null;
  popupOverlay = null;
}

watch(
  () => props.mapInstance,
  async map => {
    cleanupMap();

    if (!map) return;

    await nextTick();

    initializeMap(map);
  },
  { immediate: true }
);

watch(points, () => {
  if (!vectorSource) return;

  vectorSource.clear();
  vectorSource.addFeatures(createFeatures());
  closePopup();
});

watch(
  () => props.clusterDistance,
  distance => clusterSource?.setDistance(distance)
);

onBeforeUnmount(cleanupMap);

</script>

<template>
  <div
    ref="popupElement"
    class="forsvik-popup"
  >
    <!-- Cluster -->
    <div
      v-if="selectedArticles.length"
      class="cluster-list"
    >
      <div class="cluster-list-header">
        <strong>
          {{ selectedArticles.length }} artiklar
        </strong>

        <button
          class="cluster-close"
          type="button"
          @click.stop="closePopup"
        >
          ×
        </button>
      </div>

      <button
        v-for="article in selectedArticles"
        :key="article.id"
        class="cluster-list-item"
        type="button"
        @click.stop="selectArticle(article)"
      >
        <img
          v-if="article.icon"
          :src="article.icon"
          alt=""
        >
        <span>{{ article.name }}</span>
      </button>
    </div>

    <!-- Selected article card -->
    <article
      v-if="selectedArticle"
      class="marker-card selected"
    >
      <button
        class="marker-card-close"
        type="button"
        title="Stäng"
        @click.stop="closePopup"
      >
        ×
      </button>

      <div class="marker-card-media">
        <img
          v-if="selectedArticle.mediaUrl"
          :src="selectedArticle.mediaUrl"
          :alt="selectedArticle.mediaTitle || selectedArticle.name"
        >

        <div v-else class="marker-card-placeholder">
          {{ selectedArticle.type }}
        </div>
      </div>

      <div class="marker-card-copy">
        <h2>{{ selectedArticle.name }}</h2>
        <p>{{ selectedArticle.areaName }}</p>
      </div>

      <div class="marker-card-footer">
        <a
          v-if="selectedArticle.mediaUrl"
          class="marker-card-action"
          :href="selectedArticle.mediaUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Utforska
        </a>

        <span v-else class="marker-card-action disabled">
          Utforska
        </span>
      </div>
    </article>
  </div>
</template>



<style scoped>

.forsvik-popup {
  position: relative;
  width: 260px;
  pointer-events: auto;
}

.marker-card {
  position: relative;
  width: 100%;
  border-radius: 18px 18px 14px 14px;
  background: #fff8ed;
  color: #3d211b;
  box-shadow:
    0 10px 18px rgba(45, 20, 12, .18),
    0 24px 50px rgba(45, 20, 12, .32);
  animation: card-appear .35s cubic-bezier(.2, .9, .25, 1.15);
}

.marker-card::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 16px;
  height: 16px;
  background: #fff8ed;
  transform: translateX(-50%) rotate(45deg);
}

.marker-card-close {
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: rgba(42, 24, 19, .76);
  padding: 0;
  cursor: pointer;
}

.marker-card-close::before,
.marker-card-close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 1px;
  background: white;
  transform: translate(-50%, -50%) rotate(45deg);
}

.marker-card-close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.marker-card-media {
  height: 130px;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
  background: var(--panel-background);
}

.marker-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marker-card-placeholder {
  display: grid;
  height: 100%;
  place-items: center;
  color: var(--theme-4);
  text-transform: capitalize;
}

.marker-card-copy {
  padding: 14px 16px 12px;
}

.marker-card-copy h2 {
  margin: 0;
  color: var(--theme-3);
  font-size: 21px;
  line-height: 1.1;
}

.marker-card-copy p {
  margin: 5px 0 0;
  color: #231915;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.marker-card-footer {
  height: 46px;
}

.marker-card-action {
  display: table;
  margin: 0 auto 16px;
  padding: 4px 12px;
  border-radius: 5px;
  background: var(--theme-3);
  color: white;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.marker-card-action:hover {
  background: var(--theme-4);
}

.marker-card-action.disabled {
  opacity: .65;
}

/* cluster article list*/

.cluster-list {
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  border-radius: 14px;
  background: #fff8ed;
  color: #3d211b;
  box-shadow: 0 12px 30px rgba(45, 20, 12, .3);
  animation: card-appear .3s ease-out;
}

.cluster-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

.cluster-close {
  border: none;
  background: transparent;
  color: #3d211b;
  font-size: 22px;
  cursor: pointer;
}

.cluster-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: #3d211b;
  text-align: left;
  cursor: pointer;
}

.cluster-list-item img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.cluster-list-item:hover {
  background: #eadbca;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(18px) scale(.85);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 600px) {
  .forsvik-popup {
    width: min(250px, calc(100vw - 32px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .marker-card,
  .cluster-list {
    animation: none;
  }
}
</style>
