<template>
  <div class="control-organisation justify-space">
    <!-- Building Type Section -->
    <div class="tag-section">
      <div class="section-title">{{ $t('buildings') }}</div>
      <div class="broad-controls">
        <button 
          class="p-0.5 px-2 clickable category-button"
          :class="{'active': selectedBuildingTypeIndex === 0}"
          @click="selectCategory('building', 0)"
          :disabled="builderLayerVisible"
        >
          {{ $t('allbuildings') }}
        </button>
        <button
          v-for="(type, index) in buildingTypes"
          :key="index"
          class="p-0.5 px-2 clickable category-button"
          :class="{'active': selectedBuildingTypeIndex === index}"
          @click="selectCategory('building', index)"
          :disabled="builderLayerVisible"
        >
          {{ type }}
        </button>
      </div>
    </div>
  </div>

 <div class="section-title">{{ $t('timespan') }}</div>
 <RangeSlider
   ref="rangeSliderRef"
   v-model="selectedRange"
   :min="1300"
   :max="1899"
   :step="1"
   class="my-2"
   :isSliderVisible="true"
   :disabled="builderLayerVisible"
 />

 <div class="toggle-buttons" style="margin-top: 20px">
   <button style="float:left; border-radius:4px 0px 0px 0px" :class="{ active: searchType === 'places' }" @click="setSearchType('places')">{{ $t('places') }}</button>
   <button style="border-radius:0px 4px 0px 0px" :class="{ active: searchType === 'builders' }" @click="setSearchType('builders')">{{ $t('builders') }}</button>
 </div>
   <div class="search-section">
     <input
       ref="searchInput"
       type="text"
       v-model="searchQuery"
       @input="handleSearch"
       @focus="handleSearchBoxFocus"
       :placeholder="searchType === 'places' ? $t('searchPlaces') : $t('searchBuilders')"
       class="search-box"
       autofocus
     />
     <div class="search-results">
       <!-- Rendering for 'places' -->
       <template v-if="searchType === 'places'">
         <div v-for="feature in filteredPlaces" 
             :key="feature.properties ? feature.properties.Nr : 'no-place'" 
             class="search-result-item"
             @click="onPlaceClick(feature)">
           {{ feature.properties.Building }}
         </div>
       </template>

       <!-- Rendering for 'builders' -->
       <template v-else-if="searchType === 'builders'">
  <div v-for="(builder, index) in objectToArray(searchResults)" 
      :key="index" 
      :class="['search-result-item', { 'selected-builder': builder.Id === selectedBuilderId }]"
      @click="onBuilderClick(builder.Id)">
    {{ builder.Builder }}
  </div>
</template>
     </div>
   </div>
     <!-- Data Section -->
   <div class="data-widget-counter">
     <div class="data-widget-section">
       <div class="data-widget-item">
         <h3>{{ $t('shownorgans') }}</h3>
         <p>{{ noPlaceCount }}</p>
       </div>
     </div>
   </div>
</template>

