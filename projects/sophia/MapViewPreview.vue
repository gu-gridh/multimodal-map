<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import { inscriptionsStore } from "./store";
import type {
  Image,
} from "./types";
import type { SophiaClient } from "@/assets/saintsophia";
import OpenSeadragon from "@/components/OpenSeadragonSequence.vue";
import apiConfig from "./apiConfig"

const { selectedFeature } = storeToRefs(mapStore());
const { placeId } = storeToRefs(inscriptionsStore());
const inscriptions = inscriptionsStore();
const sophia = inject("inscriptions") as SophiaClient;
const images = ref<Image[]>();
const imageUrls = ref<string[]>([]);
let text = ref(false)
let place = ref()
const type = ref<string | null>(null);
const subtitle = ref<string | null>(null);
const description = ref<string | null>(null);
const hasImages = ref<boolean>(false);

//when a place is selected, fetch image and info
watchEffect(async () => {
  type.value = null;
  subtitle.value = null;
  description.value = null;
  if (selectedFeature.value) {
    const placeName = selectedFeature.value.get("name");
    const placeId = selectedFeature.value.getId();
    inscriptions.placeId = placeId as string | null;
    place.value = { id_: placeName };
    images.value = await inscriptions.listAll<Image>("image", { panel: placeId, depth: 2, type_of_image: 2 });
    // If images are available
    if (images.value.length > 0) {
      hasImages.value = true;
      const filteredImages = images.value.filter(image => {
        return image.type_of_image.some(tag => tag.text === 'orthophoto'); //Only display images that are photographs
      });
      imageUrls.value = filteredImages.map(image => `${image.iiif_file}/info.json`);

      // Populate place details
      if (images.value[0].panel) {
        //type.value = images.value[0].tomb.type.text || null;
        // period.value = images.value[0].tomb.epoch.text || null;
        subtitle.value = images.value[0].panel.subtitle || null;
        description.value = images.value[0].panel.description || null;
      }
    } else {
      hasImages.value = false;
      imageUrls.value = [];
      // If no images are available, fetch details from `geojson/place` endpoint
      const response = await fetch(`${apiConfig.PANEL}?id=${placeId}`);
      const geojsonData = await response.json();
      if (geojsonData.features.length > 0) {
        const feature = geojsonData.features[0];
        type.value = feature.properties.type?.text || null;
        // period.value = feature.properties.epoch?.text || null;
        subtitle.value = feature.properties.subtitle || null;
        description.value = feature.properties.description || null;
      }
    }
  } else {
    images.value = [];
    imageUrls.value = [];
    type.value = null;
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
          <!-- Render OpenSeadragon viewer only if hasImages is true -->
          <OpenSeadragon v-if="hasImages" :src="imageUrls" :key="imageUrls.join(',')" class="flex-1" />

          <!-- Render "No images available" div if hasImages is false -->
          <div v-else class="no-images">
            {{ $t('nophoto') }}
          </div>
        </div>

      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text theme-title-typography">{{ $t('panel') }} {{ selectedFeature.get("name") }}</div>
          <div class="placecard-subtitle theme-color-text theme-title-typography">{{ subtitle }}</div>
          <!-- <button class="theme-button theme-color-background">{{ $t('threedmodel') }}</button> -->
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">

          
            <div class="metadata-item">
              <div class="short-label">{{ $t('type') }}:</div>
              <div class="tag theme-color-text"></div>
            </div>
            <div class="metadata-item">
              <div class="short-label">{{ $t('languages') }}:</div>
              <div class="tag theme-color-text"></div>
            </div>
            <div class="metadata-item">
              <div class="label">{{ $t('inscriptions') }}:</div>
              <div class="tag theme-color-text"></div>
            </div>
            <div class="metadata-item">
              <div class="short-label">{{ $t('room') }}:</div>
              <div class="tag theme-color-text"></div>
            </div>

          </div>

        </div>
        <div class="placecard-metadata-content">
          <div class="preview" v-html="description">
          </div>
        </div>
      </div>

      <div class="placecard-center-button">
        <router-link :to="`${(place?.id_ || '').replace(/ /g, '_')}`">
    <button class="theme-button theme-color-background" style="margin-top:0px;">{{ $t('moreinfo') }}</button>
</router-link>
      </div>
    </div>
  </div>
</template>

<style>

</style>
