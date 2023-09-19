<script setup lang="ts">
import AutocompleteComponent from "@/components/input/AutocompleteComponent.vue";
import MapViewMapCard from "./MapViewMapCard.vue";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { rwandaStore } from "./rwandaStore";
import { useRwandaMap } from "./map.composable";
import { formatNames } from "./names";
import type { Place } from "./types";
import { ref, watch, computed } from "vue";
import router from './router'
import { watchEffect } from "vue";
import { all } from "axios";

//Filtering map controls
const SOURCES = {
  images: "Images",
  places: "Places",
  interviews: "Interviews",
}
const PLACE_TYPES = {
  area: "Areas",
  street: "Streets",
  building: "Buildings",
}
const INFORMANTS = {
  ym: "Young males",
  om: "Old males",
  yw: "Young women",
  ow: "Old women"
}
const PERIODS = {
  colonial: "Colonial",
  postind: "Post-indenpendence",
  postgeno: "Post-genocide",
  after: "After 2012"
}
//if true - show all
const allSources = ref(true)
const allPlaceTypes = ref(true)
const allInformants = ref(true)
const allPeriods = ref(true)

//checked values are stored in store as arrays
const {sources, placeTypes, informants, periods} = storeToRefs(rwandaStore());

//TODO - Uncheck All when other is checked
const updateAllSources =() => {
  if(sources.value.length != 0){
    allSources.value = false
    console.log(allSources.value)
  } else {
    allSources.value = true
  }
}

//TODO - Filter map on button click
</script>

<template>
  <div class="filter-container">
    <div class="filter-heading">Sources</div>
      <label class="checkboxes">
        <input type="checkbox" :value="allSources" @click="allSources =!allSources " checked>All
        <div v-for="source in SOURCES" class="checkboxes">
          <input type="checkbox" :value="source" v-model="sources" @change="updateAllSources()">
          {{ source }}
        </div>
      </label>
      <div class="filter-heading">Place types</div>
      <label class="checkboxes">
        <input type="checkbox" :value="allPlaceTypes" @click="allPlaceTypes =!allPlaceTypes " checked>All
        <div v-for="place in PLACE_TYPES" class="checkboxes">
          <input type="checkbox" :value="place" v-model="placeTypes">
          {{ place }}
        </div>
      </label>
      <div class="filter-heading">Informants</div>
      <label class="checkboxes">
        <input type="checkbox" :value="allInformants" @click="allInformants =!allInformants " checked>All
        <div v-for="informant in INFORMANTS" class="checkboxes">
          <input type="checkbox" :value="informant" v-model="informants">
          {{ informant }}
        </div>
      </label>
      <div class="filter-heading">Time periods</div>
      <label class="checkboxes">
        <input type="checkbox" :value="allPeriods" @click="allPeriods =!allPeriods " checked>All
        <div v-for="period in PERIODS" class="checkboxes">
          <input type="checkbox" :value="period" v-model="periods">
          {{ period }}
        </div>
      </label>
      <div style="margin-top: 10px;">
        <button class="p-1 px-3 clickable category-button">Filter map</button>
      </div>
  </div>
</template>

<style>

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
