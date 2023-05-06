<template>
  <div class="masonry-grid">
    <router-link
      v-for="image in images"
      :key="image.uuid"
      :to="`/detail/image/${image.id}`"
      class="grid-item"
    >
      <img :src="`${image.iiif_file}/full/400,/0/default.jpg`" />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from "vue";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";

const diana = inject("diana") as DianaClient;

const images = ref<Array<Image>>();

onMounted(async () => {
  images.value = await diana.listAll<Image>("image");
});
</script>

<style>
.masonry-grid {
  position: absolute;
  top: 0px;
  width: 100%; /* Make the grid responsive */
  height: 100%; /* Make the grid height responsive */
  z-index: 200;
  background-color: rgb(234, 228, 219);
  padding: 0px 10px 10px 450px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-rows: masonry;
  grid-gap: 5px;
  overflow-y: scroll;
}

.grid-item img {
  max-width: 100%; /* Make the images responsive */
  height: auto;
}

.grid-item {
  transition: transform 0.2s ease-in-out;
}

.grid-item:hover {
  transform: scale(1.1);
}

.grid-item img {
  max-width: 100%; /* Make the images responsive */
  height: auto;
}
</style>
