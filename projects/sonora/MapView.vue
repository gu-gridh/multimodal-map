<script setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "./components/MapComponent.vue";
import DianaPlaceLayer from "./MapViewMarkers.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { sonoraStore } from "./settings/store";
import { mapStore } from "@/stores/store";
import MapViewGallery from "./MapViewGallery.vue";
import MapViewArchive from "./MapViewArchive.vue";
import { ref } from "vue";
import About from "./About.vue";
import Instructions from "./Instructions.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import Title from "./MapViewTitle.vue"

const { placesLayerVisible, dataParams, selectedBuilderId } = storeToRefs(sonoraStore());
const store = mapStore();
const { selectedFeature } = storeToRefs(store);
const featureZoom = 16; //value between minZoom and maxZoom when you select a point 
const visibleAbout = ref(false);
const visibleInstructions = ref(false);
const mapViewControls = ref(null);
const showGrid = ref(false);
const showArchive = ref(false);
let visited = true; //store the visited status outside of the hook

watch(
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry).getCoordinates();
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

// Reset the selectedBuilderId when closing the archive so the same builder can be selected
watch(showArchive, (newValue, oldValue) => {
  // Check if the archive was open before
  if (oldValue && !newValue) {
    selectedBuilderId.value = 0;  
  }
});

const apiUrl = computed(() => {
  const baseUrl = 'https://orgeldatabas.gu.se/webgoart/goart/map.php';
  const buildingTypeId = dataParams.value.buildingTypeId || 0; // Default to 0
  const year1 = dataParams.value.year1 || ''; 
  const year2 = dataParams.value.year2 || '';
  return `${baseUrl}?btype=${buildingTypeId}&year1=${year1}&year2=${year2}`;
});

onMounted(() => {
  // Check if the "visited" key exists in session storage
  visited = sessionStorage.getItem("visited") === "true"; // Retrieve the visited status from session storage
  const storedShowGrid = localStorage.getItem("showGrid");
  const storedShowArchive = localStorage.getItem("showArchive");

  if (!visited) {
    // Hide the about component
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  }

  //show the gallery
  if (storedShowGrid) {
    showGrid.value = JSON.parse(storedShowGrid);
  }

  //show the archive
  if (storedShowArchive !== null) {
    showArchive.value = JSON.parse(storedShowArchive);
  }
})

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

const toggleInstructionsVisibility = async () => {
  await nextTick();
  visibleInstructions.value = !visibleInstructions.value;
};

watch(showGrid, (newValue) => {
  localStorage.setItem("showGrid", JSON.stringify(newValue));
});

watch(showArchive, (newValue) => {
  localStorage.setItem("showArchive", JSON.stringify(newValue));
});

watch(visibleAbout, async (newVal) => {
  if (!newVal) {
    await nextTick();
    if (mapViewControls.value && mapViewControls.value.searchInput) {
      mapViewControls.value.searchInput.focus();
    }
  }
});

</script>

<template>
  <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay ui-overlay-top">
     <button class="item" :class="{ selected: !showGrid && !showArchive }" @click="showGrid = false; showArchive = false;">
      {{ $t('map') }}
    </button>
    <button class="item" :class="{ selected: showGrid }" @click="showGrid = true; showArchive = false;">
      {{ $t('gallery') }}
    </button>
    <button class="item" :class="{ selected: showArchive }" @click="showArchive = true; showGrid = false;">
      {{ $t('archive') }}
    </button>
    </div>
  </div>
  <MapViewGallery v-if="showGrid && !showArchive" />
  <MapViewArchive v-if="showArchive" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <Instructions :visibleInstructions="visibleInstructions" @close="visibleInstructions = false" />
  <MainLayout>
    <template #search>
      <Title @toggleAbout="toggleAboutVisibility" @toggleInstructions="toggleInstructionsVisibility"/>
      <MapViewControls ref="mapViewControls" />
    </template>

    <template #background>
      <div class="map-container">
        <MapComponent 
          :shouldAutoMove="true" 
          :key="showGrid.toString()"
        >
          <!-- :min-zoom=minZoom
          :max-zoom=maxZoom  -->
        <!-- :restrictExtent="[11.9, 42.15, 12.2, 42.4]"      -->
          <template #layers>
            <DianaPlaceLayer v-if="placesLayerVisible" :apiUrl="apiUrl" :zIndex="20">
            </DianaPlaceLayer>
          </template>
          
        </MapComponent>  
      </div> 
    </template>

    <template #details>
      <MapViewPreview v-if="!showGrid && !showArchive"/>
    </template>

  </MainLayout>
</template>

<style>

#app .tile-layer {
  filter: grayscale(80%);
}

.map-container {
  height: calc(100vh - 80px) !important;
  position: relative;
  width: 100%;
}

/* Overides the settings in ui_modules.css */
#app .ol-popup {
  left: -85px;
  width: 180px;
  min-width: 90px;
  bottom:55px;
}

#app .ol-popup:before {
  left: 60px;
}
</style>
