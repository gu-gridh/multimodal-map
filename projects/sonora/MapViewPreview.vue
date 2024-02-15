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
import placeholderImage from './images/placeholder.png';

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;
const imageUrls = ref<string[]>([]);
const organNumbers = ref({}); //all the organ numbers returned 
const computedRoute = computed(() => `/place/${currentOrganNumber.value}`); //route for placeview

const { selectedBuilderId, builderLayerVisible, placeClicked } = storeToRefs(sonoraStore());
const builderData = ref(null);
const lastInteraction = ref('none'); //'none', 'place', or 'builder'
const responseData = ref<null | Record<string, any>>(null);

let currentOrganNumber = ref(0); //organ number corresponding to page in openseadragonviewer
let text = ref(false)
let place = ref()

//for filtering out the date from the Builder Name and putting it on a new line
const builderNameAndDate = computed(() => {
  if (builderData.value && builderData.value.Verksgrundare) {
    let parts = builderData.value.Verksgrundare.split("(");
    let namePart = parts[0].trim();
    // Remove the comma if present
    if (namePart.endsWith(',')) {
      namePart = namePart.slice(0, -1);
    }
    let datePart = parts.length > 1 ? parts[1].split(")")[0].trim() : '';
    return { name: namePart, date: datePart };
  }
  return { name: '', date: '' };
});

const handlePageChange = (newPage) => {
  currentOrganNumber.value = organNumbers.value[newPage];
  if (responseData.value) {
    responseData.value.Loc = responseData.value[`loc${newPage}`] || ''; // update loc based on page
  }
};

//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    lastInteraction.value = 'place';
    selectedBuilderId.value = null;
    const placeId = selectedFeature.value.get("number") ?? selectedFeature.value.get("place_nr") ?? selectedFeature.value.get("Nr");
    place.value = { id_: placeId };
    try {
      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/place.php?id=${placeId}&lang=sv`);
      if (response.ok) {
        const data = await response.json();
        responseData.value = data;

        if (responseData.value) {
          responseData.value.Loc = data.loc1 || '';
        }
        // Initialize the organNumbers and imageUrls arrays
        organNumbers.value = {};
        imageUrls.value = [];

           let i = 1;
          while (data[`orgnr${i}`]) {
            const imageUrl = data[`orgph${i}`] ? data[`orgph${i}`] : placeholderImage; //if no images were found, use the placeholder
            imageUrls.value.push(imageUrl);
            organNumbers.value[i] = data[`orgnr${i}`];
            i++;
          }

          if (imageUrls.value.length === 0) {
            //if no images were found, use the placeholder
            imageUrls.value.push(placeholderImage);
          }

          if (i > 1) {
            currentOrganNumber.value = organNumbers.value[1];
          }
      } else {
        imageUrls.value = [placeholderImage];
        organNumbers.value = {};
        responseData.value = {};
      }
    } catch (error) {
      console.error('Error fetching place info:', error);
    }

  } else {
    imageUrls.value = [];
    organNumbers.value = {};
    responseData.value = {};
  }
});

//when a builder is selected, fetch info
watch(selectedBuilderId, async (newId) => {
  if (newId) {
    builderLayerVisible.value = true;
    lastInteraction.value = 'builder';
    selectedFeature.value = undefined;
    try {
      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/builder.php?id=${newId}&lang=sv`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      builderData.value = await response.json();
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
  builderLayerVisible.value = false;
}

//deselect builder when a place is clicked in the search results
watch(() => placeClicked.value, (newValue) => {
  if (newValue) {
    selectedBuilderId.value = null;
    builderLayerVisible.value = false;
    placeClicked.value = false;
  }
});
</script>

<template>
  <div v-if="lastInteraction === 'place' && selectedFeature" class="mapview-preview">
    <div class="placecard">
      <div class="close-card-button" @click="deselectPlace">+</div>
        <div class="placecard-top">
          <OpenSeadragon :src="imageUrls" :key="imageUrls.join(',')" @page-changed="handlePageChange" class="flex-1" />
        </div>
        <div class="placecard-bottom">
        <div class="placecard-text" v-if="responseData">
          <div class="placecard-title theme-color-text">{{ responseData.Byggnadens_namn }}</div>
          <div class="placecard-subtitle theme-color-text">{{ responseData.Ort }}</div>
        </div>
        <div class="placecard-content" v-if="responseData">
          <div class="placecard-metadata-content">
            <div class="metadata-item" v-if="responseData.Loc">
              <div class="label">Location:</div>
              <div class="tag theme-color-text">{{ responseData.Loc }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Stift">
              <div class="label">{{ $t('stift') }}</div>
              <div class="tag theme-color-text">{{ responseData.Stift }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Kontrakt">
              <div class="label">{{ $t('kontrakt') }}</div>
              <div class="tag theme-color-text">{{ responseData.Kontrakt }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Kommun">
              <div class="label">{{ $t('kommun') }}</div>
              <div class="tag theme-color-text">{{ responseData.Kommun }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Pastorat">
              <div class="label">{{ $t('pastorat') }}</div>
              <div class="tag theme-color-text">{{ responseData.Pastorat }}</div>
            </div>
            
          </div>
          
        </div>
        <!-- <div class="placecard-metadata-content">
            <div class="preview" v-html="description">
            </div>
          </div> -->
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
        <div class="placecard-title-builder theme-color-text">
          {{ builderNameAndDate.name }}<br>
          <span v-if="builderNameAndDate.date">{{ builderNameAndDate.date }}</span>
        </div>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content" v-if="builderData.Biografi">
            <div class="builder-label">Biografi</div>
            <div class="metadata-item-wide">
              <div class="biography">{{ builderData.Biografi }}</div>
            </div>
          </div>
          
        </div>
        <!-- <div class="placecard-metadata-content">
            <div class="preview" v-html="description">
            </div>
          </div> -->
      </div>
    </div>
  </div>
</template>

<style>
.label {
  width: 35% !important;
}

.placecard-top{
  height:65%;
}

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

.placecard-title {

  font-size:2.5vw;
  padding-bottom:5px;
  font-weight:300;
  margin-left:-1px;

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
