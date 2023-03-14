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
  image: "Photos",
  video: "Video",
  observation: "Observations",
};

const YEARS = {
  MIN: config?.timeRange?.[0] || 0,
  MAX: config?.timeRange?.[1] || new Date().getFullYear(),
};

function setCategories(keys: string[]) {
  categories.value = keys;
}

function setYears([start, end]: [number, number]) {
  years.value = [start, end];
}
</script>

<template>
  <CategoryButtonList
    :categories="CATEGORIES"
    :limit="1"
    class="my-2"
    @change="setCategories"
  />

  <RangeSlider
    :min="YEARS.MIN"
    :max="YEARS.MAX"
    :step="1"
    class="my-2"
    @change="setYears"
  />
</template>
