<script setup lang="ts">
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "@/components/input/RangeSlider.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";

const { categories } = storeToRefs(rephotographyStore());

// See https://github.com/gu-gridh/rephotography/blob/master/views.py
const CATEGORIES = {
  image: "Photos",
  video: "Video",
  observation: "Observations",
};

function setCategories(keys: string[]) {
  categories.value = keys;
}
</script>

<template>
  <CategoryButtonList
    :categories="CATEGORIES"
    class="my-2"
    @change="setCategories"
  />

  <RangeSlider :min="1700" :max="2022" :step="1" class="my-2" />
</template>
