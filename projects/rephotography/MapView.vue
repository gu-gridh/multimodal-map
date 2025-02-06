<script setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import DianaPlaceLayerRephoto from "./DianaPlaceLayerRephoto.vue";
import FeatureSelection from "./FeatureSelectionRephoto.vue";
import MapViewPreview from "./MapViewPreview.vue";
import MapViewGallery from "./MapViewGallery.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./settings/store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-gold.svg";
import markerBlue from "@/assets/marker-blue.svg";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import GeoJSON from "ol/format/GeoJSON";

const { categories, years, tags, tagsLayerVisible, placesLayerVisible, mapLayerVisibility, mapLayerVisibilityTwo } = storeToRefs(rephotographyStore());
const store = mapStore();
const { selectedFeature } = storeToRefs(store);
const minZoom = 9;
const maxZoom = 16;
const featureZoom = 11; //value between minZoom and maxZoom when you select a point 

const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
    start_date: years.value[0],
    end_date: years.value[1],
  })
);

watch(
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry).getCoordinates();
        store.updateCenter(coordinates);
        if (store.zoom < featureZoom) {
          store.updateZoom(featureZoom);
        }
      }
    }
  },
  { immediate: true }
);

const tagParams = computed(() => {
  const tag_set = tags.value[0];
  return clean({
    tag_set,
  });
});

const visibleAbout = ref(false);
const showGrid = ref(false);
let visited = false;

onMounted(() => {
  //check if the "visited" key exists in session storage
  visited = sessionStorage.getItem("visited") === "true";

  if (!visited) {
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  }
})

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

const vectorLayers = computed(() => [
  {
    url: "https://data.dh.gu.se/geography/glacier_front_2022.geojson",
    geoJsonFormat: new GeoJSON(),
  },
  {
    url: "https://data.dh.gu.se/geography/glacier_front_2021.geojson",
    geoJsonFormat: new GeoJSON(),
  },
  {
    url: "https://data.dh.gu.se/geography/glacier_front_2008.geojson",
    geoJsonFormat: new GeoJSON(),
  },
]);

/*Colors for Vector Layer*/
const layerColors = ["rgb(255,150,0)", "rgb(0,150,50)", "rgb(0,100,255)"];

watch(showGrid, (newValue) => {
  localStorage.setItem("showGrid", JSON.stringify(newValue));
});
</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center;">
    <div class="ui-mode ui-overlay">
      <button class="item" v-bind:class="{ selected: !showGrid }" v-on:click="showGrid = false;">
        Map
      </button>
      <button class="item" v-bind:class="{ selected: showGrid }" v-on:click="showGrid = true;">
        Gallery
      </button>
    </div>
  </div>
  <MapViewGallery v-if="showGrid" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <div class="gradient-blur">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <MainLayout>
    <template #search>
      <button class="item" @click="toggleAboutVisibility">
        <div class="p-1 px-2 clickable category-button" style="
                margin-top: -10px;
              ">More info</div>
      </button>
      <MapViewControls />
    </template>

    <template #background>
      <MapComponent :shouldAutoMove="true" :min-zoom=minZoom :max-zoom=maxZoom
        :restrictExtent="[0.0, 75.0, 30.0, 81.0]">
        <template #layers>
          <NpolarLayer
            capabilitiesUrl="https://geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Ortofoto_Svalbard_WMTS_3857/MapServer/WMTS/1.0.0/WMTSCapabilities.xml" />

          <!-- places -->
          <DianaPlaceLayer v-if="placesLayerVisible" path="rephotography/geojson/place/" :params="placeParams"
            :z-index=2>
            <ol-style>
              <ol-style-icon :src="markerIcon" :scale="1.8" :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"></ol-style-icon>
            </ol-style>
            <FeatureSelection />
          </DianaPlaceLayer>

          <!-- tags -->
          <DianaPlaceLayer v-if="tagsLayerVisible" path="rephotography/search/tag/" :params="tagParams" :z-index=2>
            <ol-style>
              <ol-style-icon :src="markerIcon" :scale="1.8" :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"></ol-style-icon>
            </ol-style>
            <FeatureSelection />
          </DianaPlaceLayer>

          <DianaPlaceLayer path="rephotography/geojson/focus/" :z-index=2>
            <ol-style>
              <ol-style-icon :src="markerBlue" :scale="1.8" :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"></ol-style-icon>
            </ol-style>
          </DianaPlaceLayer>

          <DianaPlaceLayerRephoto v-for="layer in vectorLayers" :key="layer.url" :geojsonUrl="layer.url" :zIndex="2"
            :isVisible="mapLayerVisibility" :date=true>
          </DianaPlaceLayerRephoto>

          <DianaPlaceLayerRephoto :geojsonUrl="'https://data.dh.gu.se/geography/CryoClim_GAO_SJ_1936-1972.geojson'"
            :zIndex="1" :isVisible="mapLayerVisibilityTwo" :date=false>
          </DianaPlaceLayerRephoto>

          <!-- 
        <DianaPlaceLayerRephoto
          :geojsonUrl="'https://data.dh.gu.se/geography/CryoClim_GAO_SJ_2001-2010.geojson'"
          :zIndex=1
          :isVisible="mapLayerVisibilityThree"
        >
        </DianaPlaceLayerRephoto> -->

        </template>
      </MapComponent>
    </template>

    <template #details>
      <MapViewPreview />
    </template>
  </MainLayout>
</template>

<style>
.main-title {
  font-size: 4.5vw;
  margin-bottom: 30px;
}

#app .left-pane {
  background-size: contain;
  width: 50%;
  min-width: 900px;
  user-select: none;
}

.map-container {
  height: calc(100vh - 80px) !important;
  position: relative;
  width: 100%;
  user-select: none;
}

.gradient-blur {
  position: fixed;
  z-index: 1;
  inset: auto 0 0 0;
  height: calc(100vh - 80px);
  pointer-events: none;
  width: 750px;
  top: 0px;
  opacity: 1.0;
  user-select: none;
}

@media screen and (max-width: 900px) {
  .gradient-blur {
    display: none;
  }
}

.gradient-blur>div,
.gradient-blur::before,
.gradient-blur::after {
  position: absolute;
  inset: 0;
}

.gradient-blur::before {
  content: "";
  z-index: 1;
  backdrop-filter: blur(0.5px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 0) 37.5%);
}

.gradient-blur>div:nth-of-type(1) {
  z-index: 2;
  backdrop-filter: blur(1px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 0) 50%);
}

.gradient-blur>div:nth-of-type(2) {
  z-index: 3;
  backdrop-filter: blur(2px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 62.5%);
}

.gradient-blur>div:nth-of-type(3) {
  z-index: 4;
  backdrop-filter: blur(4px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 0) 75%);
}

.gradient-blur>div:nth-of-type(4) {
  z-index: 5;
  backdrop-filter: blur(8px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 87.5%);
}

.gradient-blur>div:nth-of-type(5) {
  z-index: 6;
  backdrop-filter: blur(16px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 0) 100%);
}

.gradient-blur>div:nth-of-type(6) {
  z-index: 7;
  backdrop-filter: blur(32px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 1) 100%);
}

.gradient-blur::after {
  content: "";
  z-index: 8;
  backdrop-filter: blur(64px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 87.5%,
      rgba(0, 0, 0, 1) 100%);
}

.ol-hover {
  color: white !important;
}
</style>
