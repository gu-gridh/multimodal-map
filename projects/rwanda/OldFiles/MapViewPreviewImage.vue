<script setup lang="ts">
import type { Image } from "./types";

const props = defineProps<{
  image: Image;
}>();


</script>

<template>
   <div class="container clickable">
    <router-link :to="`/image/${props.image.id}`">
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
