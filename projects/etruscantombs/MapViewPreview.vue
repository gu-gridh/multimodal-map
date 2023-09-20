<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type {
  Image,
  ImageDeep,
  Tomb
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
const necropolisName = ref<string | null>(null);  
const chambers = ref<number | null>(null);
const type = ref<string | null>(null);
const period = ref<string | null>(null);
const subtitle = ref<string | null>(null);



//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    const placeId = selectedFeature.value.getId();
    place.value = { id_: placeId };
    images.value = await diana.listAll<Image>("image", { tomb: placeId, depth: 2 });
    const filteredImages = images.value.filter(image => {
      return image.type_of_image.some(tag => tag.text === 'photograph'); //Only display images that are photographs
    });

    imageUrls.value = filteredImages.map(image => `${image.iiif_file}/info.json`);
    
    // If the API also returns tomb details in this call, assign it to tombDetail here
    if (images.value && images.value[0] && images.value[0].tomb) {
      necropolisName.value = images.value[0].tomb?.necropolis?.text || null;
      chambers.value = images.value[0].tomb.number_of_chambers || null;
      type.value = images.value[0].tomb.type.text || null;
      period.value = images.value[0].tomb.epoch.text || null;
      subtitle.value = images.value[0].tomb.subtitle.text || null;
    }
  } else {
    images.value = [];
    imageUrls.value = [];
    necropolisName.value = null;
    chambers.value = null;
    type.value = null;
    period.value = null;
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
          <div class="placecard-title theme-color-text">Tomb {{ selectedFeature.get("name") }}</div>
          <div class="placecard-subtitle theme-color-text">{{ selectedFeature.get("subtitle") }}</div>
          <button class="theme-button theme-color-background">3D model</button>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content" style="height:49px; overflow:hidden;">


            <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag theme-color-text">{{ necropolisName }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">Type:</div>
              <div class="tag theme-color-text">{{ type }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">Chambers:</div>
              <div class="tag theme-color-text">{{ chambers }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">Period:</div>
              <div class="tag theme-color-text">{{ period }}</div>
            </div>


          </div>
        </div>
      </div>
      <div class="placecard-center-button">
        <router-link :to="`/place/${place?.id_}`">
          <button class="theme-button" style="margin-top:20px;">More Info</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>

</style>
