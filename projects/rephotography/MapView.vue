<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import DianaPlaceLayerRephoto from "@/components/DianaPlaceLayerRephoto.vue";
import FeatureSelection from "@/components/FeatureSelectionRephoto.vue";
import MapViewPreview from "./MapViewPreview.vue";
import MapViewGallery from "./MapViewGallery.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-gold.svg";
import markerBlue from "@/assets/marker-blue.svg";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import GeoJSON from "ol/format/GeoJSON";


const { categories, years, tags, tagsLayerVisible, placesLayerVisible, mapLayerVisibility, mapLayerVisibilityTwo, mapLayerVisibilityThree } = storeToRefs(rephotographyStore());

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
        const coordinates = (geometry as any).getCoordinates();
        store.updateCenter(coordinates);
        if (store.zoom < featureZoom)
        {
          store.updateZoom(featureZoom);
        }
      }
    }
  },
  { immediate: true }
);

const tagParams = computed(() => {
  const tag_set = tags.value[0]; // Assuming that tags always contains at least one element
  return clean({
    tag_set,
  });
});


const visibleAbout = ref(false);
const showGrid = ref(false);
let visited = false; // Store the visited status outside of the hook

onMounted(() => {
  // Check if the "visited" key exists in session storage
  visited = sessionStorage.getItem("visited") === "true"; // Retrieve the visited status from session storage

  if (!visited) {
    // Hide the about component
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  } 
})

const toggleAboutVisibility = async () => {
  console.log('fired')
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

const showSection = ref(false);

const toggleSection = () => {
  showSection.value = !showSection.value;
};

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
  <MainLayout>
    <template #search>
      <button class="item"  @click="toggleAboutVisibility">
            <div
              class="p-1 px-2 clickable category-button"
              style="
                margin-top: -10px;
              "
            >More info</div>
          </button>
      <MapViewControls />
    </template>

  
   

    <template #background>
      <MapComponent 
      :shouldAutoMove="true" 
      :min-zoom=minZoom
      :max-zoom=maxZoom 
      :restrictExtent="[0.0, 75.0, 30.0, 81.0]" >
        <template #layers>
          <NpolarLayer
            capabilitiesUrl="https://geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Ortofoto_Svalbard_WMTS_3857/MapServer/WMTS/1.0.0/WMTSCapabilities.xml"
          />

        <!-- places -->
        <DianaPlaceLayer
          v-if="placesLayerVisible"
          path="rephotography/geojson/place/"
          :params="placeParams"
          :z-index=2
        >
          <ol-style>
            <ol-style-icon
              :src="markerIcon"
              :scale="1.8"
              :displacement="[-10, 45]"
              :anchor="[0.0, 0.0]"
            ></ol-style-icon>
          </ol-style>
          <FeatureSelection />
        </DianaPlaceLayer>

        <!-- tags -->
        <DianaPlaceLayer
          v-if="tagsLayerVisible"
          path="rephotography/search/tag/"
          :params="tagParams"
          :z-index=2
        >
          <ol-style>
            <ol-style-icon
              :src="markerIcon"
              :scale="1.8"
              :displacement="[-10, 45]"
              :anchor="[0.0, 0.0]"
            ></ol-style-icon>
          </ol-style>
          <FeatureSelection />
        </DianaPlaceLayer>

          <DianaPlaceLayer
          path="rephotography/geojson/focus/"
          :z-index=2
          >
          <ol-style>
            <ol-style-icon
              :src="markerBlue"
              :scale="1.8"
              :displacement="[-10, 45]"
              :anchor="[0.0, 0.0]"
            ></ol-style-icon>
          </ol-style>
        </DianaPlaceLayer>

        <div v-if="mapLayerVisibility">
          <DianaPlaceLayerRephoto
          v-for="(layer, index) in vectorLayers"
          :key="layer.url"
          :externalUrl="layer.url"
          :zIndex=2
        >
          <ol-style>
            <ol-style-stroke :color="layerColors[index % layerColors.length]" :width="4"></ol-style-stroke>
          </ol-style>
        </DianaPlaceLayerRephoto>
      </div>

      <div v-if="mapLayerVisibilityTwo">
        <DianaPlaceLayerRephoto
          :externalUrl="'https://data.dh.gu.se/geography/CryoClim_GAO_SJ_1936-1972.geojson'"
          :zIndex=1
        >
          <ol-style>
              <ol-style-fill color="rgba(255,255,255,0.4)"></ol-style-fill>
          </ol-style>
        </DianaPlaceLayerRephoto>
      </div>

      <div v-if="mapLayerVisibilityThree">
        <DianaPlaceLayerRephoto
          :externalUrl="'https://data.dh.gu.se/geography/CryoClim_GAO_SJ_2001-2010.geojson'"
          :zIndex=1
        >
          <ol-style>
            <ol-style-stroke color="purple" :width="4"></ol-style-stroke>
          </ol-style>
        </DianaPlaceLayerRephoto>
      </div>


        </template>
      </MapComponent>
    </template>

    <template #details>
      <MapViewPreview />
    </template>
  </MainLayout>
</template>

<style>

.main-title{
  font-size: 4.5vw;
  margin-bottom:30px;
}

#app .left-pane {
  width: 50%;
  min-width: 900px;
}

.map-container {
  height: calc(100vh - 80px) !important;
  position: relative;
  width: 100%;
}


</style>