<script setup>
import { inject, ref, onMounted, computed, defineProps, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import { fromLonLat } from "ol/proj";
import { mapStore } from "@/stores/store";
import { sonoraStore } from "./settings/store";
import { DianaClient } from "@/assets/diana";
import RangeSlider from "@/components/input/RangeSlider.vue";
import _debounce from 'lodash/debounce';
import i18n from '../../src/translations/sonora';

const store = mapStore();
const timePeriods = ref({}); // State to store time periods
const selectedTimePeriodIndex = ref(null); // State to track the selected time period index
const buildingTypes = ref({}); // State to store time periods
const firstSearchBoxClick = ref(true); // track the first click of the search box
const searchType = ref('places'); // Default to 'places' 
const searchQuery = ref('');
const { selectedFeature } = storeToRefs(mapStore());
const searchResults = ref([]);
const sonora = sonoraStore();
const { selectedBuilderId, noPlaceCount, builderLayerVisible, placeClicked, selectedRange, selectedBuildingTypeIndex } = storeToRefs(sonora);
const featureZoom = 16; //value between minZoom and maxZoom when you select a point 
const allZoom = 5.3; //value to see all of sweden 
const rangeSliderRef = ref(null);
const searchInput = ref(null);

const setSearchType = (type) => {
 searchType.value = type;
 handleSearch();
};

const onBuilderClick = (builderId) => {
 const geographicCoordinates = [16, 59.3];

 // Transform the geographic coordinates to the map's coordinate system
 const transformedCoordinates = fromLonLat(geographicCoordinates);

 // Update the map's zoom and center
 store.updateZoom(allZoom);
 store.updateCenter(transformedCoordinates);

 if (selectedBuilderId.value === builderId) {
    selectedBuilderId.value = 0;
    builderLayerVisible.value = false;
  } else {
    selectedBuilderId.value = builderId;
  }
};

const filteredPlaces = computed(() => {
 if (searchResults.value && searchResults.value.features) {
   return searchResults.value.features.filter(feature => feature.properties);
 }
 return [];
});

const handleSearchBoxFocus = () => {
 if (firstSearchBoxClick.value && searchType.value === 'places') {
   fetchPlaces('');
   firstSearchBoxClick.value = false; // Set to false after first fetch
 }
};

const objectToArray = (obj) => {
 return obj ? Object.keys(obj).map(key => obj[key]) : [];
};

onMounted(async () => {
 await fetchFilters();
 builderLayerVisible.value = false;

 nextTick(() => {
   if (searchInput.value) {
     searchInput.value.focus();
   }
 });
});

watch(selectedRange, (newValue) => {
 sonora.updateMapParams(selectedBuildingTypeIndex.value, newValue);
}, {
 deep: true,
 immediate: true
});

watch(() => i18n.global.locale, (newLang, oldLang) => {
 if (newLang !== oldLang) {
   fetchFilters();
 }
});

// filter options
async function fetchFilters() {
 const lang = i18n.global.locale;

 try {
   const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/filter1.php?lang=${lang}`);
   if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   if (data) {
     buildingTypes.value = data.Building;
   }
 } catch (error) {
   console.error('Error fetching time periods:', error);
 }
}

// selection of buttons
function selectCategory(type, index) {
  if (type === 'building') {
    if (selectedBuildingTypeIndex.value === index) {
      // If active, reset to 'All Buildings'
      selectedBuildingTypeIndex.value = 0;
      sonora.updateMapParams(0, selectedRange.value);
    } else {
      selectedBuildingTypeIndex.value = index;
      sonora.updateMapParams(selectedBuildingTypeIndex.value, selectedRange.value);
    }
  }
}

//fetch places
const fetchPlaces = _debounce(async (query) => {
 let apiUrl;
 if (searchType.value === 'places') {
   // If query is empty, fetch all places
   apiUrl = query
     ? `https://orgeldatabas.gu.se/webgoart/goart/searchpl.php?seastr=${encodeURIComponent(query)}&btype=0&year1=1500&year2=1899&lang=sv`
     : 'https://orgeldatabas.gu.se/webgoart/goart/searchpl.php?seastr=&btype=0&year1=1500&year2=1899&lang=sv';
 }

 try {
   const response = await fetch(apiUrl);
   const data = await response.json();
   searchResults.value = data ? data : [];
 } catch (error) {
   console.error('Error fetching search results:', error);
   searchResults.value = [];
 }
}, 500);

//fetch builders
async function fetchBuilders() {
 const apiUrl = `https://orgeldatabas.gu.se/webgoart/goart/searchbuilder.php?seastr=${encodeURIComponent(searchQuery.value)}&lang=sv`;
 try {
   const response = await fetch(apiUrl);
   if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
   }
   const data = await response.json();
   searchResults.value = data;
 } catch (error) {
   console.error('Error fetching builders:', error);
   searchResults.value = [];
 }
}

//used to toggle between which search is used
const handleSearch = () => {
 if (searchType.value === 'builders') {
   fetchBuilders();
 } else if (searchType.value === 'places') {
   // Call fetchPlaces with empty query if searchQuery is empty
   fetchPlaces(searchQuery.value);
 }
};

