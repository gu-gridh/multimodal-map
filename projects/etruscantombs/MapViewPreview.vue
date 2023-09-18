<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type {
  Image,
  ImageDeep,
} from "./types";
import type { DianaClient } from "@/assets/diana";
import OpenSeadragon from "@/components/OpenSeadragonSequence.vue";
import MapViewPreviewImage from "./MapViewPreviewImage.vue";
import MapViewPreviewModel from "./MapViewPreviewModel.vue";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>();
const imageUrls = ref<string[]>([]);
let text = ref(false)
let place = ref()
let description = ref("");


//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    place = JSON.parse(JSON.stringify(selectedFeature.value))
    const placeId = selectedFeature.value.getId();  // Get ID of selected place
    images.value = await diana.listAll<Image>("image", { place: placeId });  // Use place ID to fetch images
    imageUrls.value = images.value.map(image => `${image.iiif_file}/info.json`);
  } else {
    images.value = [];
    imageUrls.value = [];
  }
});

//deselecting place will close the preview
function deselectPlace() {
  selectedFeature.value = undefined;
}
</script>

<template>
  <div v-if="selectedFeature" class="mapview-preview">
    <div class="placecard">
      <div class="close-card-button" @click="deselectPlace">+</div>
      <div class="placecard-top">

        <OpenSeadragon :src="imageUrls" :key="imageUrls.join(',')" class="flex-1" />

        <!-- Code to list all images -->
        <!-- <router-link :to="`/place/${place.id_}`"
        v-for="image in images"
        :key="image.uuid"
        class="clickable"
      >
        <div class="image-container">
          <img
            :src="`${image.iiif_file}/full/500,/0/default.jpg`"
            class="image"
          />
        </div>
      </router-link> -->
      </div>

      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text">{{ selectedFeature.get("name") }}</div>
          <div class="placecard-subtitle theme-color-text">240</div>
          <button class="theme-button theme-color-background">3D model</button>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content" style="height:45px; overflow:hidden;">


            <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag theme-color-text">Grotte Tufarina</div>
            </div>
            <div class="metadata-item">
              <div class="label">Type:</div>
              <div class="tag theme-color-text">Tumulus</div>
            </div>
            <div class="metadata-item">
              <div class="label">Chambers:</div>
              <div class="tag theme-color-text">1</div>
            </div>
            <div class="metadata-item">
              <div class="label">Period:</div>
              <div class="tag theme-color-text">Before 650 BC</div>
            </div>


          </div>
        </div>
      </div>
      <div class="placecard-center-button">
        <router-link :to="`/place/${place.id_}`">
          <button class="theme-button" style="margin-top:20px;">More Info</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>

</style>
