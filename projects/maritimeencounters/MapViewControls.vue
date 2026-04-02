<template>
  <!-- Compare Mode Toggle -->
  <div class="compare-toggle-section">
    <label class="compare-toggle-label">
      <input type="checkbox" v-model="compareMode" class="compare-toggle-checkbox" />
      <span class="compare-toggle-text">Compare Resources</span>
    </label>
  </div>

  <!-- Normal mode: single data type dropdown -->
  <div v-if="!compareMode" class="control-organisation justify-space">
    <div class="tag-section ">
      <div class="section-title">Type of Data</div>
      <div class="broad-controls" style="width:120px">
        <CategoryButtonDropdown v-model="dataType"
          :categories="resourceCategories" 
          :limit="1" styleType="dropdown" class="my-2" type="site" style="width:100%" />
      </div>
    </div>
  </div>

  <!-- Compare mode: multi-select checkboxes -->
  <div v-else class="compare-section">
    <div class="section-title">Select 2+ Resource Types to Compare</div>
    <div class="compare-checklist">
      <label v-for="(label, key) in resourceCategories" :key="key" class="compare-check-item">
        <input type="checkbox" :value="key" v-model="compareTypes" class="compare-checkbox" />
        <span class="compare-check-label">{{ label }}</span>
      </label>
    </div>
    <div v-if="compareTypes.length >= 2" class="compare-info">
      Showing sites with <strong>all {{ compareTypes.length }}</strong> selected resource types
    </div>
    <div v-else class="compare-info compare-info-hint">
      Select at least 2 resource types to find common sites
    </div>
    <!-- Cluster radius slider -->
    <div v-if="compareTypes.length >= 2" class="cluster-radius-section">
      <div class="section-title">Area Highlight Radius: {{ clusterRadius }} km</div>
      <input type="range" v-model.number="clusterRadius" :min="10" :max="200" :step="10" class="cluster-slider" />
    </div>
  </div>

  <div class="tag-section margin-3">
    <div class="slider-widget">
      <div class="slider-section">
        <RangeSlider ref="rangeSliderRef" v-model="selectedRange" :min="-2450" :max="50" :step="1" class="my-2"
          :isSliderVisible="true" />
      </div>
    </div>
  </div>

  <!-- Data Section -->
  <div class="data-widget">
    <div class="data-widget-section" v-if="!compareMode">
      <div class="data-widget-item">
        <h3>Sites Available:</h3>
        <p>{{ count }}</p>
      </div>
      <div class="data-widget-item">|</div>
      <div class="data-widget-item">
        <h3>Points Hidden:</h3>
        <p>{{ pointsHidden }}</p>
      </div>
    </div>
    <div class="data-widget-section" v-else>
      <div class="data-widget-item">
        <h3>Common Sites:</h3>
        <p>{{ commonSitesCount }}</p>
      </div>
    </div>
  </div>
  <div style="display:flex; flex-direction: row; justify-content:center; width:100%;">
    <div id="resetfilters" class="broad-controls theme-button category-button"
      style="margin-top:15px; width:auto; cursor:pointer; transition: all 0.2s ease-in-out; background-color:var(--theme-3); color:white;"
      v-if="isFilterModified" @click="clearAll">
      Reset
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, watch } from "vue";
import CategoryButtonDropdown from "./CategoryButtonDropdown.vue";
import RangeSlider from "./RangeSliderMaritime.vue";
import { storeToRefs } from "pinia";
import { maritimeencountersStore } from "./store";
import API_ENDPOINTS from "./apiConfig";

const config = inject("config");
const store = maritimeencountersStore();
const { selectedRange, dataType, imgParams, compareMode, compareTypes, commonSitesData, clusterRadius } = storeToRefs(store);
const count = ref(0);
const initialCount = ref(0);

const resourceCategories = {
  'radiocarbon_dates': 'Radiocarbon Dates',
  'individual_samples': 'Individual Samples',
  'dna_samples': 'DNA Samples',
  'metal_analysis': 'Metal Analysis',
  'landing_points': 'Landing Points',
  'new_samples': 'New Samples',
  'lnhouses': 'Late Neolithic Houses',
  'boats': 'Boats',
};

const commonSitesCount = computed(() => {
  if (!commonSitesData.value || !commonSitesData.value.features) return 0;
  return commonSitesData.value.features.length;
});

const isFilterModified = computed(() => {
  if (compareMode.value) {
    return compareTypes.value.length > 0 ||
      selectedRange.value[0] !== -2450 || selectedRange.value[1] !== 50;
  }
  return (
    dataType.value[0] !== "all" ||
    selectedRange.value[0] !== -2450 || selectedRange.value[1] !== 50
  );
});

