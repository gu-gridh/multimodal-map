<template>
  <MasonryGallery class="masonry-wall" :items="images" :column-width="250" :gap="0">
    <template v-slot:default="{ item }">
      <router-link :key="item.uuid" :to="`/detail/image/${item.id}`" class="grid-item">
        <img :src="`${item.iiif_file}/full/400,/0/default.jpg`" />
        <div class="grid-item-info">
          <div class="grid-item-info-meta">
            <h1>{{ item.title }}</h1>
          </div>
        </div>
      </router-link>
    </template>
  </MasonryGallery>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MasonryGallery from "@/components/MasonryGallery.vue";
import { DianaClient } from "./settings/diana.js";

const diana = new DianaClient("jubileum");
const images = ref([]);

onMounted(async () => {
  images.value = await diana.listAll("image");
});
</script>

<style>
.masonry-wall {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 99;
  padding: 0px 0px 0px 0px;
  overflow-y: scroll;
  transition: all 0.5s ease-in-out;
  z-index: 249;
  pointer-events: none;
}

@media (max-width: 900px) {
  #app .masonry-wall {
    pointer-events: auto;
  }
}

@media (min-width: 900px) {
  #app .masonry-wall {
    padding: 0px 0px 0px 450px;
  }
}

@media (min-width: 1500px) {
  #app .masonry-wall {
    padding: 0px 0px 0px 500px;
  }
}

.grid-item {
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  width: auto;
  pointer-events: auto;
  border-width: 5px;
  border-color: rgb(234, 228, 219);
  border-style: solid;
}

.grid-item img {
  width: 100%;
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
}

.grid-item:hover img {
  transform: scale(1.15);
  z-index: 300;
}


.grid-item-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%);
  color: rgb(255, 255, 255);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  z-index: 400;
  overflow-wrap: break-word;
  line-height: 1.0;
}

.grid-item:hover .grid-item-info {
  opacity: 0.9;
}

.grid-item-info-meta {
  padding: 10px;
}
</style>