<script setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import PreviewRephotography from "./MapViewPreviewRephotography.vue";
import PreviewImage from "./MapViewPreviewImage.vue";
import PreviewVideo from "./MapViewPreviewVideo.vue";
import PreviewObservation from "./MapViewPreviewObservation.vue";
import { DianaClient } from "./settings/diana.js";

const diana = new DianaClient("rephotography");
const { selectedFeature } = storeToRefs(mapStore());
const images = ref();
const videos = ref();
const observations = ref();
const focusedFeatures = ref([]);
const rephotographies = ref();

(async function fetchFocusedFeatures() {
  const response = await fetch('https://diana.dh.gu.se/api/rephotography/geojson/focus/');
  const json = await response.json();
  focusedFeatures.value = json.features.map((feature) => feature.id);
})();

function isFeatureFocused(id) {
  return focusedFeatures.value.includes(id);
}

watchEffect(async () => {
  images.value = [];
  videos.value = [];
  observations.value = [];
  rephotographies.value = [];

  if (selectedFeature.value) {
    const id = selectedFeature.value.getId();

    if (id) {
      const isFocus = isFeatureFocused(id);
      const queryParam = isFocus ? { focus: id } : { place: id };

      images.value = await diana.listAll("image", queryParam);
      videos.value = await diana.listAll("video", queryParam);
      try {
        observations.value = await diana.listAll("observation", { place: id });
      } catch (error) {
        console.error('Failed to fetch observations for place', id, error);
      }
      if (isFocus) {
        // direct fetch from the rephotography focus API
        const response = await fetch(`https://diana.dh.gu.se/api/rephotography/rephotography/focus/?focus_id=${id}&depth=2`);
        const json = await response.json();
        rephotographies.value = json.results.map((rephotography) => {
          return {
            ...rephotography,
            old_image: rephotography.old_image,
            new_image: rephotography.new_image,
          };
        });
      } else {
        // Load Rephotographies in two steps because `depth` doesn't work yet.
        const rephotographiesShallow = await diana.listAll("rephotography", { place: id });
        const rephotographiesDeep = [];
        for (const rephotography of rephotographiesShallow) {
          const [oldImage, newImage] = await Promise.all([
            diana.get("image", rephotography.old_image),
            diana.get("image", rephotography.new_image),
          ]);
          rephotographiesDeep.push({
            ...rephotography,
            old_image: oldImage,
            new_image: newImage,
          });
        }

        rephotographies.value = rephotographiesDeep;
      }
    }
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
      <h3 class="previewplace">{{ selectedFeature.get("name") }}</h3>
      <div class="pointer">
        <PreviewRephotography v-for="rephotography in rephotographies"
          :key="rephotography.old_image + ' ' + rephotography.new_image" :rephotography="rephotography" />
        <PreviewVideo v-for="video in videos" :key="video.uuid" :video="video" />
        <PreviewImage v-for="image in images" :key="image.uuid" :image="image" />
        <PreviewObservation v-for="observation in observations" :key="observation.id" :observation="observation" />
      </div>
    </div>
  </div>
</template>

<style>
#app .mapview-preview {
  padding-bottom: 80px;
  font-size: 16px;
}

#app .mapview-preview {
  pointer-events: auto !important;
  padding-left: 0px;
}

#app h3 {
  font-size: 34px;
  line-height: 1;
  font-weight: 200;
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
  float: left;
  overflow: hidden;
  margin-bottom: 30px;
  width: 100%;
  height: auto;
  padding: 0px !important;
  transition: all 0.2s ease-in-out;
}

#app .image-container {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px !important;
  width: 100%;
  height: auto !important;
  border-radius: 8px !important;
  content: contain;
  padding: 0px;
}

#app .image-card:hover {
  transform: scale(1.03);
  border-radius: 8px;
}

#app .image {
  display: block;
  transform: scale(1.3);
}
</style>
