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
import PreviewRephotography from "./MapViewPreviewRephotography.vue";
import PreviewImage from "./MapViewPreviewImage.vue";
import PreviewVideo from "./MapViewPreviewVideo.vue";
import { rephotographyStore } from "./store";


const { selectedFeature } = storeToRefs(mapStore());
const { years } = storeToRefs(rephotographyStore()); 
const diana = inject("diana") as DianaClient;

const images = ref<Image[]>();
const videos = ref<Video[]>();
const rephotographies = ref<RephotographyDeep[]>();

watchEffect(async () => {
  console.log("Range values: ", years.value);  

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
  <div v-if="selectedFeature" class="mapview-preview">
    <div class="px-8 py-6">
      <div class="close-button" @click="deselectPlace">+</div>
      <h3 class="">{{ selectedFeature.get("name") }}</h3>
      <div class="pointer">
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

#app .image-card {
  float:left;
  overflow: hidden;
  margin-bottom: 30px;
  width:100%;
  height:auto;
  padding:0px!important;
  transition: all 0.2s ease-in-out;
}

#app .image-container {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  width:100%;
  height:auto;
  padding:0px;
}

#app .image-card:hover {
transform:scale(1.03);
border-radius: 8px;
}

#app .image {
  display: block;
  transform:scale(1.1);
}

</style>
