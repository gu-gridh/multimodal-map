<template>
  <!-- <div class="section-title">
    <h1>{{ $t('documentation') }}</h1>
  </div> -->
  <!-- <CategoryButtonList v-model="categories" :categories="CATEGORIES" :limit="1" class="my-2"
    @click="handleCategoryClick" /> -->

  <!--   <transition name="slide">
    <div class="slideinactive" v-bind:class="{slideactive: isSliderVisible}">
      <div class="section-title">Time span</div>
      <RangeSlider
        v-model="years"
        :min="YEARS.MIN"
        :max="YEARS.MAX"
        :step="1"
        class="my-2"
      />
    </div>
  </transition> -->


  <div class="tag-section">
    <div class="section-title">{{ $t('timeperiod') }}</div>
    <div class="broad-controls">
         <CategoryButtonList 
          v-model="tags" 
          :categories="TAGS" 
          :limit="1" 
          styleType="button"
          class="my-2"
          @click="handleSelectionClick($event, currentTombType)"
        />
    </div>
  </div>

  <div style="width:98%; float:left; display:flex; flex-direction:row; justify-content:space-between;">
  <div class="tag-section" style="float:left;">
    <div class="section-title">Necropolis</div>
    <div class="broad-controls">
        <CategoryButtonList 
          v-model="necropoli" 
          :categories="NECROPOLI" 
          :limit="1" 
          styleType="dropdown"
          class="my-2"
          @click="handleSelectionClick($event, currentTombType)"
        />
    </div>
    <!-- <div class="broad-controls">
      <CategoryButtonList v-model="necropoli" :categories="NECROPOLI" :limit="1" class="my-2"
        @click="handleSelectionClick($event, currentNecropolis)" />
    </div> -->
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
          @click="handleSelectionClick($event, currentTombType)"
        />
    </div>
  </div>

</div>

  <!-- <div class="tag-section">
  <div class="section-title">Tags</div>
  <div class="broad-controls">
  <CategoryButtonList
    v-model="tags"
    :categories="TAGS"
    :limit="1"
    class="my-2"
    @click="handleTagClick" 
  />
</div>
</div> -->



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
        <h3>{{ $t('plans') }}:</h3>
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
import CategoryButtonList from "@/components/input/CategoryButtonDropdown.vue";
// import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import type { EtruscanProjectProject } from "./types";
import { DianaClient } from "@/assets/diana";

const config = inject<EtruscanProject>("config");
const dianaClient = new DianaClient("etruscantombs"); // Initialize DianaClient
const { categories, years, tags, necropoli, tombType, dataParams } = storeToRefs(etruscanStore());
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
  all: "All Documentation",
  image: "Photographs",
  models: "3D models",
  plans: "Plans",
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

async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any) {
  try {
    const data = await dianaClient.listAll<T>(type);
    data.forEach((result: any) => {
      if (result.published) {
        refToPopulate.value[result.id] = result.text;
      }
    });
  } catch (error) {
    console.error(`Error fetching data for type ${type}:`, error);
  }
}

const handleCategoryClick = (category: string) => {
  // If a category is clicked, clear tags
  tags.value = [];
  // If the clicked category is the same as the last clicked one, default to "all"
  if (lastClickedCategory.value === category) {
    categories.value = ["all"];

    // Clear the lastClickedCategory since it was unselected
    lastClickedCategory.value = '';
  } else {
    // Add the clicked category only if it's not the same as the last clicked one
    categories.value = [category];

    // Update last clicked category
    lastClickedCategory.value = category;
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
  // console.log("Selected value:", selectedValue);
}

</script>

<style>
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
  margin-top: 20px;
  padding: 15px 25px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  min-height: 50px;
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
