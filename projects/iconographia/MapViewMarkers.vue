<script setup>
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorSource from "ol/source/Vector.js";
import Cluster from "ol/source/Cluster.js";
import VectorLayer from "ol/layer/Vector.js";
import { Style, Icon, Text, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { iconographiaStore } from "./settings/store";
import { useSources } from "./settings/params";
import { IconographiaClient } from "./settings/api";
import markerWhite from "@/assets/marker-white.svg";
import markerRed from "@/assets/marker-red.svg";

const props = defineProps({
  zIndex: { type: Number, default: 20 },
});

const client = new IconographiaClient();
const iconographia = iconographiaStore();
// Reacts directly to the filter store (no prop chain in between).
const { sources } = useSources();
const hoveredCluster = ref(null);

// Provided by MapPane (set once the OL map is created).
const olMap = inject("olMap", ref(null));

const rawSource = new VectorSource({ format: new GeoJSON() });
const clusterSource = new Cluster({ distance: 40, source: rawSource });

/** Sum the per-place record counts inside a cluster. */
function clusterCount(feature) {
  return feature
    .get("features")
    .reduce((sum, f) => sum + (f.get("count") || 1), 0);
}

function markerStyle(feature, hovered = false) {
  const inner = feature.get("features");
  const total = clusterCount(feature);

  if (inner.length === 1) {
    // A single place: pin with its record count as a badge.
    return new Style({
      image: new Icon({
        src: hovered ? markerRed : markerWhite,
        anchor: [0.5, 1],
        scale: 1,
      }),
      text: new Text({
        text: total > 1 ? String(total) : "",
        offsetY: -30,
        font: "13px 'Barlow Condensed', sans-serif",
        fill: new Fill({ color: "#333" }),
        stroke: new Stroke({ color: "white", width: 3 }),
      }),
    });
  }

  // A cluster of several places: circle sized by the summed count.
  const radius = Math.min(12 + Math.log(total + 1) * 4, 34);
  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({
        color: hovered ? "rgba(178, 70, 70, 0.9)" : "rgba(158, 60, 60, 0.85)",
      }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
    text: new Text({
      text: String(total),
      font: "13px 'Barlow Condensed', sans-serif",
      fill: new Fill({ color: "white" }),
    }),
  });
}

const vectorLayer = new VectorLayer({
  source: clusterSource,
  style: (feature) => markerStyle(feature, feature === hoveredCluster.value),
  zIndex: props.zIndex,
});

let fetchToken = 0;

/** Fetch all active sources and merge them: one feature per place,
    counts summed across the collections. */
async function fetchFeatures() {
  const token = ++fetchToken;
  const collections = await Promise.all(
    sources.value.map((s) => client.map(s.type, s.mapParams))
  );
  if (token !== fetchToken) return; // superseded by newer filters

  const byPlace = new Map();
  for (const collection of collections) {
    for (const feature of collection.features) {
      const existing = byPlace.get(feature.id);
      if (existing) {
        existing.properties.count += feature.properties.count;
      } else {
        byPlace.set(feature.id, feature);
      }
    }
  }

  rawSource.clear();
  const format = new GeoJSON({ featureProjection: "EPSG:3857" });
  rawSource.addFeatures(
    format.readFeatures({
      type: "FeatureCollection",
      features: [...byPlace.values()],
    })
  );
}

function onPointerMove(evt) {
  const map = olMap.value;
  if (evt.dragging || !map) return;
  const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
    hitTolerance: 5,
    layerFilter: (l) => l === vectorLayer,
  });
  if (hoveredCluster.value !== feature) {
    hoveredCluster.value = feature || null;
    vectorLayer.changed();
  }
  map.getTargetElement().style.cursor = feature ? "pointer" : "";
}

function onClick(evt) {
  const map = olMap.value;
  if (!map) return;
  const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
    hitTolerance: 5,
    layerFilter: (l) => l === vectorLayer,
  });
  if (!feature) return;

  const inner = feature.get("features");
  const view = map.getView();

  if (inner.length === 1) {
    // Select the place: the gallery narrows to it (legacy setPlace).
    const place = inner[0];
    iconographia.placeId = place.getId();
    iconographia.placeName = place.get("name") || "";
    view.animate({
      center: place.getGeometry().getCoordinates(),
      zoom: Math.max(view.getZoom(), 9),
      duration: 300,
    });
  } else {
    // Zoom towards the cluster.
    view.animate({
      center: feature.getGeometry().getCoordinates(),
      zoom: Math.min(view.getZoom() + 1.5, 16),
      duration: 300,
    });
  }
}

function attach(map) {
  map.addLayer(vectorLayer);
  map.on("pointermove", onPointerMove);
  map.on("click", onClick);
  fetchFeatures();
}

onMounted(() => {
  if (olMap.value) attach(olMap.value);
  else {
    const stop = watch(olMap, (map) => {
      if (map) {
        attach(map);
        stop();
      }
    });
  }
});

onUnmounted(() => {
  const map = olMap.value;
  if (map) {
    map.removeLayer(vectorLayer);
    map.un("pointermove", onPointerMove);
    map.un("click", onClick);
  }
});

watch(sources, () => fetchFeatures(), { deep: true });
</script>

<template>
  <div style="display: none"></div>
</template>
