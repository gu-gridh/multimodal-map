<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Image, Rephotography } from "./types";
import type { DianaClient } from "@/assets/diana";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Array<Image>>();
const rephotographies = ref<Array<Rephotography>>();

watchEffect(async () => {
  if (selectedFeature.value) {
    const place = selectedFeature.value.get("comment");
    images.value = await diana.listAll<Image>("image", { place });
    rephotographies.value = await diana.listAll<Rephotography>(
      "rephotography",
      { place }
    );
  } else {
    images.value = [];
    rephotographies.value = [];
  }
});
</script>

<template>
  <div v-if="selectedFeature" class="col-start-5 col-span-2">
    <div class="bg-white rounded-lg shadow-lg mb-4">
      <div class="px-8 py-6">
        <h3 class="font-bold">{{ selectedFeature.get("name") }}</h3>
        <div class="flex flex-col gap-2">
          <router-link
            v-for="rephotography in rephotographies"
            :key="rephotography.old_image + ' ' + rephotography.new_image"
            :to="`/detail/rephotography/1`"
            class="clickable"
          >
            <div>
              <div>(Rephotography)</div>
              <div>{{ rephotography.old_image }}</div>
              <div>{{ rephotography.new_image }}</div>
            </div>
          </router-link>

          <router-link
            v-for="image in images"
            :key="image.uuid"
            :to="`/detail/image/1`"
            class="clickable"
          >
            <div>
              <img :src="`${image.iiif_file}/full/380,/0/default.jpg`" />
              <div>{{ image.title }}</div>
              <div>{{ image.description }}</div>
              <div>{{ image.date }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
