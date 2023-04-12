<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Image, Rephotography, RephotographyDeep } from "./types";
import type { DianaClient } from "@/assets/diana";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Array<Image>>();
const rephotographies = ref<Array<RephotographyDeep>>();

watchEffect(async () => {
  if (selectedFeature.value) {
    const place = selectedFeature.value.get("comment");
    images.value = await diana.listAll<Image>("image", { place });
    // Load Rephotographies in two steps because `depth` doesn't work yet.
    // TODO Implement `depth` instead
    const rephotographiesShallow = await diana.listAll<Rephotography>(
      "rephotography",
      { place }
    );
    const rephotographiesDeep: RephotographyDeep[] = [];
    for (const rephotography of rephotographiesShallow) {
      const [oldImage, newImage] = await Promise.all([
        diana.get<Image>("image", rephotography.old_image),
        diana.get<Image>("image", rephotography.new_image),
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
</script>

<template>
  <div v-if="selectedFeature" class="detail-view">
    <div class="px-8 py-6">
      <div class="close-button">+</div>
      <h3 class="">{{ selectedFeature.get("name") }}</h3>
      <div class="flex flex-col gap-2">
        <router-link
          v-for="rephotography in rephotographies"
          :key="rephotography.old_image + ' ' + rephotography.new_image"
          :to="`/detail/rephotography/1`"
          class="clickable"
        >
          <div>
            <div class="split-image">
              <img
                :src="`${rephotography.old_image.iiif_file}/full/380,/0/default.jpg`"
                class="image"
              />
              <img
                :src="`${rephotography.new_image.iiif_file}/full/380,/0/default.jpg`"
                class="image"
              />
            </div>
          </div>
          <div class="flex justify-between">
            <div>
              <div>{{ rephotography.old_image.title }}</div>
              <div>{{ rephotography.old_image.description }}</div>
              <div>{{ rephotography.old_image.date }}</div>
            </div>
            <div class="text-right">
              <div>{{ rephotography.new_image.title }}</div>
              <div>{{ rephotography.new_image.description }}</div>
              <div>{{ rephotography.new_image.date }}</div>
            </div>
          </div>
        </router-link>

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
</style>
