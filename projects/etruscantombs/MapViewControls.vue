<template>

<button class="item" @click="toggleMapLayer">
  <div :class="['p-1', 'px-2', 'clickable', 'category-button', { 'active': mapLayerVisibility}]" style="width: auto; margin-left:10px; text-align: center; cursor: pointer;">Historical data layer</div>
</button>

  <div class="section-title">Documentation by category</div>
  <CategoryButtonList
    v-model="categories"
    :categories="CATEGORIES"
    :limit="1"
    class="my-2"
    @click="handleCategoryClick" 
  />
  
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
</div>





</template>

<script setup lang="ts">
// @ts-nocheck
import { inject, ref, onMounted, computed } from "vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { etruscanTombsStore } from "./store";
import type { EtruscanTombsProject } from "./types";

const config = inject<EtruscanTombsProject>("config");
const { categories, years, tags, tagsLayerVisible, placesLayerVisible, mapLayerVisibility } = storeToRefs(etruscanTombsStore());

// See https://github.com/gu-gridh/etruscantombs/blob/master/views.py
const CATEGORIES = {
  all: "All Categories",
  image: "Photographs",
  models: "Models",
  // documents: "Documents",
  plans: "Plans",
};

const TAGS = ref<Record<string, string>>({});
const YEARS = {
  MIN: config?.timeRange?.[0] || 0,
  MAX: config?.timeRange?.[1] || new Date().getFullYear(),
};

onMounted(async () => {
  const response = await fetch("https://localhost:8000/api/etruscantombs/tag/");
  const data = await response.json();
  const tagTexts = data.results.filter(result => result.published).map(tag => tag.text);
  tagTexts.forEach(tagText => {
    TAGS.value[tagText] = tagText;
  });
});

const isSliderVisible = ref(true);

// Create a ref for last clicked category
const lastClickedCategory = ref('');

const handleCategoryClick = (category: string) => {
  if (tagsLayerVisible.value) { 
    tagsLayerVisible.value = false;
    placesLayerVisible.value = true;
  }

  // If a category is clicked, clear tags
  tags.value = [];
  isSliderVisible.value = true;

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

// Create a ref for last clicked tag
const lastClickedTag = ref('');

const handleTagClick = (tag: string) => {
  if (placesLayerVisible.value) { 
    placesLayerVisible.value = false;
    tagsLayerVisible.value = true;
  }

  // If a tag is clicked, clear categories
  categories.value = [];
  isSliderVisible.value = false;

  // If the clicked tag is the same as the last clicked tag, return to the default view
  if (lastClickedTag.value === tag) {
    categories.value = ["all"];
    tags.value = [];
    placesLayerVisible.value = true;
    tagsLayerVisible.value = false;
    isSliderVisible.value = true;

    // Clear the lastClickedTag since it was unselected
    lastClickedTag.value = '';
  } else {
    // Add the clicked tag only if it's not the same as the last clicked one
    tags.value = [tag];

    // Update last clicked tag
    lastClickedTag.value = tag;
  }
};

const toggleMapLayer = () => {
   mapLayerVisibility.value = !mapLayerVisibility.value; // Toggle the map layer visibility
 };
</script>

<style>
.section-title {
  font-weight: 400;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 5px;
}

#app .category-button {
  background-color: rgba(255, 255, 255, 0.6);
  color: rgb(71, 85, 105);
  border-radius: 4px;
}

#app .category-button:hover {
  background-color: rgb(140,80,80);
  color: white;
}

#app .category-button.active {
  background-color:rgb(180,100,100);
  color: white;
}

#app .range-slider-container {
  display: flex;
  width: 100%;
  height: 90px;
  align-items: bottom;
  padding: 25px 0 0 0;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
}

#app .range-slider-wrapper {
  padding-left: 5px;
  padding-right: 5px;
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

#app .slider-connect {
  background-color: #ff9900;
}

#app .slider-tooltip {
  background-color: #ff9900;
  border: 1px solid var(--slider-tooltip-bg, #ff9900);
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
  box-shadow: var(--slider-handle-shadow, 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0));
  cursor: grab;
}

#app .broad-controls{
  width:100%;

}

@media screen and (max-width: 900px) {
  #app .broad-controls{
  width:100%;

}
}

.slide-leave-active {
  transition: all 0.4s;
  opacity:1.0;
}

.slide-leave-to {
  opacity:0.5;
}

.slideinactive {
  opacity:0.4;
  pointer-events: none !important;
  transition: all 0.4s;
}

.slideactive {
  transition: all 0.4s;
  opacity:1.0;
}


</style>