const onPlaceClick = (feature) => {
 const coordinates = feature.geometry.coordinates;
 const transformedCoordinates = fromLonLat(coordinates);
 if (store.zoom < featureZoom) {          
   store.updateZoom(featureZoom);
 }
 store.updateCenter(transformedCoordinates);

 // Reset building type to 'All'
 selectedBuildingTypeIndex.value = 0;

 // Reset the date range to default
 if (rangeSliderRef.value) {
   rangeSliderRef.value.resetSlider();
 }

 feature.get = (key) => feature.properties[key];
 selectedFeature.value = feature;

 placeClicked.value = true;
};

// const toggleAboutVisibility = async () => {
//   await nextTick();
//   visibleAbout.value = !visibleAbout.value;
// };

defineExpose({
 searchInput
});
</script>

<style>
.slider-tooltip {
 background: rgb(180, 100, 100);
 border: none;
}

.slider-connect {
 background: rgb(180, 100, 100);
}

.category-button {
 background-color: white;
 color: rgb(71, 85, 105);
 border-radius: 4px;
 margin-right: 5px;
 margin-bottom: 5px;
}

.category-button:hover {
 background-color: #096058;
 color: white;
}

.category-button.active {
 background-color: #0d9488;
 color: white;
}

.search-result-item {
 font-weight: normal; /* Remove styling from anchor links */
 display: block;
 color: inherit; 
 text-decoration: none; 
}

.toggle-buttons button {
 padding: 2px 12px;
 background-color: rgba(255, 255, 255, 0.3);
 cursor: pointer;
 margin-bottom: 0px;
 color: rgb(80,80,80);
}

.toggle-buttons button.active {
 background-color: rgba(255, 255, 255, 0.6);
}

.search-section {
 position: relative;
}

.search-box {
 width: 100%;
 height: 50px;
 padding: 8px;
 border: 0px solid #ccc;
 border-radius: 0px 4px 4px;
 overflow:hidden;
 background-color:rgba(255,255,255,0.6);
 box-shadow: 
   0 -5px 5px -5px rgba(0, 0, 0, 0.2);
 /* focus:none; */
}

div.search-section > input::placeholder {
 color: rgb(80,80,80);
}

.search-box:focus {
 outline: none;
}

.search-results {
 width: 100%;
 background-color:rgba(255,255,255,1.0);
 border: 0px solid #ccc;
 border-top: none;
 border-radius:0px 0px 8px 8px;
 margin-top:-4px;
 z-index: 1000;
 max-height: 120px;
 overflow-y: auto;
 transition: all 0.4s;
}

/* .search-results {
 position: absolute;
 width: 100%;
 background-color:rgba(255,255,255,1.0);
 border: 0px solid #ccc;
 border-top: none;
 border-radius:0px 0px 8px 8px;
 margin-top:-4px;
 z-index: 1000;
 max-height: 120px;
 overflow-y: auto;
} */

@media screen and (max-height: 850px) {
 .data-widget-counter {
   display: none !important;
 }
}

@media screen and (max-width: 900px) {
 .data-widget-counter {
   display: block !important;
   color:black!important;
 }

 .data-widget-counter p {
   color:var(--theme-5)!important;
 }

 .section-title {
color:black!important;
}
}

@media screen and (min-height: 950px) {
 .search-results {
 max-height: calc(30vh - 100px);
}
}

/* @media screen and (min-height: 950px) {
 .search-results {
 max-height: 230px;
}
}

@media screen and (min-height: 1000px) {
 .search-results {
 max-height: 280px;
}
}

@media screen and (min-height: 1050px) {
 .search-results {
 max-height: 330px;
}
}

@media screen and (min-height: 1100px) {
 .search-results {
 max-height: 380px;
}
} */

.search-result-item {
 padding: 8px;
 border-bottom: 1px solid #eee;
 cursor: pointer;
 background-color:rgba(255,255,255,1.0)!important;
}

.search-result-item:hover {
 background-color:rgba(240,240,240,1.0)!important;
}

#app .section-title {
 margin-top:10px;
 margin-bottom:3px;
 color:white;
}

