<script setup lang="ts">
import DetailPage from "@/components/DetailPage.vue";
import type { RephotographyDeep } from "./types";
import ComparisonSlider from "@/components/ComparisonSlider.vue";

defineProps<{
  object: RephotographyDeep;
  id: number;
}>();
</script>

<template>
  <div class="metadata">
    <DetailPage :title="object.title" back="/">
      <h2 class="text-xl">Left image</h2>

      <p v-if="object.old_image.description" class="my-2">
        {{ object.old_image.description }}
      </p>
      <div v-if="object.old_image.creator">
        By: {{ object.old_image.creator.name }}
      </div>
      <div v-if="object.old_image.place">
        At: {{ object.old_image.place.name }}
      </div>
      <div v-if="object.old_image.date">On: {{ object.old_image.date }}</div>
      <div v-if="object.old_image.focus">
        Focus: {{ object.old_image.focus.text }}
      </div>
      <div v-if="object.old_image.tag.length">
        Tags:
        {{ object.old_image.tag.map((tag) => tag.text).join(", ") }}
      </div>

      <h2 class="text-xl mt-4">Right image</h2>

      <p v-if="object.new_image.description" class="my-2">
        {{ object.new_image.description }}
      </p>
      <div v-if="object.new_image.creator">
        By: {{ object.new_image.creator.name }}
      </div>
      <div v-if="object.new_image.place">
        At: {{ object.new_image.place.name }}
      </div>
      <div v-if="object.new_image.date">On: {{ object.new_image.date }}</div>
      <div v-if="object.new_image.focus">
        Focus: {{ object.new_image.focus.text }}
      </div>
      <div v-if="object.new_image.tag.length">
        Tags:
        {{ object.new_image.tag.map((tag) => tag.text).join(", ") }}
      </div>
    </DetailPage>
  </div>

  <section class="illustration flex flex-col justify-center">
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
