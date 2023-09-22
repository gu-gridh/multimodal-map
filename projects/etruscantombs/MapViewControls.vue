<template>
  <div class="section-title"><h1>{{ $t('documentation') }}</h1></div>
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
  <div class="section-title">{{ $t('period') }}</div>
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

  <div class="tag-section">
  <div class="section-title">Necropoli</div>
  <div class="broad-controls">
  </div>
</div>

<div class="tag-section">
  <div class="section-title">{{ $t('tomb') }}</div>
  <div class="broad-controls">
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

</template>

<script setup lang="ts">
// @ts-nocheck
import { inject, ref, onMounted, computed } from "vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
// import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import type { EtruscanProjectProject } from "./types";

const config = inject<EtruscanProject>("config");
const { categories, years, tags, tagsLayerVisible, placesLayerVisible, mapLayerVisibility } = storeToRefs(etruscanStore());

const CATEGORIES = {
  all: "All Documentation",
  image: "Photographs",
  models: "3D models",
  plans: "Plans",
};

const TAGS = ref<Record<string, string>>({});
const currentTag = ref(null);

const YEARS = {
  MIN: config?.timeRange?.[0] || 0,
  MAX: config?.timeRange?.[1] || new Date().getFullYear(),
};

onMounted(async () => {
  const response = await fetch("https://diana.dh.gu.se/api/etruscantombs/epoch/");
  const data = await response.json();  
  data.results.forEach(result => {
    if (result.published) {
      TAGS.value[result.id] = result.text;
    }
  });
});

// Create a ref for last clicked category
const lastClickedCategory = ref('');

const handleCategoryClick = (category: string) => {
  if (tagsLayerVisible.value) { 
    tagsLayerVisible.value = false;
    placesLayerVisible.value = true;
  }

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

function handleTagClick(tag) {
  currentTag.value = tag;
}
</script>

<style>
.section-title {
  font-weight: 400;
  font-size: 20px;
  margin-top: 20px;
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
