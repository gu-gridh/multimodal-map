<template>
    <!-- Checks if all points are loaded and only then show the controls -->
  <div :class="{ 'non-interactive': !areMapPointsLoaded }">
    <div v-if="areMapPointsLoaded">

      <!-- This creates a 2-column section with for the controls -->
      <div class="control-organisation justify-left">

        <!-- <div class="tag-section">
          <div class="section-title">{{ $t('dataset') }}</div>
          <div style="display:inline; float:left; margin-right:0px;">
            <select title="pick what dataset you want to view data from" class="dropdown theme-color-background my-2">
              <option title="View data from all datasets" value="All datasets">{{ $t('alldatasets') }}</option>
              <option title="View data from the San Giovenale dataset by Fredrik Tobin-Dodd" value="CTSG-2015">CTSG-2015</option>
            </select>
          </div>
        </div> -->

        <div class="tag-section margin-3">
          <div class="section-title">Dataset</div>
          <div title="Narrow the result to a certain dataset" class="broad-controls">
             <CategoryButtonDropdown v-model="dataSetValue" :categories="DATASET" :limit="1" styleType="dropdown" class="my-2"
              type="datasets" />
          </div>
        </div>

        <div class="tag-section margin-20">
          <div class="section-title">{{ $t('typeofdata') }}</div>
          <div class="broad-controls">
            <CategoryButtonList v-model="categories" 
                :categories="{
                  all: $t('categories.all'), 
                  plans: $t('categories.drawings'), 
                  models: $t('categories.models')
                }" 
                :limit="1" 
                class="my-2"
                title="Pick a data type" 
                @click="handleCategoryClick" />
          </div>
        </div>

      </div>

      <div class="tag-section margin-3">
        <div class="section-title">{{ $t('timeperiod') }}</div>
        <div class="slider-widget">
          <div class="slider-section">
              <RangeSlider
                ref="rangeSliderRef"
                v-model="selectedRange"
                :min="1"
                :max="3"
                :step="1"
                class="my-2"
                :isSliderVisible="true"
                :startLabel="startLabel"
                :endLabel="endLabel"
              />
          </div>
        </div>
      </div>

      <!-- This creates a 2-column section width for the controls -->
      <div class="control-organisation justify-space">
        <div class="tag-section">
          <div class="section-title">Site</div>
          <div style="display:inline; float:left; margin-right:0px;">
            <select title="pick what dataset you want to view data from" class="dropdown theme-color-background my-2">
              <option title="View data from all datasets" value="All datasets">All</option>
              <option title="View data from San Giovenale" value="CTSG-2015">San Giovenale</option>
              <option title="View data from San Giuliano" value="CTSG-2015">San Giuliano</option>
              <option title="View data from Blera" value="CTSG-2015">Blera</option>
              <option title="View data from Luni" value="CTSG-2015">Luni</option>
            </select>
          </div>
        </div>

        <div class="tag-section margin-5">
          <div class="section-title">{{ $t('necropolisname') }}</div>
          <div title="Narrow the result to a certain necropolis" class="broad-controls">
            <CategoryButtonDropdown v-model="necropoli" :categories="NECROPOLI" :limit="1" styleType="dropdown" class="my-2"
              type="necropolis" @click="handleSelectionClick($event, currentTombType)" />
          </div>
        </div>

        <div class="tag-section margin-5">
          <div  class="section-title">{{ $t('tombtype') }}</div>
          <div title="Narrow the result to a certain tomb type" class="broad-controls">
            <CategoryButtonDropdown v-model="tombType" :categories="TOMBTYPE" :limit="1" styleType="dropdown" class="my-2"
              type="tombType" />
          </div>
        </div>
      </div>
    </div>

    <!-- if the markers are not loaded show the loader -->
    <div v-else>
      <div alt="Loading..." class="loading-svg" />
    </div>
  </div>

  <!-- Data Section -->
  <div class="data-widget">
    <div class="data-widget-section">
      <div class="data-widget-item">
        <h3>{{ $t('tombshown') }}:</h3>
        <p>{{ currentTombCount }}</p>
      </div>
      <div class="data-widget-item">|</div>
      <div class="data-widget-item">
        <h3>{{ $t('tombshidden') }}:</h3>
        <p>{{ hiddenTombs }}</p>
      </div>
    </div>

    <div class="data-widget-divider"></div>

    <div class="data-widget-section">
      <div class="data-widget-item">
        <h3>{{ $t('photographs') }}:</h3>
        <p>{{ totalPhotographs }}</p>
      </div>
      <div class="data-widget-item">
        <h3>{{ $t('drawings') }}:</h3>
        <p>{{ totalPlans }}</p>
      </div>
      <div class="data-widget-item">
        <h3>{{ $t('threedmodels') }}:</h3>
        <p>{{ totalThreed }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, computed, defineProps, watch } from "vue";