#app .tag-section {
 margin-top:0px;
}


#app .category-button {
 background-color: rgba(255, 255, 255, 0.6);
 color: rgb(71, 85, 105);
 border-radius: 4px;
}

#app .category-button:hover {
 background-color: rgb(140, 80, 80);
 color: white;
}

#app .category-button.active {
 background-color: rgb(180, 100, 100);
 color: white;
}

#app .start-end-box {
 width: 15%;
 font-size: 20px;
 text-align: center;
 padding-top: 0rem;
 padding-bottom: 0.5rem;
}

#app .rounded {
 border-radius: 10px;
}

#app .broad-controls {
 width: 100%;

}

@media screen and (max-width: 900px) {
 #app .broad-controls {
   width: 100%;

 }
}

.slide-leave-active {
 transition: all 0.4s;
 opacity: 1.0;
}

.slide-leave-to {
 opacity: 0.5;
}

.slideinactive {
 opacity: 0.4;
 pointer-events: none !important;
 transition: all 0.4s;
}

.slideactive {
 transition: all 0.4s;
 opacity: 1.0;
}


#app .range-slider-container {
 display: flex;
 width: 100%;
 height: auto;
 align-items: bottom;
 padding: 60px 0 15px 0;
 background-color: rgba(255, 255, 255, 0.6);
 backdrop-filter: blur(3px);
 margin-top:0px;
}

#app .range-slider-wrapper {
 padding-left: 27px;
 padding-right: 28px;
}

#app .start-end-box {
 display:none;
 width: 15%;
 font-size: 18px;
 text-align: center;
 padding-top: 0rem;
 padding-bottom: 0.5rem;
}

#app .rounded {
 border-radius: 8px;
}

#app .slider-connect {
 background-color: rgb(180,100,100);
}

#app .slider-connects {
 background-color: rgb(180,180,180);
}

#app .slider-tooltip {
 background-color: rgb(180,100,100);
 border: 1px solid var(--slider-tooltip-bg, rgb(180,100,100));
 font-size: 18px;
 font-weight:400;
}

#app .slider-handle {
 margin-top: -10px;
 margin-left: 10px;
 width: 0;
 height: 0;
 border-radius: 0px;
 background: none;
 border-left: 8px solid transparent;
 border-right: 8px solid transparent;
 border-top: 15px solid rgb(180,100,100);
 box-shadow: var(--slider-handle-shadow, 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0));
 cursor: grab;
}


.data-widget {
 float:left;
 pointer-events: none;
 width: 100%;
 margin-top: 10px;
 margin-bottom: 20px;
 padding: 15px 25px;
 border-radius: 8px;
 background-color: rgba(255, 255, 255, 0.6);
 min-height: 50px;
 backdrop-filter: blur(5px);
}

.data-widget-counter {
 width: 50%;
 color:white;
 max-width: 600px; 
 margin:10px auto;
 padding: 0.5rem;
 border-radius: 8px;
 background-color: rgba(255, 255, 255, 0.0);
 backdrop-filter: blur(5px);
 height: auto; 
 display: flex; 
 justify-content: center; 
 align-items: center; 
 box-shadow: 0 2px 4px rgba(0,0,0,0.0); 
 font-size:1.1em;
}

.data-widget-section {
 width:100%;
 display: flex;
 flex-direction: row;
 justify-content: center;
}

.data-widget-divider {
 margin-top:10px;
 margin-bottom:10px;
 margin-left:-25px;
 width: calc(100% + 50px);
 border-style: dotted;
 border-color: rgb(180, 100, 100);
 border-width: 1px 0px 0px 0px;
 height: 1px;
}


.data-widget-item {

}

.data-widget-item h3 {
 display: inline;
}

.data-widget-item p {
 display: inline;
 color: var(--theme-6);
 margin-left: 3px;
 font-weight:500;
}

button:disabled {
 opacity: 0.5;
}

.selected-builder {
  background-color: var(--theme-3) !important;
  color: white;
}

.selected-builder:hover {
  background-color: var(--theme-3) !important;
  color: white;
}
</style>
