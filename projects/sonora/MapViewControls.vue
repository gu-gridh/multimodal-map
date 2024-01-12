<template>

<div class="tag-section">
    <div class="broad-controls" style="height:60px;">
    </div>
</div>
<div class="toggle-buttons">
  <button :class="{ active: searchType === 'places' }" @click="setSearchType('places')">Places</button>
  <button :class="{ active: searchType === 'docs' }" @click="setSearchType('docs')">Docs</button>
</div>
  <div class="search-section">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleSearch"
      :placeholder="searchType === 'places' ? 'Search Places...' : 'Search Docs...'"
      class="search-box"
    />
  <div class="search-results" v-if="searchResults.length">
    <div v-for="result in searchResults" :key="result.id" class="search-result-item">
    <template v-if="searchType === 'places'">
      {{ result.Name }}
    </template>          
    <template v-else> <!-- When searchType is 'docs' -->
      <router-link :to="`/detail/image/${result.Id}`">{{ result.Name }}</router-link>
    </template>
    </div>

  </div>
</div>


  <div style="width:98%; float:left; display:flex; flex-direction:row; justify-content:space-between;">
  <div class="tag-section" style="float:left;">
    <div class="section-title">Place</div>
    <div class="broad-controls">
        <CategoryButtonList 
          v-model="necropoli" 
          :categories="NECROPOLI" 
          :limit="1" 
          styleType="dropdown"
          class="my-2"
          type="necropolis"
          @click="handleSelectionClick($event, currentTombType)"
        />
    </div>
  </div>

  <div class="tag-section" style="float:left; margin-left:20px;">
    <div class="section-title">Dokument</div>
    <div class="broad-controls">
        <CategoryButtonList 
          v-model="tombType" 
          :categories="TOMBTYPE" 
          :limit="1" 
          styleType="dropdown"
          class="my-2"
          type="tombType"
        />
    </div>
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
import { inject, ref, onMounted, computed, defineProps, watch } from "vue";
import CategoryButtonList from "./CategoryButtonDropdown.vue";
import CategoryButton from "@/components/input/CategoryButtonList.vue";
// import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { sonoraStore } from "./store";
import type { SonoraProject } from "./types";
import { DianaClient } from "@/assets/diana";
import { transform } from 'ol/proj';
import _debounce from 'lodash/debounce';

const searchType = ref('places'); // Default to 'places' 
const searchQuery = ref('');
const searchResults = ref([]);
const config = inject<SonoraProject>("config");
const dianaClient = new DianaClient("sonora"); // Initialize DianaClient
const { categories, years, tags, necropoli, tombType, dataParams, selectedNecropolisCoordinates, enable3D } = storeToRefs(sonoraStore());

// const TAGS = ref<Record<string, string>>({});
const NECROPOLI = ref<Record<string, string>>({});
const TOMBTYPE = ref<Record<string, string>>({});

const setSearchType = (type: string) => {
  searchType.value = type;
  handleSearch(); // Re-trigger search when type changes
};

const debouncedSearch = _debounce(async (query) => {
    if (!query) {
    searchResults.value = []; // Clear results if query is empty
    return;
  }

let apiUrl;
  if (searchType.value === 'places') {
    apiUrl = `https://orgeldatabas.gu.se/webgoart/goart/searchpl.php?seastr=${encodeURIComponent(query)}&lang=sv`;
  } else { // 'docs'
    apiUrl = `https://orgeldatabas.gu.se/webgoart/goart/searchdoc.php?seastr=${encodeURIComponent(query)}&lang=sv&start=0&limit=20`;
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

const handleSearch = () => {
  debouncedSearch(searchQuery.value);
};

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

// function handleSelectionClick(selectedValue, targetRef) {
//   const selectedCoordinates = NECROPOLICoordinates.value[selectedValue];
//   if (selectedCoordinates) {
//     const [x, y] = selectedCoordinates;

//     // Convert them to Web Mercator (EPSG:3857)
//     const webMercatorCoordinates = transform([x, y], 'EPSG:4326', 'EPSG:3857');
    
//     // Update the selectedNecropolisCoordinates in the store
//     selectedNecropolisCoordinates.value = webMercatorCoordinates;
//   } else {
//     console.log("Coordinates for selected necropolis not found");
//   }
// }
</script>

<style>
.search-result-item a {
  font-weight: normal; /* Remove styling from anchor links */
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
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-results {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
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
  margin-bottom:-3px;
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
