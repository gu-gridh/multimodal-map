<template>
  <VueMasonryWall
    :key="layoutKey"
    class="masonry-wall"
    :items="images"
    :column-width="300" 
    :gap="10"
  >
    <template v-slot:default="{ item }">
      <router-link
        :key="item.Id"
        :to="`/place/${item.Id}`"
        class="grid-item"
      >
        <img :src="item.Photo" @load="imageLoaded" />
        <div class="grid-item-info">
          <div class="grid-item-info-meta">
            <h1>{{ item.Place }}</h1>
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

type GalleryImage = {
  Id: number;
  Place: string;
  Photo: string;
};

const images = ref<Array<GalleryImage>>([]);
const diana = inject("diana") as DianaClient;

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
  try {
    const response = await fetch("https://orgeldatabas.gu.se/webgoart/goart/gallery.php?btype=1&year1=1725&year2=1806&page=1&group=10");
    const data: Array<GalleryImage> = await response.json();

    images.value = data.filter(img => img.Photo !== ""); // Filtering out images with no Photo URL

  } catch (error) {
    console.error("Error fetching data:", error);
  }
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
  z-index: 99;
  background-color: rgb(234, 228, 219);
  padding: 0px 0px 0px 0px; 
  overflow-y: scroll;
  transition: all 0.5s ease-in-out;
}

@media (min-width: 900px) {
  #app .masonry-wall {
    padding: 0px 0px 0px 480px; 
  }
}

@media (min-width: 1500px) {
  #app .masonry-wall {
    padding: 0px 0px 0px 30%; 
  }
}

.grid-item:hover .grid-item-info {
  opacity: 0.9;
}

.grid-item {
  width:100%;
  display: flex;
  position: relative;
  overflow: hidden;
  width: auto;
}

.grid-item img {
  width:100%;
  transition: all 0.2s ease-in-out;
}

.grid-item:hover img {
  transform: scale(1.05);
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
  cursor:pointer;
  z-index: 400; 
  overflow-wrap: break-word;
  line-height:1.0;
}

.grid-item:hover .grid-item-info {
  opacity: 0.9;
}

.grid-item-info-meta {
  padding: 10px;
}



</style>