import CategoryButtonDropdown from "./CategoryButtonDropdown.vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "./EtruscanRangeSlider.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import type { EtruscanProject, RangeMapping } from "./types";
import { DianaClient } from "@/assets/diana";
import { transform } from 'ol/proj';
import apiConfig from "./apiConfig"
import { nextTick } from 'vue';

const config = inject<EtruscanProject>("config");
const dianaClient = new DianaClient("etruscantombs"); // Initialize DianaClient
const { categories, selectedRange, tags, necropoli, tombType, dataSetValue, dataParams, selectedNecropolisCoordinates, enable3D, enablePlan, areMapPointsLoaded } = storeToRefs(etruscanStore());
// Create a ref for last clicked category
const lastClickedCategory = ref('');

//initialize variables for data section
const totalPhotographs = ref(0);
const totalPlans = ref(0);
const totalThreed = ref(0);
const hiddenTombs = ref(0);
const currentTombCount = ref(0);
const visibleAbout = ref(false);

const rangeMapping: RangeMapping = {
  1: { range: '700-650 BC', id: 5 },
  2: { range: '625-400 BC', id: 6 },
  3: { range: '400-200 BC', id: 7 },
};

const startLabel = computed(() => {
  return rangeMapping[selectedRange.value[0]].range;
});

const endLabel = computed(() => {
  return rangeMapping[selectedRange.value[1]].range;
});

const selectedRangeIds = computed(() => {
  return [rangeMapping[selectedRange.value[0]].id, rangeMapping[selectedRange.value[1]].id];
});


const TAGS = ref<Record<string, string>>({});
const NECROPOLI = ref<Record<string, string>>({});
const TOMBTYPE = ref<Record<string, string>>({});
const DATASET = ref<Record<string, string>>({});
//const currentTag = ref(null);
// const currentNecropolis = ref(null);
const currentTombType = ref(null);
//const dataset = ref([]);

const baseURL = `${apiConfig.PLACE}?page_size=500`;

onMounted(async () => {
  await fetchDataAndPopulateRef("epoch", TAGS);
  await fetchDataAndPopulateRef("necropolis", NECROPOLI);
  await fetchDataAndPopulateRef("typeoftomb", TOMBTYPE);
  await fetchDataAndPopulateRef("epoch", DATASET); //use to populate the dataset

  //const response = await fetch(baseURL);
  //const data = await response.json();
});

const NECROPOLICoordinates = ref<Record<string, [number, number]>>({});

async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any) {
  try {
    const data = await dianaClient.listAll<T>(type);
    //var i = 1;
      
    data.forEach((result: any) => {
      if (result.published) {
        refToPopulate.value[result.id] = result.text;

        // If the type is necropolis, store its coordinates
        if (type === "necropolis" && result.geometry && result.geometry.coordinates) {
          NECROPOLICoordinates.value[result.id] = result.geometry.coordinates;
        }
        //i++;
      }
    });
  } catch (error) {
    console.error(`Error fetching data for type ${type}:`, error);
  }
}

