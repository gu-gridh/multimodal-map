<template>
   <div class="control-organisation justify-space">
    <!-- Building Type Section -->
    <div class="tag-section">
      <div class="section-title">Building</div>
      <div class="broad-controls">
        <button
          v-for="(type, index) in buildingTypes"
          :key="index"
          :class="['p-0.5 px-2 clickable category-button', {'active': selectedBuildingTypeIndex === index}]"
          @click="selectCategory('building', index)"
          @dblclick="deselectCategory('building', index)"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Time Period Section -->
    <div class="tag-section">
            <div class="section-title">Time Period</div>

      <div class="broad-controls">
        <button
          v-for="(period, index) in timePeriods"
          :key="index"
          :class="['p-1 px-2 clickable category-button', {'active': selectedTimePeriodIndex === index}]"
          @click="selectCategory('time', index)"
          @dblclick="deselectCategory('time', index)"
        >
          {{ period }}
        </button>
      </div>
    </div>
  </div>

  <div class="toggle-buttons" style="margin-top: 50px">
    <button :class="{ active: searchType === 'places' }" @click="setSearchType('places')">Places</button>
    <button :class="{ active: searchType === 'builders' }" @click="setSearchType('builders')">Builders</button>
  </div>
  <div class="search-section">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleSearch"
      :placeholder="searchType === 'places' ? 'Search Places...' : 'Search Builders...'"
      class="search-box"
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
       class="search-result-item">
    {{ builder.Builder }}
  </div>
</template>
</div>
  </div>

  <!-- Data Section -->
  <!-- <div class="data-widget">
    <div class="data-widget-section">
      <div class="data-widget-item">
        <h3>Visade orglar:</h3>
        <p>{{ currentTombCount }}</p>
      </div>
      <div class="data-widget-item">|</div>
      <div class="data-widget-item">
        <h3>Gömde orglar:</h3>
        <p>{{ initialTombCount - currentTombCount }}</p>
      </div>
    </div>

    <div class="data-widget-divider"></div>

    <div class="data-widget-section">
      <div class="data-widget-item">
        <h3>Dokument:</h3>
        <p>{{ totalPhotographs }}</p>
      </div>
      <div class="data-widget-item">
        <h3>Ritningar:</h3>
        <p>{{ totalPlans }}</p>
      </div>
      <div class="data-widget-item">
        <h3>Inspelningar:</h3>
        <p>{{ totalThreedhop + totalPointcloud }}</p> 
      </div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
// @ts-nocheck
import { inject, ref, onMounted, computed, defineProps } from "vue";
import CategoryButtonList from "./CategoryButtonDropdown.vue";
import CategoryButton from "@/components/input/CategoryButtonList.vue";
import { storeToRefs } from "pinia";
import { fromLonLat } from "ol/proj";
import { mapStore } from "@/stores/store";
import { sonoraStore } from "./store";
import type { SonoraProject } from "./types";
import { DianaClient } from "@/assets/diana";
import { transform } from 'ol/proj';
import _debounce from 'lodash/debounce';

const store = mapStore();
const timePeriods = ref({}); // State to store time periods
const selectedTimePeriodIndex = ref(null); // State to track the selected time period index
const buildingTypes = ref({}); // State to store time periods
const selectedBuildingTypeIndex = ref(null); // State to track the selected building type index

const searchType = ref('places'); // Default to 'places' 
const searchQuery = ref('');
const searchResults = ref([]);
const config = inject<SonoraProject>("config");
const dianaClient = new DianaClient("sonora"); // Initialize DianaClient
const { categories, years, tags, necropoli, tombType, dataParams, selectedNecropolisCoordinates, enable3D } = storeToRefs(sonoraStore());

const setSearchType = (type: string) => {
  searchType.value = type;
  handleSearch();
};

const filteredPlaces = computed(() => {
  if (searchResults.value && searchResults.value.features) {
    return searchResults.value.features.filter(feature => feature.properties);
  }
  return [];
});

const objectToArray = (obj) => {
  return obj ? Object.keys(obj).map(key => obj[key]) : [];
};

onMounted(async () => {
  await fetchFilters();
});

// filter options
async function fetchFilters() {
  try {
    const response = await fetch('https://orgeldatabas.gu.se/webgoart/goart/filter.php');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.Period) {
      timePeriods.value = data.Period;
      buildingTypes.value = data.Building;
    }
  } catch (error) {
    console.error('Error fetching time periods:', error);
  }
}

// selection of buttons
function selectCategory(type, index) {
  if (type === 'building') {
    selectedBuildingTypeIndex.value = selectedBuildingTypeIndex.value === index ? null : index;
    console.log('Selected building type index:', selectedBuildingTypeIndex.value);
  } else if (type === 'time') {
    selectedTimePeriodIndex.value = selectedTimePeriodIndex.value === index ? null : index;
    console.log('Selected time period index:', selectedTimePeriodIndex.value);
  }
}

// deselection of buttons
function deselectCategory(type, index) {
  if (type === 'building' && selectedBuildingTypeIndex.value === index) {
    selectedBuildingTypeIndex.value = null;
    console.log('Deselected building type index:', index);
  } else if (type === 'time' && selectedTimePeriodIndex.value === index) {
    selectedTimePeriodIndex.value = null;
    console.log('Deselected time period index:', index);
  }
}

//fetch places
const fetchPlaces = _debounce(async (query) => {
    if (!query) {
    searchResults.value = []; // Clear results if query is empty
    return;
  }

let apiUrl;
  if (searchType.value === 'places') {
    apiUrl = `https://orgeldatabas.gu.se/webgoart/goart/searchpl.php?seastr=${encodeURIComponent(query)}&date=&btype=&lang=sv`;
  }
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    searchResults.value = data ? data : []; // Set to empty array if data is null
  } catch (error) {
    console.error('Error fetching search results:', error);
    searchResults.value = []; // Set to empty array in case of error
  }
}, 500); // 500 ms debounce time

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
  } else {
    fetchPlaces(searchQuery.value);
  }
};

const onPlaceClick = (feature) => {
  const coordinates = feature.geometry.coordinates;
  const transformedCoordinates = fromLonLat(coordinates);
  store.updateCenter(transformedCoordinates);
};

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};
</script>

<style>
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
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  color: rgb(71, 85, 105);
}

.toggle-buttons button.active {
  background-color: rgb(180, 100, 100);
  color: #ffffff;
}

.search-section {
  position: relative;
}

.search-box {
  width: 100%;
  height:40px;
  padding: 8px;
  border: 0px solid #ccc;
  border-radius: 4px;
  overflow:hidden;
}

.search-results {
  position: absolute;
  width: 100%;
  background: white;
  border: 0px solid #ccc;
  border-top: none;
  margin-top:-4px;
  z-index: 100;
}

.search-result-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: #f9f9f9;
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

/* #app .range-slider-container {
  display: flex;
  width: 100%;
  height: 90px;
  align-items: bottom;
  padding: 25px 0 0 0;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
} */

/* #app .range-slider-wrapper {
  padding-left: 5px;
  padding-right: 5px;
} */

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


.data-widget {
  float:left;
  pointer-events: none;
  width: 98%;
  margin-top: 10px;
  padding: 15px 25px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  min-height: 50px;
  backdrop-filter: blur(5px);
}

.data-widget-section {
  width:100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  color: rgb(180, 100, 100);
  margin-left: 3px;
  font-weight:500;
}


</style>
