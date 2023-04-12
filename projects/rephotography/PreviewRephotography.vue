<script setup lang="ts">
import type { RephotographyDeep } from "./types";

defineProps<{
  rephotography: RephotographyDeep;
}>();
</script>

<template>
  <router-link :to="`/detail/rephotography/1`" class="clickable">
    <div>
      <div class="split-image">
        <img
          :src="`${rephotography.old_image.iiif_file}/full/380,/0/default.jpg`"
          class="image"
        />
        <img
          :src="`${rephotography.new_image.iiif_file}/full/380,/0/default.jpg`"
          class="image"
        />
      </div>
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
