<template>
  <div class="masonry-grid">
    <router-link
      v-for="image in images"
      :key="image.uuid"
      :to="`/detail/image/${image.id}`"
      class="grid-item"
    >
      <img :src="`${image.iiif_file}/full/200,/0/default.jpg`" />
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
  top: 10px;
  left: 50%; /* Center the grid horizontally */
  transform: translateX(-50%); /* Center the grid horizontally */
  width: 100%; /* Make the grid responsive */
  max-width: 1000px; /* Limit the width on larger screens */
  height: calc(100% - 20px); /* Make the grid height responsive */
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 10px;
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
