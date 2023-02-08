<script setup lang="ts">
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "@/components/input/RangeSlider.vue";
</script>

<template>
  <CategoryButtonList
    :categories="['Photos', 'Rephotography', 'Panorama', 'Video', 'Text']"
    class="my-2"
  />

  <RangeSlider :min="1700" :max="2022" :step="1" class="my-2" />
</template>
