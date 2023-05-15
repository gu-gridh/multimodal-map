<template>
  <VueMasonryWall
    :key="layoutKey"
    class="masonry-wall"
    :items="images"
    :options="{ columnWidth: 250, gutter: 5, percentPosition: true }"
  >
    <template v-slot:default="{ item }">
      <router-link
        :key="item.uuid"
        :to="`/detail/image/${item.id}`"
        class="grid-item"
      >
        <img :src="`${item.iiif_file}/full/400,/0/default.jpg`" @load="imageLoaded" />
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
  padding: 0px 10px 10px 10px; 
  overflow-y: scroll;
}

@media (min-width: 768px) {
  .masonry-wall {
    padding: 0px 10px 10px 450px; 
  }
}

.masonry-item:hover {
  transform: scale(1.1);
  z-index: 300; 
}

</style>