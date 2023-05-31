<template>
  <div class="section-title">Documentation by category</div>
  <CategoryButtonList
    v-model="categories"
    :categories="CATEGORIES"
    :limit="1"
    class="my-2"
    @click="handleCategoryClick" 
  />
  
  <div class="section-title">Time span</div>
  <RangeSlider
    v-model="years"
    :min="YEARS.MIN"
    :max="YEARS.MAX"
    :step="1"
    class="my-2"
  />

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
</template>

<script setup lang="ts">
// @ts-nocheck
import { inject, ref, onMounted, computed } from "vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";
import type { RephotographyProject } from "./types";

const config = inject<RephotographyProject>("config");
const { categories, years, tags, tagsLayerVisible, placesLayerVisible } = storeToRefs(rephotographyStore());

// See https://github.com/gu-gridh/rephotography/blob/master/views.py
const CATEGORIES = {
  all: "All Categories",
  image: "Photographs",
  video: "Videos",
  // documents: "Documents",
  drawing: "Drawings",
  art: "Art",
  observation: "Observations",
};

const TAGS = ref<Record<string, string>>({});
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

const handleCategoryClick = (category: string) => {
  if (tagsLayerVisible.value) { 
    tagsLayerVisible.value = false;
    placesLayerVisible.value = true;
  }

  // If a category is clicked, clear tags
  tags.value = [];
};

const handleTagClick = (tag: string) => {
  if (placesLayerVisible.value) { 
    placesLayerVisible.value = false;
    tagsLayerVisible.value = true;
  }

  // If a tag is clicked, clear categories
  categories.value = [];

  // If the clicked tag is already selected, return early to prevent adding the tag again
  if (tags.value.includes(tag)) {
    return;
  }

  // Add the clicked tag
  tags.value.push(tag);
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
</style>
