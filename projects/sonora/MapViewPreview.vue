<script lang="ts" setup>
import { watchEffect, ref, inject, computed } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type {
  Image,
  ImageDeep,
  Tomb
} from "./types";
import type { DianaClient } from "@/assets/diana";
import OpenSeadragon from "@/components/OpenSeadragonNonPyramid.vue";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>();
const imageUrls = ref<string[]>([]);
const organNumbers = ref({}); //all the organ numbers returned 
const computedRoute = computed(() => `/place/${currentOrganNumber.value}`); //route for placeview
let currentOrganNumber = ref(0); //organ number corresponding to page in openseadragonviewer
let text = ref(false)
let place = ref()

const placeInfo = ref({
  Ort: '',
  Byggnadens_namn: '',
  Stift: '',
  Kontrakt: '',
  Kommun: '',
  Loc: '',
});

const handlePageChange = (newPage) => {
    currentOrganNumber.value = organNumbers.value[newPage];
    console.log(currentOrganNumber.value);
};

//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    const placeId = selectedFeature.value.get("number");
    place.value = { id_: placeId };
    try {
      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/place.php?id=${placeId}&lang=sv`);
      if (response.ok) {
        const data = await response.json();
        placeInfo.value = {
          Ort: data.Ort,
          Byggnadens_namn: data.Byggnadens_namn,
          Stift: data.Stift,
          Kontrakt: data.Kontrakt,
          Kommun: data.Kommun,
          Loc: data.loc1,
        };

        // Initialize the organNumbers and imageUrls arrays
        organNumbers.value = {};
        imageUrls.value = [];

          let i = 1;
          while (data[`orgnr${i}`]) {
            imageUrls.value.push(data[`orgph${i}`]);
            organNumbers.value[i] = data[`orgnr${i}`];
            i++;
          }

          if (i > 1) {
            currentOrganNumber.value = organNumbers.value[1];
          }
      } else {
        console.error('Failed to fetch place info');
      }
    } catch (error) {
      console.error('Error fetching place info:', error);
    }

  } else {
    images.value = [];
    imageUrls.value = [];
    organNumbers.value = {};
    // Reset placeInfo when no feature is selected
    placeInfo.value = { Ort: '', Byggnadens_namn: '' };
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

        <OpenSeadragon :src="imageUrls" :key="imageUrls.join(',')" @page-changed="handlePageChange" class="flex-1" />
      </div>

      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title theme-color-text">{{ placeInfo.Ort }}</div>
          <div class="placecard-subtitle theme-color-text">{{ placeInfo.Byggnadens_namn }}</div>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content">

            <div class="metadata-item">
              <div class="label">Stift:</div>
              <div class="tag theme-color-text">{{ placeInfo.Stift }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">Kontrakt:</div>
              <div class="tag theme-color-text">{{ placeInfo.Kontrakt }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">Kommun:</div>
              <div class="tag theme-color-text">{{ placeInfo.Kommun }}</div>
            </div>
            <div class="metadata-item">
              <div class="label">Loc:</div>
              <div class="tag theme-color-text">{{ placeInfo.Loc }}</div>
            </div>
            
          </div>
          
        </div>
        <div class="placecard-metadata-content">
            <div class="preview" v-html="description">
            </div>
          </div>
      </div>
      
      <div class="placecard-center-button">
      <router-link :to="computedRoute">
          <button class="theme-button" style="margin-top:0px;">{{ $t('moreinfo') }}</button>
      </router-link>
      </div>
    </div>
  </div>
</template>

<style>

</style>
