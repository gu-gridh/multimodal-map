<template>
  <div class="map-view-archive-overlay">
     <div class="filters-container">
      <div v-for="(options, category) in filters" :key="category" class="filter-dropdown">
        <select :id="category" v-model="selectedFilters[category]" class="archive-search-box">
          <option disabled value="">{{ category }}</option>
          <option v-for="(label, value) in options" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </div>
    </div>
      <div class="archive-content">
      <input type="text" 
            placeholder="Search in Archive" 
            class="archive-search-box"
            v-model="searchQuery"
            @input="handleSearch" />
        <div class="archive-search-results">
          <router-link v-for="doc in searchResults" 
                      :key="doc.Dokument_nr" 
                      :to="`/detail/image/${doc.Dokument_nr}`" 
                      class="search-result-item">
            {{ doc.Titel }}
          </router-link>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, onMounted, watch } from 'vue';
import _debounce from 'lodash/debounce';

const searchQuery = ref('');
const searchResults = ref([]);

const filters = ref({});
const selectedFilters = ref({});

const fetchSearchResults = _debounce(async () => {
  try {
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/searchdoc.php?seastr=${encodeURIComponent(searchQuery.value)}&archive=48&lang=sv`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    searchResults.value = Object.values(data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    searchResults.value = [];
  }
}, 500);

watch(searchQuery, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    fetchSearchResults();
  }
});

onMounted(async () => {
  try {
    const response = await fetch('https://orgeldatabas.gu.se/webgoart/goart/filter.php');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Assign only the "Archive" part of the response to filters
    if (data.Archive) {
      filters.value = { "Archive": data.Archive };
    }
    initializeSelectedFilters();
  } catch (error) {
    console.error('Error fetching filters:', error);
  }
});

function initializeSelectedFilters() {
  if (filters.value.Archive) {
    selectedFilters.value["Archive"] = '';
  }
}
</script>

<style>
.map-view-archive-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10; 
}

.filters-container {
  position: absolute;
  top: 10%;
  margin-left: calc(200px);

  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
  max-width: 90vw;
}

.filter-dropdown select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
}

.archive-content {
  position: absolute;
  top: 150px;
  padding: 0px;
  border-radius: 8px;
  margin-left: calc(200px);
  width: 600px;
}

.archive-search-box {
  width: 100%; 
  padding: 8px;
  margin-bottom: 0px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.archive-search-results {
  position: absolute;
  width: 100%;
  background-color:rgba(255,255,255,1.0);
  border: 0px solid #ccc;
  border-top: none;
  border-radius:0px 0px 8px 8px;
  margin-top:-4px;
  z-index: 1000;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.search-result-item {
  background-color: white;
}

@media (max-width: 900px) {
  .filters-container {
    left: 47%;
    right: auto;
    transform: translateX(-50%);
    width: 80vw;
  }

  .archive-content {
    left: 22%;
    right: auto;
    transform: translateX(-50%);
    width: 80vw;
    margin-top: 40px;
  }

  .filter-dropdown select, .archive-search-box {
    max-width: none;
  }
}
</style>