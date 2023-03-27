<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Array<Image>>();

watchEffect(async () => {
  if (selectedFeature.value) {
    const place = selectedFeature.value.get("comment");
    images.value = await diana.listAll<Image>("image", { place });
  } else {
    images.value = [];
  }
});
</script>

<template>
  <div v-if="selectedFeature" class="detail-view">
    <div class="px-8 py-6">
      <div class="close-button">+</div>
      <h3 class="">{{ selectedFeature.get("name") }}</h3>
      <div class="flex flex-col gap-2">
        <router-link
          v-for="image in images"
          :key="image.uuid"
          :to="`/detail/image/1`"
          class="clickable"
        >
          <div>
            <img
              :src="`${image.iiif_file}/full/380,/0/default.jpg`"
              class="image"
            />
            <div>{{ image.title }}</div>
            <div>{{ image.description }}</div>
            <div>{{ image.date }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
h3 {
  font-size: 35px;
  font-weight: 100;
  margin-left: -2px;
}

.image {
  margin-bottom: 8px;
}
</style>
