<template>
  <div :class="{ 'non-interactive': !areMapPointsLoaded }">
  <div v-if="areMapPointsLoaded">
    <div class="section-title" style="">{{ $t('typeofdata') }}</div>
      <CategoryButton
        v-model="categories"
        :categories="CATEGORIES"
        :limit="1"
        class="my-2"
        @click="handleCategoryClick" 
      />

      <div class="tag-section">
        <div class="section-title">{{ $t('timeperiod') }}</div>
        <div class="broad-controls">
            <CategoryButtonList 
              v-model="tags" 
              :categories="TAGS" 
              :limit="1" 
              styleType="button"
              class="my-2"
            />
        </div>
      </div>

      <div style="width:98%; float:left; display:flex; flex-direction:row; justify-content:space-between;">
      <div class="tag-section" style="float:left;">
        <div class="section-title">{{ $t('necropolisname') }}</div>
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
        <div class="section-title">{{ $t('tombtype') }}</div>
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
  </div>

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
        <p>{{ initialTombCount - currentTombCount }}</p>
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
        <p>{{ totalThreedhop + totalPointcloud }}</p> 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { inject, ref, onMounted, computed, defineProps, watch } from "vue";
import CategoryButtonList from "./CategoryButtonDropdown.vue";
import CategoryButton from "@/components/input/CategoryButtonList.vue";
// import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import type { EtruscanProjectProject } from "./types";
import { DianaClient } from "@/assets/diana";
import { transform } from 'ol/proj';

const config = inject<EtruscanProject>("config");
const dianaClient = new DianaClient("etruscantombs"); // Initialize DianaClient
const { categories, years, tags, necropoli, tombType, dataParams, selectedNecropolisCoordinates, enable3D, enablePlan, areMapPointsLoaded } = storeToRefs(etruscanStore());
// Create a ref for last clicked category
const lastClickedCategory = ref('');

//initialize variables for data section
const totalPhotographs = ref(0);
const totalPlans = ref(0);
const totalThreedhop = ref(0);
const totalPointcloud = ref(0);
const initialTombCount = ref(289);
const currentTombCount = ref(0);

const CATEGORIES = {
  all: "All data",
  plans: "Drawings",
  models: "3D models",
  
};

const TAGS = ref<Record<string, string>>({});
const NECROPOLI = ref<Record<string, string>>({});
const TOMBTYPE = ref<Record<string, string>>({});
const currentTag = ref(null);
const currentNecropolis = ref(null);
const currentTombType = ref(null);

const YEARS = {
  MIN: config?.timeRange?.[0] || 0,
  MAX: config?.timeRange?.[1] || new Date().getFullYear(),
};

onMounted(async () => { 
  await fetchDataAndPopulateRef("epoch", TAGS);
  await fetchDataAndPopulateRef("necropolis", NECROPOLI);
  await fetchDataAndPopulateRef("typeoftomb", TOMBTYPE);

  const url = `https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page_size=500`;
  const response = await fetch(url);
  const data = await response.json();
  initialTombCount.value = data.count //set total tombcount
});

const NECROPOLICoordinates = ref<Record<string, [number, number]>>({});

async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any) {
  try {
    const data = await dianaClient.listAll<T>(type);
    data.forEach((result: any) => {
      if (result.published) {
        refToPopulate.value[result.id] = result.text;
        
        // If the type is necropolis, store its coordinates
        if (type === "necropolis" && result.geometry && result.geometry.coordinates) {
          NECROPOLICoordinates.value[result.id] = result.geometry.coordinates;
        }
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
  const { count, features } = data;

  currentTombCount.value = count;
  totalPhotographs.value = 0;
  totalPlans.value = 0;
  totalThreedhop.value = 0;
  totalPointcloud.value = 0;

  for (const feature of features) {
    const {
      photographs_count,
      plans_count,
      threedhop_count,
      pointcloud_count
    } = feature.properties;

    totalPhotographs.value += photographs_count;
    totalPlans.value += plans_count;
    totalThreedhop.value += threedhop_count;
    totalPointcloud.value += pointcloud_count;

  }
};

watch(
  () => dataParams.value,
  async (newTagParams, oldTagParams) => {
    const url = `https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page_size=500&${new URLSearchParams(newTagParams).toString()}`;
    await fetchData(url);
  },
  { immediate: true }
);

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

function handleSelectionClick(selectedValue, targetRef) {
  const selectedCoordinates = NECROPOLICoordinates.value[selectedValue];
  if (selectedCoordinates) {
    const [x, y] = selectedCoordinates;

    // Convert them to Web Mercator (EPSG:3857)
    const webMercatorCoordinates = transform([x, y], 'EPSG:4326', 'EPSG:3857');
    
    // Update the selectedNecropolisCoordinates in the store
    selectedNecropolisCoordinates.value = webMercatorCoordinates;
  } else {
    // console.log("Coordinates for selected necropolis not found");
  }
  clearAll();
}

function clearAll() {
  categories.value = ["all"];
  enablePlan.value = false;
  enable3D.value = false;
  tombType.value = ["all"];
}
</script>

<style>
.loading-svg {
  width: 100%;
  height: 200px;
  background:url("/90-ring-with-bg.svg");
  background-size:60px;
  background-repeat:no-repeat;
  background-position:50% 50%;
  display: block;
  margin: auto;
  transition: all 0.4s;

}
.loading-svg:hover {
  height: 240px;
  transform:scale(1.5);
}

#app .section-title {
  margin-top:10px;
  margin-bottom:-3px;
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
