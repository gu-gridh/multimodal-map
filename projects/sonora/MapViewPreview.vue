<script lang="ts" setup>
import { watchEffect, ref, inject, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { sonoraStore } from "./store";
import { mapStore } from "@/stores/store";
import type {
  Image
} from "./types";
import type { DianaClient } from "@/assets/diana";
import OpenSeadragon from "@/components/OpenSeadragonNonPyramid.vue";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>();
const imageUrls = ref<string[]>([]);
const organNumbers = ref({}); //all the organ numbers returned 
const computedRoute = computed(() => `/place/${currentOrganNumber.value}`); //route for placeview

const { selectedBuilderId, archiveLayerVisible } = storeToRefs(sonoraStore());
const builderData = ref(null);
const lastInteraction = ref('none'); // 'none', 'place', or 'builder'

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
    lastInteraction.value = 'place';
    selectedBuilderId.value = null;
    const placeId = selectedFeature.value.get("number") ?? selectedFeature.value.get("place_nr");
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

//when a builder is selected, fetch info
watch(selectedBuilderId, async (newId) => {
  if (newId) {
    archiveLayerVisible.value = true;
    lastInteraction.value = 'builder';
    selectedFeature.value = undefined;
    try {
      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/builder.php?id=${newId}&lang=sv`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      builderData.value = await response.json();
      console.log(builderData.value);
    } catch (error) {
      console.error('Error fetching builder data:', error);
    }
  } else {
    builderData.value = null;
  }
});

//deselecting place will close the preview
function deselectPlace() { // Reset interaction states
  selectedFeature.value = undefined;
  selectedBuilderId.value = null;
  lastInteraction.value = 'none';
  archiveLayerVisible.value = false;
}
</script>

<template>
  <div v-if="lastInteraction === 'place' && selectedFeature" class="mapview-preview">
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
            <div class="metadata-item" v-if="placeInfo.builder1">
              <div class="label">Builder:</div>
              <div class="tag theme-color-text">{{ placeInfo.builder1 }}</div>
            </div>
            <div class="metadata-item" v-if="placeInfo.year1">
              <div class="label">Year:</div>
              <div class="tag theme-color-text">{{ placeInfo.year1 }}</div>
            </div>
            <div class="metadata-item" v-if="placeInfo.loc1">
              <div class="label">Loc:</div>
              <div class="tag theme-color-text">{{ placeInfo.loc1 }}</div>
            </div>
            <div class="metadata-item" v-if="placeInfo.Stift">
              <div class="label">Stift:</div>
              <div class="tag theme-color-text">{{ placeInfo.Stift }}</div>
            </div>
            <div class="metadata-item" v-if="placeInfo.Kontrakt">
              <div class="label">Kontrakt:</div>
              <div class="tag theme-color-text">{{ placeInfo.Kontrakt }}</div>
            </div>
            <div class="metadata-item" v-if="placeInfo.Kommun">
              <div class="label">Kommun:</div>
              <div class="tag theme-color-text">{{ placeInfo.Kommun }}</div>
            </div>
            <div class="metadata-item" v-if="placeInfo.Pastorat">
              <div class="label">Pastorat:</div>
              <div class="tag theme-color-text">{{ placeInfo.Pastorat }}</div>
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
  <div v-else-if="lastInteraction === 'builder' && builderData" class="mapview-preview">
    <div class="placecard">
      <div class="close-card-button" @click="deselectPlace">+</div>
      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title-builder theme-color-text">{{ builderData.Verksgrundare }}</div>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content" v-if="builderData.Biografi">
            <div class="builder-label">Biografi</div>
            <div class="metadata-item-wide">
              <div class="biography">{{ builderData.Biografi }}</div>
            </div>
          </div>
          
        </div>
        <div class="placecard-metadata-content">
            <div class="preview" v-html="description">
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style>
.metadata-item-wide {
  margin-bottom: 5px;
  float: left;
  width: 100%;
}

.metadata-item-wide {
  width: 100%;
}

.placecard-title-builder {
  margin-top:50px;
  font-size:2.5vw;
  text-align:center;
  font-weight:200;
  padding:10px;
}

.builder-label{
  font-size:1.5vw;
  margin-top:20px;
  text-align:center;
}

.biography{
  text-align:justify;
  padding:10px;
}
</style>
