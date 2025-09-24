<script setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import { etruscanStore } from "./settings/store";
import OpenSeadragon from "./MapViewPreviewImage.vue";
import apiConfig from "./settings/apiConfig"
import { DianaClient } from "./settings/diana.js";

const dianaClient = new DianaClient("etruscantombs");
const { selectedFeature } = storeToRefs(mapStore());
const etruscan = etruscanStore();
const images = ref();
const imageUrls = ref([]);
const necropolisName = ref(null);
const chambers = ref(null);
const type = ref(null);
const dataset = ref(null);
const period = ref(null);
const subtitle = ref(null);
const description = ref(null);
const siteName = ref(null);
const hasImages = ref(false);
let place = ref()

//when a place is selected, fetch image and info
watchEffect(async () => {
  necropolisName.value = null;
  chambers.value = null;
  type.value = null;
  period.value = null;
  subtitle.value = null;
  description.value = null;
  dataset.value = null;

  if (selectedFeature.value) {
    const placeName = selectedFeature.value.get("name");
    const placeId = selectedFeature.value.getId();
    etruscan.placeId = placeId;
    place.value = { id_: placeName };
    images.value = await dianaClient.listAll("image", { tomb: placeId, depth: 3, type_of_image: 2 });
    // If images are available
    if (images.value.length > 0) {
      hasImages.value = true;
      const filteredImages = images.value.filter(image => {
        return image.type_of_image.some(tag => tag.text === 'photograph'); //Only display images that are photographs
      });
      imageUrls.value = filteredImages.map(image => `${image.iiif_file}/info.json`);

      // Populate place details
      if (images.value[0].tomb) {
        necropolisName.value = images.value[0].tomb?.necropolis?.text || null;
        chambers.value = images.value[0].tomb?.number_of_chambers || null;
        dataset.value = images.value[0].tomb?.dataset.short_name || null;
        type.value = images.value[0].tomb?.type.text || null;
        period.value = images.value[0].tomb?.epoch.text || null;
        subtitle.value = images.value[0].tomb?.subtitle || null;
        description.value = images.value[0].tomb?.description || null;
        siteName.value = images.value[0].tomb?.necropolis?.site?.text || null;
      }
    } else {
      hasImages.value = false;
      imageUrls.value = [];
      // If no images are available, fetch details from `geojson/place` endpoint
      const response = await fetch(`${apiConfig.PLACE}?id=${placeId}&depth=2`);
      const geojsonData = await response.json();
      if (geojsonData.features.length > 0) {
        const feature = geojsonData.features[0];
        necropolisName.value = feature.properties.necropolis?.text || null;
        chambers.value = feature.properties.number_of_chambers || null;
        dataset.value = feature.properties.dataset?.short_name || null;
        type.value = feature.properties.type?.text || null;
        period.value = feature.properties.epoch?.text || null;
        subtitle.value = feature.properties.subtitle || null;
        description.value = feature.properties.description || null;
        siteName.value = feature.properties.necropolis.site.text || null;
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
          <!-- Render OpenSeadragon viewer only if hasImages is true -->
          <OpenSeadragon v-if="hasImages" :src="imageUrls" :key="imageUrls.join(',')" class="flex-1" />

          <!-- Render "No images available" div if hasImages is false -->
          <div v-else class="no-images">
            {{ $t('nophoto') }}
          </div>
        </div>

      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text theme-title-typography">
            {{ dataset ? (dataset + ' - ' + selectedFeature.get('name')) : selectedFeature.get('name') }}
          </div>
          <div class="placecard-subtitle theme-color-text theme-title-typography">{{ subtitle }}</div>
          <!-- <button class="theme-button theme-color-background">{{ $t('threedmodel') }}</button> -->
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">

            <div class="metadata-item">
              <div class="short-label">{{ $t('site') }}:</div>
              <div class="tag theme-color-text">{{ siteName }}</div>
            </div>

              <div class="metadata-item">
              <div class="label">{{ $t('dataset') }}:</div>
              <div v-if="dataset" class="dataset-tag">{{ dataset }}</div>
            </div>
           
            <div class="metadata-item">
              <div class="short-label">{{ $t('type') }}:</div>
              <div class="tag theme-color-text">{{ type }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">{{ $t('chambers') }}:</div>
              <div class="tag theme-color-text">{{ chambers }}</div>
            </div>
            
            <div class="metadata-item">
              <div class="short-label">{{ $t('period') }}:</div>
              <div class="tag theme-color-text">{{ period }}</div>
            </div>

             <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag theme-color-text">{{ necropolisName }}</div>
            </div>
         
          

          </div>

        </div>
        <!-- <div class="placecard-metadata-content">
          <div class="preview" v-html="description">
          </div>
        </div> -->
      </div>

      <div class="placecard-center-button">
        <router-link :to="`/${dataset}_${(place?.id_ || '').replace(/\s+/g, '_')}`">
          <button class="theme-button theme-color-background" style="margin-top:0px; padding:4px 12px">{{ $t('moreinfo') }}</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
.metadata-item {
  font-size:90%!important;
  display:flex!important;
  flex-direction: row!important;
  flex-wrap: nowrap!important;
}

.placecard-metadata-content .tag {
  float: left;
  padding-left: 10px;
  padding-right: 10px;
  width: 65%;
  /* text-transform: capitalize; */
  font-weight: 600;
}

@media screen and (max-width: 900px) {
  .placecard-title{
  font-size:9.0em;

}

.metadata-item {
  font-size:80%!important;
  display:flex!important;
  flex-direction: row!important;
  flex-wrap: nowrap!important;
}
}

.close-card-button{
    left: calc(45px);
    background-color:black;
    margin-top:12px!important;
  }
</style>
