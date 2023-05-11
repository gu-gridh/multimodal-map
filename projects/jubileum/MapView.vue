<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import PlaceDetails from "./PlaceDetails.vue";
import { storeToRefs } from "pinia";
import { jubileumStore } from "./store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-white.svg";
import MasonryGrid from "./MasonryGrid.vue";
import { ref } from "vue";
import About from "./About.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";

const { categories } = storeToRefs(jubileumStore());
const targetDiv = document.getElementById("third");
const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
  })
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
            >Mer information</div>
          </button>
      <Search />
    </template>
    
    <template #background>
    
      <div class="map-container">
        
        <MapComponent
          :min-zoom="16"
          :max-zoom="18"
          :restrictExtent="[11.922, 57.7215, 11.996, 57.69035]"
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
        
        <MasonryGrid v-if="showGrid" />

      </div>
    </template>
    
    <template #details>
      
      <PlaceDetails />
      
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
margin-top: 70px;
z-index: 250;
position:absolute;
border-radius: 8px;
font-size: 18px;
font-weight: 700;
color: white;
margin-left:450px;
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
  font-size: 1.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center;
  line-height: 1.2;
  position: absolute;
  background-color: white;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px;
  border-radius: 5px;
  border: 0px solid #cccccc;
  bottom: 35px;
  left: -50px;
  min-width: 100px;
}

#app .ol-control button {
  font-family: "Barlow Condensed", sans-serif;
  border-radius: 50% !important;
  background-color: rgb(248, 249, 228) !important;
  color: black !important;
}

#app .ol-control button:hover,
.ol-control button:focus {
  background-color: rgb(220, 140, 140) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}

#app .ol-control button:active {
  background-color: rgb(180, 100, 100) !important;
  color: white !important;
  border-style: none !important;
  border-style: hidden !important;
}

</style>
