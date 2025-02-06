<script setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import OpenSeadragon from "./MapViewPreviewImage.vue";
import apiConfig from "./settings/apiConfig"

let panel = ref();
const { selectedFeature } = storeToRefs(mapStore());
const sophia = inject("sophia");
const images = ref();
const imageUrls = ref([]);
const room = ref(null);
const documentation = ref(null);
const number_of_inscriptions = ref(null);
const languages = ref();
const tags = ref();
const emit = defineEmits(["deselect-surface"]);

//When a place is selected, fetch image and info
watchEffect(async () => {
  documentation.value = null;
  if (selectedFeature.value) {
    const featureId = selectedFeature.value.getId();
    panel.value = await sophia.list("panel", { id: featureId });
    number_of_inscriptions.value = panel.value.results[0].number_of_inscriptions
    languages.value = panel.value.results[0].list_of_languages.length
    tags.value = panel.value.results[0].tags.length;

    images.value = await sophia.listAll("image", { panel: featureId, depth: 2 });
    // If images are available
    if (images.value.length > 0) {
      const filteredImages = images.value.filter(image => {
        return (image.type_of_image.text === 'Orthophoto' | image.type_of_image.text === 'Topography') //Only display images that are orthophoto
      });
      imageUrls.value = filteredImages.map(image => `${image.iiif_file}/info.json`);

      // Populate place details
      if (images.value[0].panel) {
        room.value = images.value[0].panel.room || null;
      }
    } else {
      imageUrls.value = [];
      // If no images are available, fetch details from `geojson/place` endpoint
      const response = await fetch(`${apiConfig.PANEL}?id=${featureId}`);
      const geojsonData = await response.json();
      if (geojsonData.features.length > 0) {
        const feature = geojsonData.features[0];
        room.value = feature.properties.room || null;
        documentation.value = feature.properties.documentation || null;
      }
    }
  } else {
    images.value = [];
    imageUrls.value = [];
  }
});

//Deselecting place will close the preview
function deselectPlace() {
  selectedFeature.value = undefined;
  emit("deselect-surface");
}
</script>

<template>
  <div v-if="selectedFeature && imageUrls.length > 0" class="mapview-preview">
    <div class="placecard">
      <div class="close-card-button" @click="deselectPlace"
        style="font-family: Barlow Condensed, sans-serif !important;">+</div>
      <div class="placecard-top">
        <OpenSeadragon :src="imageUrls" :key="imageUrls.join(',')" class="flex-1" />
      </div>

      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text theme-title-typography">{{ $t('panel') }} {{
            selectedFeature.get("title") }}</div>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">

            <div class="metadata-group">
              <div class="metadata-item">
                <div class="label">{{ $t('inscriptions') }}:</div>
                <div class="tag theme-color-text">{{ number_of_inscriptions }}</div>
              </div>

              <div class="metadata-item">
                <div class="label">{{ $t('languages') }}:</div>
                <div class="tag theme-color-text">{{ languages }}</div>
              </div>
            </div>

            <div class="metadata-group">
              <div class="metadata-item">
                <div class="label">{{ $t('medium') }}:</div>
                <div class="tag theme-color-text">Wall</div>
              </div>

              <div class="metadata-item">
                <div class="label">{{ $t('material') }}:</div>
                <div class="tag theme-color-text">Plaster</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="placecard-center-button">
        <a :href="`https://saintsophia.dh.gu.se/viewer/?q=${selectedFeature.get('title')}/orthophoto`">
          <button class="theme-button theme-color-background" style="margin-top:0px;">{{ $t('exploreData') }}</button>
        </a>
      </div>
    </div>
  </div>
</template>

<style> /* override */
.placecard-metadata-content {
  display: flex;
  flex-direction: row;
}

.metadata-group {
  display: flex;
  flex-direction: column;
}

.metadata-item {
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
  width: auto;
  margin-right: 30px;
}

.label {
  width: auto !important;
  margin-right: 0px !important;
}

.tag {
  margin-left: 0px;
  padding: 0px !important;
  width: auto !important;
}

.close-card-button {
  left: calc(45px);
}

.osd {
  background-color: black !important;
}
</style>