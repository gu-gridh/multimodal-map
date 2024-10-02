<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

const { selectedFeature } = storeToRefs(mapStore());
const imageUrls = ref<string[]>([]);
let place = ref()

const hasImages = ref<boolean>(false);

//when a place is selected, fetch image and info
watchEffect(() => {
  if (selectedFeature.value) {
    console.log(`Selected feature ID: ${selectedFeature.value}`);
  } else {
    console.log("No feature selected");
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
      </div>
      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text theme-title-typography">ID: {{ selectedFeature }}</div>
          <div class="placecard-subtitle theme-color-text theme-title-typography">Test Subtitle</div>
          <!-- <button class="theme-button theme-color-background">{{ $t('threedmodel') }}</button> -->
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">
            <div class="metadata-item">
              <div class="short-label">Site:</div>
              <div class="tag theme-color-text">...</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
</template>

<style>
</style>
