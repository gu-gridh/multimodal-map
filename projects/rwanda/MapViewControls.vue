<script setup lang="ts">
import { storeToRefs } from "pinia";
import { rwandaStore } from "./settings/rwandaStore";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import ButtonList from "./input/ButtonList.vue";
import Dropdown from "./input/DropdownComponent.vue";
import CategoryButton from "@/components/input/CategoryButton.vue";

//Filtering map controls
const SOURCES = {
  image: "Images",
  text: "Interviews",
  document: "Documents",
}
const PLACE_TYPES = {
  area: "Areas",
  street: "Streets",
  building: "Buildings",
}
const INFORMANTS = {
  "Young male": "Young 	person",
  "Old male": "Old person",
/*   "Young female": "Young &#9792;",
  "Old female": "Old &#9792;" */
}
const PERIODS = {
  "Before 1899": "Pre-colonial",
  "1899-1962": "Colonial",
  "1962-1994": "Post-independence",
  "1994-2012": "Post-genocide",
  "After 2012": "After 2012"
}
const LANGUAGES = {
  "English": "ENG",
  "French": "FR",
  "French-Kinyarwanda": "FR-KIN",
  "Kinyarwanda": "KIN",
  "Kinyarwanda-English": "KIN-ENG",
  "Arabic": "AR",
  "Arabic-English": "AR-ENG",
  "Kiswahili": "SW",
}
const { sources, placeTypes, periods, informants, allLayer, languages, showAdvancedLayer } = storeToRefs(rwandaStore());

//handle category button click
const handleSourcesClick = (key: string) => {
  if(key == "all"){
    showAdvancedLayer.value = false
    allLayer.value = true
    sources.value = []
    placeTypes.value = []
    periods.value = []
    informants.value = []
    languages.value = []
  }
  else {
    showAdvancedLayer.value = true
    //turn off show all
    allLayer.value = false
  }
}

</script>

<template>
  <div class="filter-container" style="margin-top:20px;">
    <CategoryButton
      :text="'Show all'"
      :value="allLayer"
      @toggle="handleSourcesClick('all')"
      class="filter-button"
      style="margin-left:0px;"
    />
    <div class="main-filters">
      <div style="width:320px; display:flex; flex-direction: row;  align-items: center;">
    <div class="filter-heading">Places:</div>
      <CategoryButtonList 
        v-model="placeTypes"
        :categories="PLACE_TYPES"
        :limit="1"
        class="filter-button"
        @click="handleSourcesClick"
      />
    </div>
      <div style="width:500px; display:flex; flex-direction: row;  align-items: center;">
    <div class="filter-heading">Sources:</div>
      <CategoryButtonList 
        v-model="sources"
        :categories="SOURCES"
        :limit="1"
        class="filter-button"
        @click="handleSourcesClick"
      />
    </div>
    <div style="width:320px; display:flex; flex-direction: row;  align-items: center;">
      <div class="filter-heading" v-show="sources.includes('text')">Informants:</div>
      <CategoryButtonList 
        v-show="sources.includes('text')"
        v-model="informants"
        :categories="INFORMANTS"
        :limit="1"
        class="filter-button"
        @click="handleSourcesClick"
      />
    </div>
   
    <div style="width:360px; display:flex; flex-direction: row; justify-content:space-between; align-items: center;">
      <div>
     <div class="filter-heading">Languages</div>
      <Dropdown 
        v-model="languages"
        :categories="LANGUAGES"
        :limit="1"
        class="filter-button lang-buttons"
        @click="handleSourcesClick" />
      </div>
      <div style="height: 55px; margin-top:25px; width:2px;border-style: dotted; border-width:0px 1.5px 0 0; border-color:var(--theme-3);">  </div>
      <div style="">
    <div class="filter-heading">Time Periods</div>
      <Dropdown 
        v-model="periods"
        :categories="PERIODS"
        :limit="1"
        class="filter-button"
        @click="handleSourcesClick"
      />
    </div>
  </div>
  </div>
  </div>
</template>

<style>
.filter-button {
  font-size: 0.8em;
}
#app .filter-heading {
  font-size: 1em!important;
  margin-bottom: 10px;
  margin-top: 15px;
  font-weight: 300;
  min-width:90px;
  line-height:1.6;
}
.main-filters{
  font-size:100%;
}
.checkboxes {
  display: inline-block;
  position: relative;
  padding-right: 5px;
}

.dropdown{

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
  background-color: var(--theme-3);
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
  background-color: var(--theme-2);
  color: white;
}

#app .category-button.active {
  background-color: var(--theme-2);
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

@media (max-width: 1024px) {
  .filter-button {
    
  }
  .filter-heading {
    font-size: 18px;
  }
}

</style>
