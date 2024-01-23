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
      <input type="text" placeholder="Search in Archive" class="archive-search-box"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';

const searchQuery = ref('');
const filters = ref({});
const selectedFilters = ref({});

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
  left: 55%;
  transform: translateX(-50%);
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
  top: 20%;
  padding: 20px;
  border-radius: 8px;
  left: 55%;
  transform: translateX(-50%);
  width: 90vw;
  max-width: 800px; 
}

.archive-search-box {
  width: 100%; 
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

@media (max-width: 900px) {
  .filters-container {
    left: 60%;
    right: auto;
    transform: translateX(-50%);
    width: 80vw;
  }

  .archive-content {
    left: 52%;
    right: auto;
    transform: translateX(-50%);
    width: 80vw;
    margin-top: 100px;
  }

  .filter-dropdown select, .archive-search-box {
    max-width: none;
  }
}
</style>