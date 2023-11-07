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
const description = ref<string | null>(null);

//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    const placeId = selectedFeature.value.getId();
    place.value = { id_: placeId };
    images.value = await diana.listAll<Image>("image", { tomb: placeId, depth: 2 });

    // If images are available
    if (images.value.length > 0) {
      const filteredImages = images.value.filter(image => {
        return image.type_of_image.some(tag => tag.text === 'photograph'); //Only display images that are photographs
      });
      imageUrls.value = filteredImages.map(image => `${image.iiif_file}/info.json`);
      
      // Populate place details
      if (images.value[0].tomb) {
        necropolisName.value = images.value[0].tomb?.necropolis?.text || null;
        chambers.value = images.value[0].tomb.number_of_chambers || null;
        type.value = images.value[0].tomb.type.text || null;
        period.value = images.value[0].tomb.epoch.text || null;
        subtitle.value = images.value[0].tomb.subtitle || null;
        description.value = images.value[0].tomb.description || null;
      }
    } else {
      imageUrls.value = [];
      // If no images are available, fetch details from `geojson/place` endpoint
      const response = await fetch(`https://diana.dh.gu.se/api/etruscantombs/geojson/place/?id=${placeId}`);
      const geojsonData = await response.json();
      if (geojsonData.features.length > 0) {
        const feature = geojsonData.features[0];
        necropolisName.value = feature.properties.necropolis.text || null;
        chambers.value = feature.properties.number_of_chambers || null;
        type.value = feature.properties.type.text || null;
        period.value = feature.properties.epoch.text || null;
        subtitle.value = feature.properties.subtitle || null;
        description.value = feature.properties.description || null;
      }
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
          <div class="placecard-title theme-color-text">{{ $t('tomb') }} {{ selectedFeature.get("name") }}</div>
          <div class="placecard-subtitle theme-color-text">{{ selectedFeature.get("subtitle") }}</div>
          <!-- <button class="theme-button theme-color-background">{{ $t('threedmodel') }}</button> -->
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">


            <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag theme-color-text">{{ necropolisName }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">{{ $t('type') }}:</div>
              <div class="tag theme-color-text">{{ type }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">{{ $t('chambers') }}:</div>
              <div class="tag theme-color-text">{{ chambers }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">{{ $t('period') }}:</div>
              <div class="tag theme-color-text">{{ period }}</div>
            </div>
            
          </div>
          
        </div>
        <div class="placecard-metadata-content">
            <div class="preview" v-html="description">
            </div>
          </div>
      </div>
      
      <div class="placecard-center-button">
        <router-link :to="`/place/${place?.id_}`">
          <button class="theme-button" style="margin-top:0px;">{{ $t('moreinfo') }}</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>

</style>