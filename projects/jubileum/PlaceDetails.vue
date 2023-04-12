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
    <div class="place-title">
      <p>{{ selectedFeature.get("name") }}</p>
    </div>

    <router-link
      v-for="image in images"
      :key="image.uuid"
      :to="`/detail/image/1`"
      class="clickable"
    >
      <div class="image-card">
        <div>
          <div class="image-container">
            <img
              :src="`${image.iiif_file}/full/380,/0/default.jpg`"
              class="image"
            />
          </div>
          <div class="meta-container">
            <div>{{ image.title }}</div>
            <div>{{ image.date }}</div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.place-title {
  text-align: center;
  width: 100%;
  margin-bottom: 15px;
}

.place-title p {
  color: white;
  font-size: 25px;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;

  padding: 10px 25px 10px 25px;
  width: 100%;
  display: inline;
  backdrop-filter: blur(3px);
}

.meta-container {
  color: black;
  font-weight: 400;
  font-size: 20px;
  text-align: center;
  margin-top: 10px;
}

.image-card {
  width: auto;
  border-radius: 20px;
  padding: 20px;
  background-color: rgba(248, 249, 229, 1);
  box-shadow: 0 0px 40px 0 rgba(0, 0, 0, 0.2), 0 0px 40px 0 rgba(0, 0, 0, 0.19);
}

.image-container {
  border-radius: 50%;
  overflow: hidden;
  width: 200px;
  height: 200px;
}

.image {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
