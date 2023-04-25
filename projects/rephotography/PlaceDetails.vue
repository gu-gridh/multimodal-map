<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type {
  Image,
  ImageDeep,
  Rephotography,
  RephotographyDeep,
  Video,
} from "./types";
import type { DianaClient } from "@/assets/diana";
import PreviewRephotography from "./PreviewRephotography.vue";
import PreviewImage from "./PreviewImage.vue";
import PreviewVideo from "./PreviewVideo.vue";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Image[]>();
const videos = ref<Video[]>();
const rephotographies = ref<RephotographyDeep[]>();

watchEffect(async () => {
  if (selectedFeature.value) {
    const place = selectedFeature.value.getId();
    images.value = await diana.listAll<Image>("image", { place });
    videos.value = await diana.listAll<Video>("video", { place });
    // Load Rephotographies in two steps because `depth` doesn't work yet.
    // TODO Implement `depth` instead
    const rephotographiesShallow = await diana.listAll<Rephotography>(
      "rephotography",
      { place }
    );
    const rephotographiesDeep: RephotographyDeep[] = [];
    for (const rephotography of rephotographiesShallow) {
      const [oldImage, newImage] = await Promise.all([
        diana.get<ImageDeep>("image", rephotography.old_image),
        diana.get<ImageDeep>("image", rephotography.new_image),
      ]);
      rephotographiesDeep.push({
        ...rephotography,
        old_image: oldImage,
        new_image: newImage,
      });
    }
    rephotographies.value = rephotographiesDeep;
  } else {
    images.value = [];
    rephotographies.value = [];
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
        <PreviewRephotography
          v-for="rephotography in rephotographies"
          :key="rephotography.old_image + ' ' + rephotography.new_image"
          :rephotography="rephotography"
        />

        <PreviewVideo
          v-for="video in videos"
          :key="video.uuid"
          :video="video"
        />

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
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  height:200px;
}

#app .image {
  display: block;
  object-fit: cover;
  height: 100%;
}
</style>
