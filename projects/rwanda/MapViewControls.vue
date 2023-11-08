<script setup lang="ts">
import { storeToRefs } from "pinia";
import { rwandaStore } from "./rwandaStore";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import ButtonList from "./input/ButtonList.vue";

//Filtering map controls
const SOURCES = {
  all: "All",
  images: "Images",
  interviews: "Interviews",
  documents: "Documents",
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
const LANGUAGES = {
  "Kinyarwanda-English": "KE",
  "Arabic-English": "AE",
  "French-Kinyarwanda": "FK",
  "Kiswahili": "SW",
  "Kinyarwanda": "RW",
  "French": "FR",
  "English": "EN",
}
const { sources, placeTypes, periods, informants, sourcesLayer, placeTypeLayer, periodsLayer, allLayer, informantsLayer, languages, languagesLayer } = storeToRefs(rwandaStore());

//handle category button click
const handleSourcesClick = (key: string) => {
  if(key == "all"){
    sourcesLayer.value = false
    placeTypeLayer.value = false
    periodsLayer.value = false
    informantsLayer.value = false
    languagesLayer.value = false
    allLayer.value = true
  }
  else {
    sourcesLayer.value = true
    allLayer.value = false
  }
}

const handlePlaceTypeClick = (key: string) => {
  placeTypeLayer.value = true
  allLayer.value = false
}

const handlePeriodClick = (key: string) => {
  periodsLayer.value = true
  allLayer.value = false
}

const handleInformantClick = (key: string) => {
  informantsLayer.value = true
  allLayer.value = false
}

const handleLanguageClick = (key: string) => {
  languagesLayer.value = true
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
      <div class="filter-heading">Languages</div>
      <ButtonList 
        v-model="languages"
        :categories="LANGUAGES"
        :limit="1"
        class="filter-button lang-buttons"
        @click="handleLanguageClick"
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
  font-size: 0.8vw;
}
.filter-heading {
  font-size: 1.1vw;
  margin-bottom: 2px;
  margin-top: 10px;
  font-weight: 400;

}
.checkboxes {
  display: inline-block;
  position: relative;
  padding-right: 5px;
}

#app .searchbox{
  background-color:white !important;
  width:100%;
  color:black;
  padding:15px  !important;
  font-size: 25px;
}

#app .searchbox-menu{
  z-index:10;
  margin-top:-5px;
  padding:10px 0px 0px 0px;
  border-radius:0 0 8px 8px;
  background-color:rgb(255,255,255);
  color:black;
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
  background-color: rgba(250, 250, 250, 1.0);
  color: black;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  width: auto !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

#app .category-button:hover {
  background-color: rgb(180, 100, 100);
  color: white;
}

#app .category-button.active {
  background-color: rgb(180, 100, 100);
  color: white;
}

.lang-buttons {
  margin-bottom: 0px;
}

#app .rounded {
  border-radius: 10px;
}

.no-results{
color:rgb(180,100,100);
}

</style>
