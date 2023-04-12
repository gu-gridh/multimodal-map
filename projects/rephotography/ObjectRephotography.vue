<script setup lang="ts">
import type { RephotographyDeep } from "./types";
import ComparisonSlider from "@/components/ComparisonSlider.vue";

defineProps<{
  object: RephotographyDeep;
  id: number;
}>();
</script>

<template>
  <section class="illustration">
    <ComparisonSlider>
      <template #left>
        <img
          :src="`${object.old_image.iiif_file}/full/1500,/0/default.jpg`"
          class="image"
        />
      </template>
      <template #right>
        <img
          :src="`${object.new_image.iiif_file}/full/1500,/0/default.jpg`"
          class="image"
        />
      </template>
    </ComparisonSlider>
  </section>
</template>

<style scoped>
.illustration {
  min-height: 100vh;
}
</style>
