<template>
  <div class="map-view-archive-overlay">
    <div class="filters-container">
      <select v-model="selectedArchive">
        <option value="0">All Archives</option>
        <option v-for="(option, id) in filters.Archive" :key="id" :value="id">
          {{ option }}
        </option>
      </select>
      <select v-model="selectedSeries">
        <option value="0">All Series</option>
        <option v-for="(label, value) in series" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
      <select v-model="selectedVolume">
        <option value="0">All Volumes</option>
        <option v-for="(label, id) in volumes" :key="id" :value="id">
          {{ label }}
        </option>
      </select>
    </div>

    <div class="archive-content">
      <input type="text" 
             placeholder="Search in Archive" 
             class="archive-search-box"
             v-model="searchQuery"
             @input="fetchSearchResults" />
      <div class="archive-search-results">
        <router-link v-for="doc in filteredSearchResults" 
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

import { ref, onMounted, watch, computed } from 'vue';
import _debounce from 'lodash/debounce';

const searchQuery = ref('');
const searchResults = ref([]);

const selectedArchive = ref('0');
const selectedSeries = ref('0');
const selectedVolume = ref('0'); 

const filters = ref({});
const series = ref({});
const volumes = ref({});

//remove the non docs from the search results
const filteredSearchResults = computed(() => {
  return searchResults.value.filter(doc => doc.hasOwnProperty('Dokument_nr'));
});

const fetchSearchResults = async () => {
  // Construct the base request URL
  const requestUrl = `https://orgeldatabas.gu.se/webgoart/goart/searchdoc.php?seastr=${encodeURIComponent(searchQuery.value)}&archive=${encodeURIComponent(selectedArchive.value)}&series=${encodeURIComponent(selectedSeries.value)}&volume=${encodeURIComponent(selectedVolume.value)}&lang=sv`;
  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Filter out the results to only include those with a "Dokument_nr"
    const filteredResults = Object.values(data).filter(doc => doc.hasOwnProperty('Dokument_nr'));

    if (Array.isArray(filteredResults) && filteredResults.length === 0) {
      // No data returned, reset series and volumes
      series.value = {};
      volumes.value = {};
      searchResults.value = [];
    } else {
        // Update series if the response is for an archive selection
        if (selectedSeries.value === '0' || Object.keys(data).some(key => data[key].hasOwnProperty('dropdownseries'))) {
          const newSeries = {};
          Object.entries(data).forEach(([id, { dropdownseries }]) => {
            if (dropdownseries) newSeries[dropdownseries] = dropdownseries;
          });
          series.value = newSeries;
        }

        // Update volumes if the response is for a series selection
        if (selectedSeries.value !== '0' && Object.keys(data).some(key => data[key].hasOwnProperty('dropdownvolume'))) {
          const newVolumes = {};
          Object.entries(data).forEach(([id, { dropdownvolume }]) => {
            if (dropdownvolume) newVolumes[dropdownvolume] = dropdownvolume;
          });
          volumes.value = newVolumes;
        }
      }
      searchResults.value = Object.values(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

watch(selectedArchive, () => {
  selectedSeries.value = '0';
  selectedVolume.value = '0'; 
  series.value = {'0': 'All Series'}; 
  volumes.value = {'0': 'All Volumes'}; 
  fetchSearchResults(); 
});

watch(selectedSeries, () => {
  selectedVolume.value = '0';
  volumes.value = {'0': 'All Volumes'}; 
  fetchSearchResults();
});

watch([searchQuery, selectedArchive, selectedVolume], fetchSearchResults, { deep: true });

onMounted(async () => {
  try {
    const response = await fetch('https://orgeldatabas.gu.se/webgoart/goart/filter.php');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    filters.value = { "Archive": data.Archive };
  } catch (error) {
    console.error('Error fetching filters:', error);
  }
});

</script>

<style>
.filters-container select {
  border-radius: 4px;
}

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
  backdrop-filter: blur(5px);
}

.filters-container {
  position: absolute;
  top: 100px;
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
  top: 170px;
  padding: 0px;
  border-radius: 8px;
  margin-left: calc(200px);
  width: 600px;
  transition: ease-in-out 0.2s;
}
@media (max-width: 1300px) {
.archive-content {
  width: 500px;
  margin-left: calc(500px);
}
}

@media (max-width: 1100px) {
.archive-content {
  width: 400px;
  margin-left: calc(400px);
}
}

.archive-search-box {
  width: 100%; 
  padding: 8px;
  margin-bottom: 0px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.4em;
}

.archive-search-box:focus {
  outline: none;
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
  max-height: calc(90vh - 285px);
  overflow-y: auto;
}

.search-result-item {
  background-color: white;
}

@media (max-width: 900px) {
  .filters-container {
    left: calc(50% - 310px);
    width: 300px;
  }

  .archive-content {
    left: 22%;
    right: auto;
    margin-left: calc(27vw);
    transform: translateX(-50%);
    width: 85vw;
    margin-top: 10px;
  }

  .archive-search-box {
  width: 100%; 
  padding: 8px;
  margin-bottom: 0px;
  border: 1px solid #ddd;
  border-radius: 8px;
  height:60px;
  font-size:1.8em;
}

.archive-search-results {
  margin-top:-8px;
  z-index: 1000;
  max-height: calc(100vh - 500px);
  font-size:1.3em;
}

  .filter-dropdown select, .archive-search-box {
    max-width: none;
  }
}
</style>