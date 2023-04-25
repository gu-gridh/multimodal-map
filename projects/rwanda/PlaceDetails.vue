<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Image } from "./types";
import PreviewImage from "./PreviewImage.vue";
import type { DianaClient } from "@/assets/diana";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Array<Image>>();

watchEffect(async () => {
  if (selectedFeature.value) {
    const place = selectedFeature.value.getId();
    images.value = await diana.listAll<Image>("image", { place });
  } else {
    images.value = [];
  }
});
function deselectPlace() {
  selectedFeature.value = undefined;
}
</script>

<template>
  <div v-if="selectedFeature" class="detail-view">
    <div class="px-8 py-6">
      <div class="close-button" @click="deselectPlace">+</div>
      <h3 class="">{{ selectedFeature.get("name") }}</h3>
      <div class="flex flex-col gap-10 pointer">
    

        <PreviewImage
          v-for="image in images"
          :key="image.uuid"
          :image="image"
        />
      </div>
    </div>
  </div>
</template>

<style>
#app h3 {
  font-size: 35px;
  font-weight: 100;
  margin-left: -2px;
  margin-bottom: 10px;
}

.image {
  margin-bottom: 8px;
}

.split-image {
  display: flex;
}
.split-image img {
  width: 50%;
}

.pointer:hover {
  cursor: pointer;
}

.image-container {
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
  height:200px;
}

#app .image {
  display: block;
  object-fit: cover;
  height: 120%;
}
</style>
