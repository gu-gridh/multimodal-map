<script setup lang="ts">
import type { Image } from "./types";

defineProps<{
  image: Image;
}>();
</script>

<template>
  <router-link :to="`/detail/image/1`" class="clickable">
    <div>
      <img :src="`${image.iiif_file}/full/380,/0/default.jpg`" class="image" />
      <div>{{ image.title }}</div>
      <div>{{ image.description }}</div>
      <div>{{ image.date }}</div>
    </div>
  </router-link>
</template>
