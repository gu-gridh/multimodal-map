<script setup lang="ts">
import type { Image } from "./types";
import router from './router'

const props = defineProps<{
  image: Image;
}>();

console.log(props.image)

const pushToPage = () => {
  router.push({path: `/image/${props.image.id}`})
  .then(() => {router.go(0)})
}

</script>

<template>
   <div class="container clickable" @click="pushToPage">
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
