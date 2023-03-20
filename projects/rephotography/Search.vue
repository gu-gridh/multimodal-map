<script setup lang="ts">
import { inject } from "vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";
import type { RephotographyProject } from "./types";

const config = inject<RephotographyProject>("config");
const { categories, years } = storeToRefs(rephotographyStore());

// See https://github.com/gu-gridh/rephotography/blob/master/views.py
const CATEGORIES = {
  image: "All Categories",
  image: "Photographs",
  video: "Video",
  observation: "Observations",
};

const YEARS = {
  MIN: config?.timeRange?.[0] || 0,
  MAX: config?.timeRange?.[1] || new Date().getFullYear(),
};
</script>

<template>
  <div class="section-title">Documentation by category</div>
  <CategoryButtonList
    v-model="categories"
    :categories="CATEGORIES"
    :limit="1"
    class="my-2"
  />
  <div class="section-title">Time span</div>
  <RangeSlider
    v-model="years"
    :min="YEARS.MIN"
    :max="YEARS.MAX"
    :step="1"
    class="my-2"
  />
</template>

<style>

.section-title{
font-weight:400;
font-size:20px;
margin-top:30px;
margin-bottom:5px;
}

#app .category-button {
  background-color: rgba(255,255,255,0.6);
  color: rgb(71, 85, 105);
  border-radius: 4px;
}

#app .base-shadow {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.0), 0 2px 4px -2px rgb(0 0 0 / 0.0);
--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
0 2px 4px -2px var(--tw-shadow-color);
}

#app .category-button:hover {
  background-color: #FF6600;
  color: white;
}

#app .category-button.active {
  background-color: #FF9900;
  color: white;
}

#app .range-slider-container {
  display: flex;
  width: 100%;
  height:90px;
  align-items: bottom;
  padding:5px 0 0 0;
  background-color: rgba(255,255,255,0.6);
}

#app .range-slider-wrapper {
  padding-left: 10px;
  padding-right: 10px;
}

#app .start-end-box {
  width: 15%;
  text-align: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

#app .rounded {
  border-radius:10px;
}

#app .slider-connect{
  background-color: #FF9900;
}

#app .slider-tooltip{
  background-color: #FF9900;
  border: 1px solid var(--slider-tooltip-bg,#FF9900);
}
</style>
