<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "./FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { jubileumStore } from "./store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-white.svg";
import MapViewGallery from "./MapViewGallery.vue";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";

const { categories } = storeToRefs(jubileumStore());
const targetDiv = document.getElementById("third");
const store = mapStore();
const { selectedFeature } = storeToRefs(store);
const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
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
      }
    }
  },
  { immediate: true }
);

const toggleAboutVisibility = async () => {
  console.log('fired')
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

const showGrid = ref(false);
const visibleAbout = ref(false);

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
          <button class="item" v-bind:class="{ selected: !showGrid}" v-on:click="showGrid = false;">
          Karta
        </button>
        <button class="item" v-bind:class="{ selected: showGrid}" v-on:click="showGrid = true;">
         Galleri
        </button>
      </div>
    </div>
  
<About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <MainLayout>
    
    <template #search>
    <button class="item" @click="toggleAboutVisibility">
            <div
              class="p-1 px-2 clickable category-button"
              style="
                width: auto;
                text-align: center;
                margin-top: -10px;
                cursor: pointer;
              "
            >Om jubileumsutställningen och portalen</div>
          </button>
<div style="width:100%; margin-top:20px;">
  <a href="https://gupea.ub.gu.se/handle/2077/74634">
          <button class="item">
            <div
              class="p-1 px-2 clickable category-button"
              style="
                width: auto;
                text-align: center;
                margin-top: -10px;
                cursor: pointer;
                font-weight:400;
              "
            >Publikationer i GUPEA</div>
          </button>
        </a>
        </div>
      <MapViewControls />
    </template>
    
    <template #background>
      <div class="map-container">
        <MapComponent
         :shouldAutoMove="true" 
          :min-zoom="16"
          :max-zoom="18"
          :restrictExtent="[11.922, 57.7215, 12.015, 57.685]"
          :key="showGrid.toString()"
        >
          <template #layers>
        
          
            <DianaPlaceLayer path="jubileum/geojson/place/" :params="placeParams">
              <ol-style>
                <ol-style-icon
                  :src="markerIcon"
                  :scale="2.0"
                  :displacement="[-10, 45]"
                  :anchor="[0.0, 0.0]"
                ></ol-style-icon>
              </ol-style>
              <FeatureSelection />
            </DianaPlaceLayer>
          
            <ol-tile-layer>
              <ol-source-xyz
                url="https://data.dh.gu.se/tiles/gbg_1921b/{z}/{x}/{y}.png"
              />
            </ol-tile-layer>
            
          </template>
          
        </MapComponent>
        
        <MapViewGallery v-if="showGrid" />

      </div>
    </template>
    
    <template #details>
      
      <MapViewPreview />
      
    </template>
    
    <template>
   
  </template>
  
  </MainLayout>
  
</template>

<style>
.map-container {
  position: relative;
  width:100%;
}

#gallery{}

.ui-overlay {
margin-top: 20px;
z-index: 250;
position:absolute;
border-radius: 8px;
font-size: 18px;
font-weight: 700;
color: white;
margin-left:200px;
background-color: rgb(180, 100, 100, 0.8);
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
color:black;
padding: 0px 15px 0px 15px;

}

.ui-mode .item:hover {
  color:white;
}

.ui-mode .selected{
font-weight: 500;
color: white;
}

#app .ol-popup {
  font-size: 1.1em !important;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center!important;
  position: absolute;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px 10px;
  border-radius: 8px !important;
  border: 0px solid #cccccc;
  bottom: 40px;
  left: -80px;
  width: 170px;
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
        left: 55px;
        margin-left: 15px;
      }


#app .ol-control button:hover,
.ol-control button:focus {
  background-color: rgb(120, 60, 60) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}

#app .ol-control button:active {
  background-color: rgb(120, 60, 60) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}

</style>
