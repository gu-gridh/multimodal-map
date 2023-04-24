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
    const place = selectedFeature.value.getId();
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
      :to="`/detail/image/${image.id}`"
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
  width: calc(100% - 20px);
  margin-bottom: -15px;
}

.place-title p {
  color: black;
  font-size: 25px;
  font-weight: 600;
  line-height:1.0;
  word-break: break-word;
  hyphens: auto;
  background-color: rgba(248, 249, 229, 1);
  border-radius: 10px 10px 0 0;
  padding: 20px 25px 20px 25px;
  width: 100%;
  border-style:dotted;
  border-width:0px 0pc 1px 0px;
Border-color:black;
  backdrop-filter: blur(3px);
  box-shadow: 5px -5px 10px 0 rgba(0, 0, 0, 0.2), 0 0px 0px 0 rgba(0, 0, 0, 0.19);
}

.meta-container {
  color: black;
  font-weight: 400;
  font-size: 20px;
  line-height:1.0;
  text-align: center;
  margin-top: 10px;
}

.image-card {
  width: auto;
  border-radius: 20px;
  margin-right:20px;
  padding: 20px;
  margin-bottom:20px;
  background-color: rgba(248, 249, 229, 1);
  box-shadow: 5px 10px 10px 0 rgba(0, 0, 0, 0.2), 0 0px 10px 0 rgba(0, 0, 0, 0.19);

}

.image-container {
  border-radius: 50%;
  overflow:hidden;
  width: 200px;
  height: 200px;
}

.image {
  display: block;
  object-fit: cover;
  height: 145%;
  margin-top:-20px;
}

#app .detail-view {
  height: 100vh !important;
  pointer-events: auto!important;
  overflow-y: scroll !important;
}
</style>
