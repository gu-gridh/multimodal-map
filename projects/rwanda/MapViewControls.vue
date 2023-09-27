<script setup lang="ts">
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { rwandaStore } from "./rwandaStore";
import { useRwandaMap } from "./map.composable";
import type { Place } from "./types";
import { ref, watch } from "vue";
import { watchEffect } from "vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import CategoryButton from "@/components/input/CategoryButton.vue";

//Filtering map controls
const SOURCES = {
  all: "All",
  images: "Images",
  places: "Place names",
  interviews: "Interviews",
}
const PLACE_TYPES = {
  area: "Areas",
  street: "Streets",
  building: "Buildings",
}
const INFORMANTS = {
  "Young male": "Young 	&#9794;",
  "Old male": "Old 	&#9794;",
  "Young female": "Young &#9792;",
  "Old female": "Old &#9792;"
}
const PERIODS = {
  "colonial period": "Colonial",
  "post-independence": "Post-indenpendence",
  "post-genocide": "Post-genocide",
  "after 2012": "After 2012"
}

const { sources, placeTypes, periods, informants, sourcesLayer, placeTypeLayer, periodsLayer, allLayer, informantsLayer } = storeToRefs(rwandaStore());

//handle category button click
const handleSourcesClick = (key: string) => {
  if(key == "all"){
    sourcesLayer.value = false
    placeTypeLayer.value = false
    periodsLayer.value = false
    informantsLayer.value = false
    allLayer.value = true
  }
  else {
    sourcesLayer.value = true
    placeTypeLayer.value = false
    periodsLayer.value = false
    allLayer.value = false
    informantsLayer.value = false
  }
}

const handlePlaceTypeClick = (key: string) => {
  console.log("Clicked: ", key);
  placeTypeLayer.value = true
  sourcesLayer.value = false
  periodsLayer.value = false
  allLayer.value = false
  informantsLayer.value = false
}

const handlePeriodClick = (key: string) => {
  console.log("Clicked: ", key);
  periodsLayer.value = true
  sourcesLayer.value = false
  placeTypeLayer.value = false
  allLayer.value = false
  informantsLayer.value = false
}

const handleInformantClick = (key: string) => {
  console.log("Clicked: ", key);
  informantsLayer.value = true
  sourcesLayer.value = false
  placeTypeLayer.value = false
  periodsLayer.value = false
  allLayer.value = false
}
</script>

<template>
  <div class="filter-container">
    <div class="filter-heading">Sources</div>
      <CategoryButtonList 
        v-model="sources"
        :categories="SOURCES"
        :limit="1"
        class="filter-button"
        @click="handleSourcesClick"
      />
    <div class="filter-heading">Place types</div>
      <CategoryButtonList 
        v-model="placeTypes"
        :categories="PLACE_TYPES"
        :limit="1"
        class="filter-button"
        @click="handlePlaceTypeClick"
      />
    <div class="filter-heading">Informants</div>
      <CategoryButtonList 
        v-model="informants"
        :categories="INFORMANTS"
        :limit="1"
        class="filter-button"
        @click="handleInformantClick"
      />
    <div class="filter-heading">Time periods</div>
      <CategoryButtonList 
        v-model="periods"
        :categories="PERIODS"
        :limit="1"
        class="filter-button"
        @click="handlePeriodClick"
      />
  </div>
</template>

<style>
.filter-button {
  font-size: 14px;
}
.filter-heading {
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 10px;
  font-weight: 500;
}
.checkboxes {
  display: inline-block;
  position: relative;
  padding-right: 5px;
}

#app .searchbox{
  background-color:black !important;
  width:100%;
  color:white;
  padding:15px  !important;
  font-size: 25px;
}

#app .searchbox-menu{
  z-index:10;
  margin-top:-5px;
  padding:10px 0px 0px 0px;
  border-radius:0 0 8px 8px;
  background-color:rgb(45,45,45);
  color:white;
  max-height:calc(100vh - 550px);


}

#app .searchbox-menu-text{
  
  padding:15px  !important;
  font-size: 16px;

}

#app .searchbox-menu-text-active{
  
 background-color:rgb(180,100,100);

}


#app .searchbox-menu-text-active{
  
  color:white;
 
 }


.filter-container {
  padding: 1.5rem 0 1.5rem 0;
  border-bottom-right-radius: 0.5rem /* 8px */;
  border-bottom-left-radius: 0.5rem /* 8px */;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}



.section-title {
  font-weight: 400;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 5px;
}
#app .mapcard-container {
  margin-top:10px;
}

#app .area-search-button {
  border-radius:0px;
  margin-bottom:10px;
}

#app .category-button {
  background-color: rgba(180, 100, 100, 1.0);
  color: white;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}

#app .category-button:hover {
  background-color: rgb(220, 140, 140);
  color: white;
}

#app .category-button.active {
  background-color: rgb(180, 100, 100);
  color: white;
}

#app .rounded {
  border-radius: 10px;
}

</style>
