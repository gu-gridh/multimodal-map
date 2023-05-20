<script setup lang="ts">
import type { RephotographyDeep } from "./types";
import ComparisonSlider from "@/components/ComparisonSlider.vue";

defineProps<{
  rephotography: RephotographyDeep;
}>();
</script>

<template>
  <router-link
    :to="`/detail/rephotography/${rephotography.id}`"
    class="clickable"
  >
    <div class="image-container">
      <ComparisonSlider locked>
        <template #left>
          <img
            :src="`${rephotography.old_image.iiif_file}/full/380,/0/default.jpg`"
            class="image"
          />
        </template>
        <template #right>
          <img
            :src="`${rephotography.new_image.iiif_file}/full/380,/0/default.jpg`"
            class="image"
          />
        </template>
      </ComparisonSlider>
    </div>
    <div class="flex justify-between">
      <div>
        <div>{{ rephotography.old_image.title }}</div>
        <div>{{ rephotography.old_image.description }}</div>
        <div>{{ rephotography.old_image.date }}</div>
      </div>
      <div class="text-right">
        <div>{{ rephotography.new_image.title }}</div>
        <div>{{ rephotography.new_image.description }}</div>
        <div>{{ rephotography.new_image.date }}</div>
      </div>
    </div>
  </router-link>
</template>
