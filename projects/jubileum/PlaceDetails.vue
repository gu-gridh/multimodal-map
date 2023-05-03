<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type {
  Image,
  ImageDeep,
} from "./types";
import type { DianaClient } from "@/assets/diana";
import PreviewImage from "./PreviewImage.vue";


const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Image[]>();

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
  <div v-if="selectedFeature" class="detail-view" @click="deselectPlace">
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
#app .detail-view {
  height: 100% !important;
  pointer-events: auto !important;
  overflow-y: scroll !important;
  padding-left: 30px;
  padding-bottom: 80px;
}

.place-title {
  font-family: "Josefin Sans", sans-serif !important;
  letter-spacing: -0.1rem;
  text-align: center;
  width: calc(100% - 20px);
  margin-bottom: -15px;
}

.place-title p {
  color: white;
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
  word-break: break-word;
  hyphens: auto;
  background-color: rgb(180, 100, 100);
  border-radius: 10px 10px 0 0;
  padding: 20px 25px 20px 25px;
  width: 100%;
  /*   border-style:dashed;
  border-width:0px 0pc 1px 0px;
Border-color:black; */
  opacity: 0.99;
  box-shadow: 0px -5px 10px 0 rgba(0, 0, 0, 0.2),
    0 0px 0px 0 rgba(0, 0, 0, 0.19);
}

.meta-container {
  color: black;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
  text-align: center;
  margin-top: 10px;
}

.image-card {
  width: auto;
  pointer-events: auto !important;
  border-radius: 20px;
  margin-right: 20px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: rgba(248, 249, 229, 0.95);
  box-shadow: 0px 0px 20px 0 rgba(0, 0, 0, 0.2),
    0 0px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.2s ease-in-out;
}

.image-card:hover .image-container {
  transform: scale(1.03);
  background-color: rgba(248, 249, 229, 1);
}

.image-card:hover .image {
}

.image-card:hover {
  background-color: rgba(248, 249, 229, 1);
}

.image-container {
  border-radius: 50%;
  overflow: hidden;
  width: 230px;
  height: 230px;
  transition: all 0.2s ease-in-out;
}

.image {
  display: block;
  object-fit: cover;
  height: 145%;
  margin-top: -20px;
}
</style>
