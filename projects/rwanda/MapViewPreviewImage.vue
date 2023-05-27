<script setup lang="ts">
import type { Image } from "./types";

defineProps<{
  image: Image;
}>();

</script>

<template>
   <div class="container">
  <router-link :to="`/image/${image.id}`" class="clickable">
    <div>
      <div class="image-card-white">
      <div class="image-container">
        <img
          :src="`${image.iiif_file}/full/380,/0/default.jpg`"
          class="image"
        />
      </div>
      <div>{{ image.title }}</div>
    </div>
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
