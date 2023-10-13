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
        :key="item.uuid"
        :to="`/detail/image/${item.id}`"
        class="grid-item"
      >
        <img :src="`${item.iiif_file}/full/450,/0/default.jpg`" @load="imageLoaded" />
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
  background-color: rgb(234, 228, 219);
}
</style>