const waitForAuthToken = () => {
  return new Promise((resolve) => {
    const checkToken = () => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        resolve(token);
      } else {
        setTimeout(checkToken, 100);
      }
    };
    checkToken();
  });
};

watch(
  imgParams,
  async (newParams) => {
    if (compareMode.value) return; // Skip count fetch in compare mode
    try {
      const token = await waitForAuthToken();

      const response = await fetch(
        `${API_ENDPOINTS.SEARCH}?page_size=500&${new URLSearchParams(newParams)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const data = await response.json();
      if (initialCount.value === 0) {
        initialCount.value = data.count;
      }
      count.value = data.count;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  { immediate: true }
);

const pointsHidden = computed(() => initialCount.value - count.value);

function clearAll() {
  dataType.value = ["all"];
  compareTypes.value = [];
  compareMode.value = false;
  selectedRange.value = [-2450, 50];
}
</script>

<style>
.loading-svg {
  width: 100%;
  height: 180px;
  background: url("/90-ring-with-bg.svg");
  background-size: 60px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  display: block;
  margin: auto;
  transition: all 0.4s;

}

#app .tag-section .broad-controls {
  font-size: 0.9em;
}

.loading-svg:hover {
  height: 240px;
  transform: scale(1.5);
}

.justify {
  display: flex;
  flex-direction: row;
  justify-content: left;
}

#app .section-title {
  margin-top: 6px;
  margin-bottom: -3px;
}

#app .tag-section {
  margin-top: -5px;
  margin-bottom: 0px;
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

#app .control-organisation {
  width: 98%;
  float: left;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.justify-left {
  justify-content: left;
}

.justify-space {
  justify-content: space-between;
}

.margin-20 {
  margin-left: 20px;
}

.margin-5 {
  margin-left: 5px;
}

.data-widget {
  font-size: 110%;
  float: left;
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.data-widget-divider {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: -25px;
  width: calc(100% + 50px);
  border-style: dotted;
  border-color: var(--theme-3);
  border-width: 1px 0px 0px 0px;
  height: 1px;
}

.data-widget-item h3 {
  display: inline;
}

.data-widget-item p {
  display: inline;
  color: var(--theme-3);
  margin-left: 3px;
  font-weight: 500;
}

@media screen and (max-width: 900px) {
  #app .broad-controls {
    width: 100%;

  }

  #app .control-organisation {
    width: 98%;
    float: none;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  .justify-space {
    justify-content: left;
  }

  #app .tag-section {
    font-size: 100%;
  }

  .margin-20 {
    margin-left: 0px;
  }

  .margin-5 {
    margin-left: 0px;
  }

  .data-widget {
    display: none;
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

.slider-widget {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 110%;
  float: left;
  width: 98%;
  border-radius: 10px;
  min-height: 50px;
  backdrop-filter: blur(5px);
}

#app .slider-section {
  width: 100%;
}

.slider-handle:focus  {
  --slider-handle-ring-color: var(--theme-4);
  --slider-handle-shadow: 0.5px 0.5px 2px 1px var(--theme-4);
}

/* Compare Mode Styles */
.compare-toggle-section {
  width: 98%;
  margin-top: 8px;
  margin-bottom: 2px;
}

.compare-toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9em;
  user-select: none;
}

.compare-toggle-checkbox {
  appearance: none;
  width: 36px;
  height: 20px;
  background: #ccc;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  flex-shrink: 0;
  margin-right: 8px;
}

.compare-toggle-checkbox:checked {
  background: var(--theme-3);
}

.compare-toggle-checkbox::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.compare-toggle-checkbox:checked::after {
  transform: translateX(16px);
}

.compare-toggle-text {
  font-weight: 500;
  color: var(--theme-3);
}

.compare-section {
  width: 98%;
  margin-top: 6px;
}

.compare-checklist {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
  max-height: 220px;
  overflow-y: auto;
}

.compare-check-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
  font-size: 0.85em;
}

.compare-check-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.compare-checkbox {
  accent-color: var(--theme-3);
  margin-right: 8px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.compare-check-label {
  user-select: none;
}

.compare-info {
  margin-top: 8px;
  font-size: 0.85em;
  color: var(--theme-3);
  padding: 6px 10px;
  background: rgba(106, 167, 197, 0.1);
  border-radius: 6px;
}

.compare-info-hint {
  color: #888;
  background: rgba(0, 0, 0, 0.04);
}

.cluster-radius-section {
  margin-top: 10px;
  width: 100%;
}

.cluster-slider {
  width: 100%;
  margin-top: 4px;
  accent-color: var(--theme-3);
}
</style>