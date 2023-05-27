<script setup lang="ts">
import type { Image } from "./types";

defineProps<{
  image: Image;
}>();
</script>

<template>
    <div class="container">
  <router-link :to="`/detail/image/${image.id}`" class="clickable">
    <div class="image-card">
      <div class="image-container">
        <img
          :src="`${image.iiif_file}/full/500,/0/default.jpg`"
          class="image"
        />
      </div>
      <div>{{ image.title }}</div>
      <div>{{ image.description }}</div>
      <div>{{ image.date }}</div>
    </div>
  </router-link>
</div>
</template>

<style scoped>
h2{
  font-size:1.5em;
  font-weight:200;
}

.container{
  height:auto;
  background-color:none;
}
</style>