<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import LocalGeoJSONLayer from "@/components/LocalGeoJSONLayer.vue";
import FeatureSelection from "./FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-white.svg";
import markerBlue from "@/assets/marker-blue.svg";
import MapViewGallery from "./MapViewGallery.vue";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import GeoJSON from "ol/format/GeoJSON";

const { categories, years, tags, placesLayerVisible, tagsLayerVisible } = storeToRefs(etruscanStore());
const store = mapStore();
const { selectedFeature } = storeToRefs(store);

watch(
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry as any).getCoordinates();
        store.updateCenter(coordinates);
      }
    }
  },
  { immediate: true }
);

const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
    start_date: years.value[0],
    end_date: years.value[1],
  })
);

const tagParams = computed(() => {
  const tag_set = tags.value[0]; // Assuming that tags always contains at least one element
  return clean({
    tag_set,
  });
});

const visibleAbout = ref(false);
const showGrid = ref(false);
let visited = true; // Store the visited status outside of the hook

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

onMounted(() => {
  const storedShowGrid = localStorage.getItem("showGrid");
  if (storedShowGrid) {
    showGrid.value = JSON.parse(storedShowGrid);
  }
});

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
      <button class="item" @click="toggleAboutVisibility">
        <div class="p-1 px-2 clickable category-button" style="
                width: 90px;
                text-align: center;
                margin-top: 10px;
                cursor: pointer;
              ">More info</div>
      </button>
      <MapViewControls />
    </template>

    <template #background>
      <div class="map-container">
        <MapComponent 
          :shouldAutoMove="true" 
          :min-zoom="14" 
          :max-zoom="18" 
          :restrictExtent="[11.973, 57.93, 12.006, 57.690]"          
          :key="showGrid.toString()"
        > 
        <!-- 11.9, 42.15, 12.2, 42.4   11.973, 57.93, 12.006, 57.690-->
          
          <template #layers>
            <!-- Layer for testing -->
             <!--it is possible to change color with :color="[180,100,100,1.0]", but then the marker becomes badly rasterized-->
            <DianaPlaceLayer v-if="placesLayerVisible" path="jubileum/geojson/place/" :params="placeParams">
              <ol-style>
                <ol-style-icon 
                :src="markerIcon" 
                :scale="1.8" 
                :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"></ol-style-icon>
              </ol-style>
              <FeatureSelection />
            </DianaPlaceLayer>

            <!-- Local layer for testing -->
            <LocalGeoJSONLayer :zIndex="0" geoJsonPath="/SGElevationMain.geojson">
              <ol-style>
                <ol-style-stroke color="rgba(0,0,0,0.05)" :width="2"></ol-style-stroke>  
              </ol-style>
            </LocalGeoJSONLayer>

            <LocalGeoJSONLayer :zIndex="0" geoJsonPath="/SGElevationEdge.geojson">
              <ol-style>
                <ol-style-stroke color="rgba(0,0,0,0.04)" :width="2"></ol-style-stroke>  
              </ol-style>
            </LocalGeoJSONLayer>
          </template>
          
        </MapComponent>  
      </div> 
    </template>

    <template #details>
      <MapViewPreview v-if="!showGrid"/>
    </template>

  </MainLayout>
</template>

<style>
.map-container {
  position: relative;
  width: 100%;
}

#app .right-pane{
display:block !important;
z-index:100 !important;
}


.ui-overlay {
  margin-top: 20px;
  z-index: 250;
  position: absolute;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-left: 200px;
  background-color: rgb(0, 0, 0, 0.8);
  backdrop-filter: blur(3px);
  transition: all 0.5s ease-in-out;
}

.ui-mode {
  top: 0px;
  padding: 4px 10px 4px 10px;
}

.ui-mode .item {
  cursor: pointer;
  display: inline;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  padding: 0px 15px 0px 15px;

}

.ui-mode .item:hover {
  color: white;
}

.ui-mode .selected {
  font-weight: 500;
  color: rgba(255, 255, 255, 1.0);
}

#app .ol-popup {
  font-size: 1.1em !important;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: left!important;
  position: absolute;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px 10px;
  border-radius: 8px !important;
  border: 0px solid #cccccc;
  bottom: 40px;
  left: -70px;
  min-width: 150px;
}

.ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-top-color: white!important;
        border-width: 0px!important;
        left: 45px!important;
        margin-left: 20px;
      }
      .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: 15px;
      }


</style>
