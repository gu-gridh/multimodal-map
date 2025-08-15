<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { sonoraStore } from "./settings/store";
import { mapStore } from "@/stores/store";
import OpenSeadragon from "@/components/OpenSeadragonNonPyramid.vue";
import placeholderImage from './images/placeholder.png';
import i18n from '../../src/translations/sonora';

const { selectedFeature } = storeToRefs(mapStore());
const imageUrls = ref([]);
const organNumbers = ref({}); //all the organ numbers returned 
const computedRoute = computed(() => `/place/${currentOrganNumber.value}`); //route for placeview
const { selectedBuilderId, builderLayerVisible, placeClicked } = storeToRefs(sonoraStore());
const builderData = ref(null);
const lastInteraction = ref('none'); //'none', 'place', or 'builder'
const responseData = ref(null);

let currentOrganNumber = ref(0); //organ number corresponding to page in openseadragonviewer
let text = ref(false)
let place = ref()

//for filtering out the date from the Builder Name and putting it on a new line
const builderNameAndDate = computed(() => {
  if (builderData.value && builderData.value.Verksgrundare) {
    let parts = builderData.value.Verksgrundare.split("(");
    let namePart = parts[0].trim();
    //remove the comma if present
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
    responseData.value.Loc = responseData.value[`loc${newPage}`] || ''; //update loc based on page
  }
};

//when a place is selected, fetch image and info
watch(selectedFeature, async (newFeature, oldFeature) => {
  if (newFeature) {
    lastInteraction.value = 'place';
    selectedBuilderId.value = 0;
    const placeId = selectedFeature.value.get("number") ?? selectedFeature.value.get("place_nr") ?? selectedFeature.value.get("Nr");
    place.value = { id_: placeId };
    try {
      const currentLocale = i18n.global.locale;
      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/place1.php?id=${placeId}&lang=${currentLocale}`);
      if (response.ok) {
        const data = await response.json();
        processOrganData(data);
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
}, { immediate: true });

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
}, { immediate: true });

//deselecting place will close the preview
function deselectPlace() { // Reset interaction states
  selectedFeature.value = undefined;
  selectedBuilderId.value = 0;
  lastInteraction.value = 'none';
  builderLayerVisible.value = false;
}

//deselect builder when a place is clicked in the search results
watch(() => placeClicked.value, (newValue) => {
  if (newValue) {
    selectedBuilderId.value = 0;
    builderLayerVisible.value = false;
    placeClicked.value = false;
  }
});

const processOrganData = (data) => {
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && data[key].includes(';')) {
      const index = data[key].indexOf(';');
      const label = data[key].substring(0, index).trim();
      const remainingData = data[key].substring(index + 1).trim();
      data[key] = { label, data: remainingData };
    }
  });
};
</script>

<template>
  <div v-if="lastInteraction === 'place' && selectedFeature" class="mapview-preview">
    <div class="placecard">
      <div class="close-card-button" @click="deselectPlace">+</div>
      <div class="placecard-top">
        <OpenSeadragon :src="imageUrls" :key="imageUrls.join(',')" @page-changed="handlePageChange" class="flex-1" />
      </div>
      <div class="placecard-bottom">
        <div class="placecard-text" v-if="responseData && responseData.Byggnadens_namn && responseData.Ort">
          <div class="placecard-title theme-color-text">{{ responseData.Byggnadens_namn.data }}</div>
          <div class="placecard-subtitle theme-color-text">{{ responseData.Ort.data }}</div>
        </div>
        <div class="placecard-content" v-if="responseData">
          <div class="placecard-metadata-content">
            <div class="metadata-item" v-if="responseData.Loc">
              <div class="label">{{ $t('location') }}</div>
              <div class="tag theme-color-text">{{ responseData.Loc }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Stift">
              <div class="label">{{ $t('stift') }}</div>
              <div class="tag theme-color-text">{{ responseData.Stift.data }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Kontrakt">
              <div class="label">{{ $t('kontrakt') }}</div>
              <div class="tag theme-color-text">{{ responseData.Kontrakt.data }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Kommun">
              <div class="label">{{ $t('kommun') }}</div>
              <div class="tag theme-color-text">{{ responseData.Kommun.data }}</div>
            </div>
            <div class="metadata-item" v-if="responseData.Pastorat">
              <div class="label">{{ $t('pastorat') }}</div>
              <div class="tag theme-color-text">{{ responseData.Pastorat.data }}</div>
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
            <div class="builder-label">{{ $t('biography') }}</div>
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
.placecard {
  position: relative;
  height: calc(100vh - 32vh) !important;
  margin-top: 12vh;
  font-size: 90%;
  font-weight: 300;
}

.placecard-top {
  height: 65%;
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
  margin-top: 50px;
  font-size: 2.5vw;
  text-align: center;
  font-weight: 200;
  padding: 10px;
}

#app .placecard-title {
  font-size: 35px !important;
  padding-bottom: 5px;
  font-weight: 300;
  margin-left: -1px;
}



#app .placecard-subtitle {
  font-size: 25px !important;
  padding-bottom: 5px;
  font-weight: 300;
  margin-left: -1px;

}

.builder-label {
  font-size: 1.5vw;
  margin-top: 20px;
  text-align: center;
}

.biography {
  text-align: justify;
  padding: 10px;
}
</style>
