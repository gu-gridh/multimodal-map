<template>
    <!-- Checks if all points are loaded and only then show the controls -->
      <!-- <div :class="{ 'non-interactive': !areMapPointsLoaded }"> -->
      <!-- <div v-if="areMapPointsLoaded"> -->

      <!-- This creates a 2-column section with for the controls -->
      <div class="control-organisation justify-left" style="margin-bottom:8px;">
        <div class="tag-section margin-3">
          <div class="section-title">Dataset</div>
          <div title="Narrow the result to a certain dataset" class="broad-controls">
             <CategoryButtonDropdown v-model="dataSetValue" :categories="DATASET" :limit="1" styleType="dropdown" class="my-2"
              type="datasets"/>
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

     <div class="tag-section margin-3" >
        <!-- <div class="section-title">{{ $t('timeperiod') }}</div> -->
        <div class="slider-widget">
          <div class="slider-section">
              <RangeSlider
                ref="rangeSliderRef"
                v-model="selectedRange"
                :min="-700"
                :max="-200"
                :step="1"
                class="my-2"
                :isSliderVisible="true"
              />
          </div>
        </div>
      </div>

      <!-- This creates a 2-column section width for the controls -->
      <div class="control-organisation justify-space">
        <div class="tag-section ">
          <div class="section-title">{{ $t('site') }}</div>
          <div class="broad-controls">
            <CategoryButtonDropdown v-model="selectedSite" :categories="SITES" :limit="1" styleType="dropdown" class="my-2"
            type="site"/>
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
    <!-- </div> -->

      <!-- if the markers are not loaded show the loader -->
      <!--  <div v-else>
        <div alt="Loading..." class="loading-svg" />
      </div> -->
    <!-- </div> -->

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
  <div style="display:flex; flex-direction: row; justify-content:center; width:100%;">
    <div
      id="resetfilters"
      class="broad-controls theme-button category-button"
      style="margin-top:15px; width:auto; cursor:pointer; transition: all 0.2s ease-in-out; background-color:var(--theme-4); color:white;"
      v-if="isFilterModified"
      @click="clearAll"
    >
      {{ $t('reset') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, watch } from "vue";
import CategoryButtonDropdown from "./CategoryButtonDropdown.vue";
import RangeSlider from "./RangeSlider.vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import type { EtruscanProject } from "./types";
import { DianaClient } from "@/assets/diana";
import { transform } from 'ol/proj';
import apiConfig from "./apiConfig"
import { nextTick } from 'vue';

const config = inject<EtruscanProject>("config");
const dianaClient = new DianaClient("etruscantombs"); // Initialize DianaClient
const { categories, selectedRange, tags, necropoli, tombType, dataSetValue, dataParams, selectedNecropolisCoordinates, enable3D, enablePlan, selectedSite, showUnknownRange } = storeToRefs(etruscanStore());
// Create a ref for last clicked category
const lastClickedCategory = ref('');

const isFilterModified = computed(() => {
  return (
    enablePlan.value !== false ||
    enable3D.value !== false ||
    tombType.value[0] !== "all" ||
    selectedSite.value[0] !== "all" ||
    showUnknownRange.value !== true ||
    dataSetValue.value[0] !== "all" ||
    lastClickedCategory.value !== '' ||
    necropoli.value[0] !== "all" ||
    selectedRange.value[0] !== -700 || selectedRange.value[1] !== -200
  );
});

//initialize variables for data section
const totalPhotographs = ref(0);
const totalPlans = ref(0);
const totalThreed = ref(0);
const hiddenTombs = ref(0);
const currentTombCount = ref(0);
const visibleAbout = ref(false);

const TAGS = ref<Record<string, string>>({});
const NECROPOLI = ref<Record<string, string>>({});
const TOMBTYPE = ref<Record<string, string>>({});
const DATASET = ref<Record<string, string>>({});
const SITES = ref<Record<string, string>>({});
const currentTombType = ref(null);

const baseURL = `${apiConfig.PLACE}?page_size=500`;

onMounted(async () => {
  await fetchDataAndPopulateRef("epoch", TAGS);
  await fetchDataAndPopulateRef("necropolis", NECROPOLI);
  await fetchDataAndPopulateRef("typeoftomb", TOMBTYPE);
  await fetchDataAndPopulateRef("dataset", DATASET); //use to populate the dataset
  await fetchDataAndPopulateRef("sites", SITES);
});

const NECROPOLICoordinates = ref<Record<string, [number, number]>>({});

async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any, params: Record<string, any> = {}) {
  try {
    const data = await dianaClient.listAll<T>(type, params);
    refToPopulate.value = {};

    data.forEach((result: any) => {
      if (result.published) {
        if (type === "dataset") {
          refToPopulate.value[result.id] = result.short_name;
        } else if (type === "necropolis" && result.geometry && result.geometry.coordinates) {
          refToPopulate.value[result.id] = result.text; 
          NECROPOLICoordinates.value[result.id] = result.geometry.coordinates;
        } else {
          refToPopulate.value[result.id] = result.text;
        }
      }
    });
  } catch (error) {
    console.error(`Error fetching data for type ${type}:`, error);
  }
}

watch(selectedSite, async (newValue) => { //fetch necropolis based on the selected site
  if (newValue && newValue.length > 0 && newValue[0] !== "all") {
    await fetchDataAndPopulateRef("necropolis", NECROPOLI, { site: newValue[0] });
    necropoli.value = ["all"];
  } else {
    await fetchDataAndPopulateRef("necropolis", NECROPOLI);
    necropoli.value = ["all"];
  }
});

const handleCategoryClick = (category: string) => {
  // If the clicked category is the same as the last clicked one, default to "all"
  if (lastClickedCategory.value === category) {
    categories.value = ["all"];

    // Clear the lastClickedCategory since it was unselected
    lastClickedCategory.value = '';
    if (category === 'models') {
      enable3D.value = !enable3D.value;  
    } else {
      enable3D.value = false;
    }
    if (category === 'plans') {
      enablePlan.value = !enablePlan.value;  
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
  necropoli.value = ["all"];
  enablePlan.value = false;
  enable3D.value = false;
  tombType.value = ["all"];
  selectedSite.value = ["all"];
  showUnknownRange.value = true;
  dataSetValue.value = ["all"];
  lastClickedCategory.value = '';
  selectedRange.value = [-700, -200]; //reset slider to the default range
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
font-size:0.9em;
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

#app .slider-section {
  width: 100%;
}
</style>
