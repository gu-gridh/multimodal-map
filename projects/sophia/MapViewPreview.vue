<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import { inscriptionsStore } from "./store";
import type {
  Image, Panel,
} from "./types";
import type { SophiaClient } from "@/assets/saintsophia";
import OpenSeadragon from "@/components/OpenSeadragonSequence.vue";
import apiConfig from "./apiConfig"

const { selectedFeature } = storeToRefs(mapStore());
// const { panelId } = storeToRefs(inscriptionsStore());
const inscriptions = inscriptionsStore();
const sophia = inject("sophia") as SophiaClient;
const images = ref<Image[]>();
const imageUrls = ref<string[]>([]);
let text = ref(false)
let panel = ref()// ref<Panel[]>();
// const type = ref<string | null>(null);
// const subtitle = ref<string | null>(null);
const room = ref<string | null>(null);
const documentation = ref<string | null>(null);
const hasImages = ref<boolean>(false);

//when a place is selected, fetch image and info
watchEffect(async () => {
  // type.value = null;
  // subtitle.value = null;
  documentation.value = null;
  if (selectedFeature.value) {
    const panelTitle = selectedFeature.value.get("title");
    const panelId = selectedFeature.value.getId();
    inscriptions.panelId = panelId as string | null;
    panel.value = { id_: panelTitle };
    images.value = await sophia.listAll<Image>("image", { panel: panelId, depth: 2});
    // If images are available
    if (images.value.length > 0) {
      hasImages.value = true;
      // const filteredImages = images.value.filter(image => {
      //   return image.type_of_image.some(tag => tag.text === 'Orthophoto'); //Only display images that are orthophoto
      // });
      imageUrls.value = images.value.map(image => `${image.iiif_file}/info.json`);// filteredImages.map(image => `${image.iiif_file}/info.json`);

      // Populate place details
      if (images.value[0].panel) {
        room.value = images.value[0].room || null;
        // type.value = images.value[0].tomb.type.text || null;
        // period.value = images.value[0].tomb.epoch.text || null;
        // subtitle.value = images.value[0].panel.subtitle || null;
        documentation.value = images.value[0].panel.documentation || null;
      }
    } else {
      hasImages.value = false;
      imageUrls.value = [];
      // If no images are available, fetch details from `geojson/place` endpoint
      const response = await fetch(`${apiConfig.PANEL}?id=${panelId}`);
      const geojsonData = await response.json();
      if (geojsonData.features.length > 0) {
        const feature = geojsonData.features[0];
        room.value = feature.properties.room || null;
        // type.value = feature.properties.type?.text || null;
        // period.value = feature.properties.epoch?.text || null;
        // subtitle.value = feature.properties.subtitle || null;
        documentation.value = feature.properties.documentation || null;
      }
    }
  } else {
    images.value = [];
    imageUrls.value = [];
    // type.value = null;
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
          <div class="placecard-title theme-color-text theme-title-typography">{{ $t('Panel') }} {{ selectedFeature.get("title") }}</div>
          <!-- <div class="placecard-subtitle theme-color-text theme-title-typography">{{ room }}</div> -->
          <!-- <button class="theme-button theme-color-background">{{ $t('threedmodel') }}</button> -->
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content" >
            <div class="metadata-item">
              <div class="label">{{ $t('inscriptions') }}:</div>
              <div class="tag theme-color-text"></div>
            </div>

            <div class="metadata-item">
              <div class="short-label">{{ $t('languages') }}:</div>
              <div class="tag theme-color-text"></div>
            </div>
          
            <div class="metadata-item">
              <div class="short-label">{{ $t('room') }}: </div>
              <div class="tag theme-color-text">{{ room }}</div>
            </div>

            <div class="metadata-item">
              <div class="short-label">{{ $t('tags') }}: </div>
              <div class="tag theme-color-text"></div>
            </div>

          </div>

        </div>
        <div class="placecard-metadata-content">
          <div class="preview" v-html="documentation">
          </div>
        </div>
      </div>

      <div class="placecard-center-button">
        <router-link :to="`${(panel?.id_ || '').replace(/ /g, '_')}`">
    <button class="theme-button theme-color-background" style="margin-top:0px;">{{ $t('moreinfo') }}</button>
</router-link>
      </div>
    </div>
  </div>
</template>

<style>
.osd{
  background-color:black!important;
}
</style>
