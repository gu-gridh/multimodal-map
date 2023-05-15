<template>
  <VueMasonryWall
    :key="layoutKey"
    class="masonry-wall"
    :items="images"
    :column-width="200" 
    :gap="2"
  >
    <template v-slot:default="{ item }">
      <router-link
        :key="item.uuid"
        :to="`/detail/image/${item.id}`"
        class="grid-item"
      >
        <img :src="`${item.iiif_file}/full/700,/0/default.jpg`" @load="imageLoaded" />
         <div class="grid-item-info">
          <div class="grid-item-info-meta">
            <h1>{{item.title}}</h1>
          </div>
        </div>
      </router-link>
    </template>
  </VueMasonryWall>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, defineComponent } from "vue";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";
import VueMasonryWall from "@yeger/vue-masonry-wall";

const diana = inject("diana") as DianaClient;

const images = ref<Array<Image>>([]);

let layoutKey = ref(0);
let loadedImagesCount = ref(0);

const imageLoaded = () => {
  loadedImagesCount.value++;
  if (loadedImagesCount.value === images.value?.length) {
    refreshMasonry();
  }
};

const refreshMasonry = () => {
  layoutKey.value++;
}

onMounted(async () => {
  images.value = await diana.listAll<Image>("image");
});

defineComponent({
  components: {
    VueMasonryWall,
  },
});


</script>

<style>
.masonry-wall {
  position: absolute;
  top: 0px;
  width: 100%; 
  height: 100%; 
  z-index: 200;
  background-color: rgb(234, 228, 219);
  padding: 0px 0px 0px 0px; 
  overflow-y: scroll;
  transition: all 0.5s ease-in-out;
}

@media (min-width: 900px) {
  .masonry-wall {
    padding: 0px 0px 0px 450px; 
  }
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
  cursor:pointer;
  z-index: 400; 
  overflow-wrap: break-word;
}

.grid-item-info-meta {
  padding: 10px;
}

.grid-item:hover .grid-item-info {
  opacity: 0.9;
}

.grid-item {
  position: relative;
  overflow: hidden;
  width: auto;
}

.grid-item img {
  object-fit: cover; 
  transition: all 0.2s ease-in-out;
}

.grid-item:hover img {
  transform: scale(1.05);
  z-index: 300; 
  filter: brightness(50%); 
}

.grid-item:hover .grid-item-info {
  opacity: 0.9;
}
</style>