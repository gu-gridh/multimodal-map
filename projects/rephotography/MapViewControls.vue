<template>
  <div class="section-title">Glacier data</div>
  <div class="button-container">
    <button class="item" @click="toggleMapLayerTwo">
      <div :class="['p-1', 'px-2', 'clickable', 'category-button', { 'active': mapLayerVisibilityTwo }]">
        1936-1972
      </div>
    </button>
    <button class="item" @click="toggleMapLayer">
      <div :class="['p-1', 'px-2', 'clickable', 'category-button', { 'active': mapLayerVisibility }]">
        2008-2022
      </div>
    </button>

    <!-- <button class="item" @click="toggleMapLayerThree">
      <div
        :class="['p-1', 'px-2', 'clickable', 'category-button', { 'active': mapLayerVisibilityThree}]"
      >
        CryoClim_GAO_SJ_2001-2010 layer
      </div>
    </button> -->
  </div>
  <div class="control-section">
  <div class="section-title">Documentation by category</div>
  <CategoryButtonList v-model="categories" :categories="CATEGORIES" :limit="1" class="my-2"
    @click="handleCategoryClick" />
  </div>
  <div class="control-section">
  <transition name="slide">
    <div class="slideinactive" v-bind:class="{ slideactive: isSliderVisible }">
      <div class="section-title">Time span</div>
      <RangeSlider v-model="years" :min="YEARS.MIN" :max="YEARS.MAX" :step="1" class="my-2"
        :isSliderVisible="isSliderVisible" />
    </div>
  </transition>
</div>
<div class="control-section">
  <div class="section-title">Tags</div>
  <div class="broad-controls">
    <CategoryButtonList v-model="tags" :categories="TAGS" :limit="1" class="my-2" @click="handleTagClick" />
  </div>
</div>
</template>

<script setup>
import { inject, ref, onMounted, computed } from "vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./settings//store";

const config = inject("config");
const { categories, years, tags, tagsLayerVisible, placesLayerVisible, mapLayerVisibility, mapLayerVisibilityTwo } = storeToRefs(rephotographyStore());

// See https://github.com/gu-gridh/rephotography/blob/master/views.py
const CATEGORIES = {
  all: "All Categories",
  image: "Photographs",
  video: "Videos",
  // documents: "Documents",
  drawing: "Art",
  observation: "Observations",


};

const TAGS = ref({});
const YEARS = {
  MIN: config?.timeRange?.[0] || 0,
  MAX: config?.timeRange?.[1] || new Date().getFullYear(),
};

onMounted(async () => {
  const response = await fetch("https://diana.dh.gu.se/api/rephotography/tag/");
  const data = await response.json();
  const tagTexts = data.results.filter(result => result.published).map(tag => tag.text);
  tagTexts.forEach(tagText => {
    TAGS.value[tagText] = tagText;
  });
});

const isSliderVisible = ref(true);

const lastClickedElementType = ref(''); // can be either 'tag' or 'category'
const lastClickedElement = ref(''); // the last clicked tag or category

const lastClickedValue = ref('');

const handleCategoryClick = (category) => {
  if (tagsLayerVisible.value) {
    tagsLayerVisible.value = false;
    placesLayerVisible.value = true;
  }

  //if a category is clicked, clear tags
  tags.value = [];
  isSliderVisible.value = true;

  if (lastClickedElementType.value === 'category' && lastClickedValue.value === category) {
    categories.value = ["all"];
    lastClickedValue.value = '';
  } else {
    categories.value = [category];
    lastClickedValue.value = category;
  }

  lastClickedElementType.value = 'category'; // Update the type of the last clicked element
};

const handleTagClick = (tag) => {
  if (placesLayerVisible.value) {
    placesLayerVisible.value = false;
    tagsLayerVisible.value = true;
  }

  //if a tag is clicked, clear categories
  categories.value = [];
  isSliderVisible.value = false;

  if (lastClickedElementType.value === 'tag' && lastClickedValue.value === tag) {
    categories.value = ["all"];
    tags.value = [];
    placesLayerVisible.value = true;
    tagsLayerVisible.value = false;
    isSliderVisible.value = true;
    lastClickedValue.value = '';
  } else {
    tags.value = [tag];
    lastClickedValue.value = tag;
  }

  lastClickedElementType.value = 'tag'; //update the type of the last clicked element
};


const toggleMapLayer = () => {
  mapLayerVisibility.value = !mapLayerVisibility.value;
  mapLayerVisibilityTwo.value = false;
};

const toggleMapLayerTwo = () => {
  mapLayerVisibilityTwo.value = !mapLayerVisibilityTwo.value;
  mapLayerVisibility.value = false;
};

// const toggleMapLayerThree = () => {
//   mapLayerVisibilityThree.value = !mapLayerVisibilityThree.value; // Toggle the map layer visibility
// };
</script>

<style>
  .control-section{
    width:96%;
  }
.section-title {
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 0px;
}

#app .category-button {
  background-color: rgba(255, 255, 255, 0.6);
  color: rgb(71, 85, 105);
  border-radius: 4px;
}

#app .category-button:hover {
  background-color: #ff6600;
  color: white;
}

#app .category-button.active {
  background-color: #ff9900;
  color: white;
}


#app .range-slider-container {
  display: flex;
  width: 100%;
  height: auto;
  align-items: bottom;
  padding: 60px 0 15px 0;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
}

#app .range-slider-wrapper {
  padding-left: 27px;
  padding-right: 28px;
}

#app .start-end-box {
  display: none;
  width: 15%;
  font-size: 18px;
  text-align: center;
  padding-top: 0rem;
  padding-bottom: 0.5rem;
}

#app .rounded {
  border-radius: 8px;
}

#app .slider-connect {
  background-color: #ff9900;
}

#app .slider-connects {
  background-color: rgb(180, 180, 180);
}

#app .slider-tooltip {
  background-color: #ff9900;
  border: 1px solid var(--slider-tooltip-bg, #ff9900);
  font-size: 18px;
  font-weight: 500;
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
  border-top: 15px solid #ff9900;
  ;
  box-shadow: var(--slider-handle-shadow, 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0));
  cursor: grab;
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
  transition: all 0.4s;
  filter: grayscale(100%);
}

.slideactive {
  transition: all 0.4s;
  opacity: 1.0;
  filter: grayscale(0%);
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  margin-top: 10px;
}

.button-container .item {
  margin-right: 10px;
}
</style>