const handleCategoryClick = (category: string) => {
  // If the clicked category is the same as the last clicked one, default to "all"
  if (lastClickedCategory.value === category) {
    categories.value = ["all"];

    // Clear the lastClickedCategory since it was unselected
    lastClickedCategory.value = '';
    if (category === 'models') {
      enable3D.value = !enable3D.value;  // Toggle between true and false
    } else {
      enable3D.value = false;
    }
    if (category === 'plans') {
      enablePlan.value = !enablePlan.value;  // Toggle between true and false
    } else {
      enablePlan.value = false;
    }
  } else {
    // Add the clicked category only if it's not the same as the last clicked one
    categories.value = [category];

    // Update last clicked category
    lastClickedCategory.value = category;
    enable3D.value = (category === 'models');
    enablePlan.value = (category === 'plans');
  }
};

//Fetch to return count of each type based on the tagParams
const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch data: ${response.status}`);
    return;
  }

  const data = await response.json();
  currentTombCount.value = data.shown_tombs;
  totalPhotographs.value = data.photographs;
  totalPlans.value = data.drawing;
  hiddenTombs.value = data.hidden_tombs;
  totalThreed.value = data.objects_3d; 
};

watch(
  () => dataParams.value,
  async (newTagParams, oldTagParams) => {
  const queryParams = new URLSearchParams(Object.fromEntries(Object.entries(newTagParams).map(([k, v]) => [k, String(v)])));
  const urlWithParams = `https://diana.dh.gu.se/api/etruscantombs/info/tombs/?${queryParams.toString()}`;
   await fetchData(urlWithParams);
  },
  { immediate: true }
);

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

function handleSelectionClick(selectedValue: any, targetRef: any) {
  clearAll();
  const selectedCoordinates = NECROPOLICoordinates.value[selectedValue];
  if (selectedCoordinates) {
    const [x, y] = selectedCoordinates;

    const convertedCoordinates = transform([x, y], 'EPSG:4326', 'EPSG:3857');
    if (Array.isArray(convertedCoordinates) && convertedCoordinates.length === 2) {
        selectedNecropolisCoordinates.value = convertedCoordinates as [number, number];
    } else {
        console.error("Invalid coordinate format after transformation.");
    }

  }
}

function clearAll() {
  categories.value = ["all"];
  enablePlan.value = false;
  enable3D.value = false;
  tombType.value = ["all"];
  lastClickedCategory.value = '';
  tags.value = [];
}

</script>

<style>
.loading-svg {
  width: 100%;
  height: 200px;
  background: url("/90-ring-with-bg.svg");
  background-size: 60px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  display: block;
  margin: auto;
  transition: all 0.4s;

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

#app .slider-section {
  width: 100%;
}

#app .range-slider-container {
  display: flex;
  width: 100%;
  height: auto;
  align-items: bottom;
  padding: 10px 0 0px 0;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
  margin-top:5px;
}

#app .slider-connect {
  background-color: rgb(180,100,100);
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
  font-size: 13px;
  text-align: center;
  padding-top: 0rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem; 
  padding-right: 0.5rem; 
}

#app .rounded {
  border-radius: 10px;
}

#app .broad-controls {
  width: 100%;

}

#app .control-organisation{
  width:98%; 
  float:left; 
  display:flex; 
  flex-direction:row; 
  margin-top:10px;
}

.justify-left{
  justify-content:left;
}

.justify-space{
  justify-content:space-between;
}

.margin-20 {
margin-left:20px;
}

.margin-5 {
margin-left:5px;
}

.data-widget {
  font-size:110%;
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

.slider-widget {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size:110%;
  float: left;
  width: 98%;
  border-radius: 10px;
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


.data-widget-item {}

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
  #app .control-organisation{
  width:98%; 
  float:none; 
  display:flex; 
  flex-direction:column; 
  margin-top:10px;
}

.justify-space{
  justify-content:left;
}

  #app .tag-section {
 font-size:100%;
}

.margin-20 {
margin-left:0px;
}

.margin-5 {
margin-left:0px;
}

.data-widget {
display:none;
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

 div.slider-widget > label > input
 {
  width: 17px;
  height: 17px;
 }

</style>
