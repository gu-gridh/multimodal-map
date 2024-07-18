<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed, onUnmounted } from 'vue';
import type { Image, Document, Media } from './types';
import type { DianaClient } from "@/assets/diana";
import PlaceViewCard from "./PlaceViewCard.vue";
import MapComponent from "@/components/MapComponent.vue";
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import i18n from '../../src/translations/sonora';

const organData = ref(null);

// Popup data
const popupData = ref(null);
const isPopupVisible = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const popupRef = ref(null);
const linkData = ref({ builder: '', date: '', work: '' }); // Selected builder, date, and work from placeviewcard 
const route = useRoute();
const sort = ref('type');
const groupedByYear = ref<{ [year: string]: (Image | Document | Media)[] }>({});
const { id } = defineProps<{ id: string; }>();
let documents = ref<Document[]>([]); // Initialized as an empty array
let media = ref<Media[]>([]); // Initialized as an empty array

watch(() => route.params.id, async (newId) => {
  if (newId) {
    try {
      const currentLocale = i18n.global.locale;

      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ1.php?id=${newId}&lang=${currentLocale}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      organData.value = processOrganData(data);

      media.value = [];
      documents.value = [];
      for (const key in data) {
        if (data[key].Document) {
          documents.value.push(data[key]);
        }
        if (data[key].Linkaddr) {
          media.value.push(data[key]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);

  try {
    const currentLocale = i18n.global.locale;

    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ1.php?id=${id}&lang=${currentLocale}`);    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    organData.value = processOrganData(data);
    documents.value = [];
    for (const key in data) {
      if (data[key].Document) {
        documents.value.push(data[key]);
      }
      if (data[key].Linkaddr) {
        media.value.push(data[key]);
      }
    }

    //find the element with the matching org_nr from the api
    const matchingElement = Object.values(data).find(element => element.org_nr === data.org_id);
    if (matchingElement) {
      linkData.value = {
        builder: matchingElement.builder,
        date: matchingElement.date,
        work: matchingElement.work,
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const fetchDivisionInfo = async (divId) => {
  try {
    const currentLocale = i18n.global.locale;

    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/divinfo1.php?div_id=${divId}&lang=${currentLocale}`);
    if (response.ok) {
      const data = await response.json();
      popupData.value = processPopUpData(data);
      isPopupVisible.value = true;
    } else {
      throw new Error('Failed to fetch division info');
    }
  } catch (error) {
    console.error("Error fetching division info:", error);
  }
};

const fetchStopInfo = async (stopId) => {
  try {
    const currentLocale = i18n.global.locale;

    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/stopinfo1.php?stop_id=${stopId}&lang=${currentLocale}`);
    if (response.ok) {
      const data = await response.json();
      popupData.value = processPopUpData(data);
      isPopupVisible.value = true;
    }
    else {
      throw new Error('Failed to fetch stop info');
    }
  } catch (error) {
    console.error("Error fetching stop info:", error);
  }
};

const processOrganData = (data) => {
  const processedData = {};
  const beforeDisposition = {};
  const afterDisposition = {};
  let dispositionFound = false;

  //keys to ignore explicitly
  const keysToIgnore = ['no_docs', 'org_id', 'place_id', 'Fotografi', 'no_links'];

  Object.keys(data).forEach(key => {
    if (!keysToIgnore.includes(key) && isNaN(parseInt(key[0]))) {
      if (key === 'Disposition') {
        dispositionFound = true;
        processedData[key] = {
          label: 'Disposition',
          data: data[key].substring(data[key].indexOf(';') + 1).trim(),
        };
      } else if (typeof data[key] === 'string' && data[key].includes(';')) {
        const index = data[key].indexOf(';');
        const label = data[key].substring(0, index).trim();
        const remainingData = data[key].substring(index + 1).trim();
        if (dispositionFound) {
          afterDisposition[key] = { label, data: remainingData };
        } else {
          beforeDisposition[key] = { label, data: remainingData };
        }
      } else {
        if (dispositionFound) {
          afterDisposition[key] = data[key];
        } else {
          beforeDisposition[key] = data[key];
        }
      }
    }
  });

  return { beforeDisposition, disposition: processedData['Disposition'], afterDisposition };
};

const processPopUpData = (data) => {
  const processedData = {};

  //keys to ignore explicitly
  const keysToIgnore = ['no_docs', 'org_id', 'place_id'];

  Object.keys(data).forEach(key => {
    //check if the key is not in the ignore list and does not start with a number
    if (!keysToIgnore.includes(key) && isNaN(parseInt(key[0]))) {
      if (typeof data[key] === 'string' && data[key].includes(';')) {
        const index = data[key].indexOf(';');
        const label = data[key].substring(0, index).trim();
        const remainingData = data[key].substring(index + 1).trim();
        processedData[key] = { label, data: remainingData };
      }
    }
  });
  return processedData;
};

const filteredOrganDataBefore = computed(() => {
  if (!organData.value) return null;
  return organData.value.beforeDisposition;
});

const filteredOrganDataAfter = computed(() => {
  if (!organData.value) return null;
  return organData.value.afterDisposition;
});

const dispositionData = computed(() => {
  if (!organData.value) return null;
  return organData.value.disposition;
});

const handleDisposition = async (event) => {
  const anchor = event.target.closest('a');
  if (anchor) {
    event.preventDefault();
    const url = new URL(anchor.href);

    // Capture mouse position
    const viewportHeight = window.innerHeight;
    const minDistanceFromBottom = 400; //minimum distance from the bottom of the viewport
    let mouseYPosition = event.clientY;

    if (mouseYPosition + minDistanceFromBottom > viewportHeight) {
      mouseYPosition = viewportHeight - minDistanceFromBottom;
    }

    mousePosition.value = { x: event.clientX, y: mouseYPosition };

    // Close any currently open popup
    popupData.value = null;
    isPopupVisible.value = false;

    if (url.pathname.endsWith('divinfo1.php')) {
      const divId = url.searchParams.get("div_id");
      await fetchDivisionInfo(divId);
    } else if (url.pathname.endsWith('stopinfo1.php')) {
      const stopId = url.searchParams.get("stop_id");
      await fetchStopInfo(stopId);
    }
  }
};

const handleLinkClicked = (data) => {
  linkData.value.builder = data.builder;
  linkData.value.date = data.date;
  linkData.value.work = data.work;
};

//close popup if clicked outside
const handleClickOutside = (event) => {
  if (popupRef.value && !popupRef.value.contains(event.target) && isPopupVisible.value) {
    isPopupVisible.value = false;
  }
};
</script>
    
<template>
  <div class="main-container">
    <div class="place-card-container">
      <PlaceViewCard :id="id" @link-clicked="handleLinkClicked" />
    </div>
    <div class="place-view">
      <div class="overview-row">
        <div class="title-event" style="font-weight: 600;">{{ linkData.work }} {{ linkData.date }}</div>
        <div class="title-builder" style="font-weight: 300;">{{ linkData.builder }}</div>
      </div>
      <div class="place-gallery-container">
        <!-- Documents -->
        <div class="table-section" v-if="documents.length > 0">
          <table class="content-table">
            <tbody>
              <tr>
                <td class="wide-second-td">{{ $t('documents') }}</td>
                <div class="documents">
                  <div v-for="(doc, index) in documents" :key="index" class="document-link">
                    <a :href="`/detail/image/${doc.Nr}`" target="_blank">
                      <div class="document-icon" />
                      {{ doc.Document }}
                    </a>
                  </div>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Media -->
        <div class="table-section" v-if="media.length > 0">
          <table class="content-table">
            <tbody>
              <tr>
                <td class="wide-second-td">Media:</td>
                <div class="documents">
                  <div v-for="(item, index) in media" :key="index" class="document-link">
                    <a :href="item.Linkaddr" target="_blank" rel="noopener noreferrer">
                      <div class="media-icon"></div>
                      {{ item.Linkname }}
                    </a>
                  </div>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Metadata Before Disposition -->
        <div class="table-section" v-if="filteredOrganDataBefore">
          <table class="content-table">
            <tbody>
              <tr v-for="(item, key) in filteredOrganDataBefore" :key="key">
                <td class="wide-second-td">{{ item.label }}:</td>
                <td class="tag theme-color-text" v-html="item.data"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Disposition Section -->
        <div class="table-section">
          <table class="content-table" v-if="organData">
            <tbody>
              <div class="metadata-section">
                <tr v-if="dispositionData">
                  <td class="wide-second-td">{{ dispositionData.label  }}</td>
                  <div class="organ-historic-overview" v-html="dispositionData.data" @click="handleDisposition"></div>
                  <div v-if="isPopupVisible" class="popup" ref="popupRef" :style="{ left: mousePosition.x +50 + 'px', top: mousePosition.y -100 + 'px' }">
                    <h3 v-if="popupData?.Verk">{{ $t('divisioninfo') }}</h3>
                    <h3 v-else-if="popupData?.Stämma">{{ $t('stopinfo') }}</h3>
                      <div v-if="popupData?.Verk" class="grid-container">
                          <div class="column">
                            <p><b>{{ popupData.Verk.label }}:</b> {{ popupData.Verk.data }}</p>
                            <p v-if="popupData.Typ_av_väderlåda"><b>{{ popupData.Typ_av_väderlåda.label }}:</b> {{ popupData.Typ_av_väderlåda.data }}</p>
                            <p v-if="popupData.Antal_väderlådor"><b>{{ popupData.Antal_väderlådor.label }}:</b> {{ popupData.Antal_väderlådor.data }}</p>
                            <p v-if="popupData.Verk_info"><b>{{ popupData.Verk_info.label }}:</b> {{ popupData.Verk_info.data }}</p>
                            <p v-if="popupData.Manual_nr"><b>{{ popupData.Manual_nr.label }}:</b> {{ popupData.Manual_nr.data }}</p>
                            <p v-if="popupData.Pipuppställning"><b>{{ popupData.Pipuppställning.label }}:</b> {{ popupData.Pipuppställning.data }}</p>
                            <p v-if="popupData.Info_tremulant_crescendo"><b>{{ popupData.Info_tremulant_crescendo.label }}:</b> {{ popupData.Info_tremulant_crescendo.data }}</p>
                          </div>
                          <div class="column" v-if="popupData.Beskrivning_väderlåda || popupData.Delad_väderlåda || popupData.Historik_väderlåda || popupData.Omfång_väderlåda || popupData.Lufttryck || popupData.Väderlåda_forskningsresultat">
                            <p v-if="popupData.Beskrivning_väderlåda"><b>{{ popupData.Beskrivning_väderlåda.label }}:</b> {{ popupData.Beskrivning_väderlåda.data }}</p>
                            <p v-if="popupData.Delad_väderlåda"><b>{{ popupData.Delad_väderlåda.label }}:</b> {{ popupData.Delad_väderlåda.data }}</p>
                            <p v-if="popupData.Historik_väderlåda"><b>{{ popupData.Historik_väderlåda.label }}:</b> {{ popupData.Historik_väderlåda.data }}</p>
                            <p v-if="popupData.Omfång_väderlåda"><b>{{ popupData.Omfång_väderlåda.label }}:</b> {{ popupData.Omfång_väderlåda.data }}</p>
                            <p v-if="popupData.Lufttryck"><b>{{ popupData.Lufttryck.label }}:</b> {{ popupData.Lufttryck.data }}</p>
                            <p v-if="popupData.Väderlåda_forskningsresultat"><b>{{ popupData.Väderlåda_forskningsresultat.label }}:</b> {{ popupData.Väderlåda_forskningsresultat.data }}</p>
                          </div>
                        </div>
                        <div v-else-if="popupData?.Stämma" class="stop-container">
                          <p v-if="popupData.Stämma"><b>{{ popupData.Stämma.label }}:</b> {{ popupData.Stämma.data }}</p>
                          <p v-if="popupData.Stämma_info"><b>{{ popupData.Stämma_info.label }}:</b> {{ popupData.Stämma_info.data }}</p>
                        </div>
                      <button @click="isPopupVisible = false" class="theme-color-text" style="font-weight: bold">{{ $t('close') }}</button>
                  </div>
                </tr>
              </div>
            </tbody>
          </table> 
        </div>  
        <!-- Metadata After Disposition -->
        <div class="table-section" v-if="filteredOrganDataAfter">
          <table class="content-table">
            <tbody>
              <tr v-for="(item, key) in filteredOrganDataAfter" :key="key">
                <td class="wide-second-td">{{ item.label }}:</td>
                <td class="tag theme-color-text" v-html="item.data"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <MapComponent />
</template>
    
<style scoped>
.place-view {
  margin-left: 20px;
  padding-top: 35px;
}

.overview-row {
  display: flex;
  flex-direction: column; 
  align-items: start; 
  width: 100%; 
  padding-left:50px;

}

.title-event{
color:white;
padding-top:40px;
line-height:1.0;
font-size: 35px;
}
.title-builder{
color:white;
font-size: 30px;
}


.document-icon {
  height: 1.3em;
  vertical-align: middle;
  margin-right: 8px;
  margin-top:-6px;
  display: inline-block;
  background-image: url("@/assets/document-white.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width:25px;
}

.media-icon {
  height: 1.3em;
  vertical-align: middle;
  margin-right: 8px;
  margin-top:-6px;
  display: inline-block;
  background-image: url("@/assets/play_arrow.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width:25px;
}

.document-link {
  display: flex;
  align-items: left;
  font-size: 1.05em;
  padding-bottom: 5px;
  color:white;
  font-weight:100!important;
  line-height:1.5;
}

.document-link a {

  font-weight:300!important;

}

.content-table {

}

.table-section {
 padding-left: 50px;
 padding-bottom: 30px;
}

.tag.theme-color-text {
  color: var(--theme-6) !important;
  width:auto!important;
}

table td {
        width: 0px !important;
        
    }

.wide-second-td {
  min-width: 150px !important;
  width: 150px !important;
  padding-bottom: 5px;
  padding-left: 5px;
  position: relative;
  box-sizing: border-box;
}

.organ-historic-overview{
  margin-left:-60px;
  margin-top:-28px;
  color:white;
}



.main-container {
  background-color: rgba(84, 105, 108, 0.7) !important;
  backdrop-filter: blur(10px) saturate(50%) brightness(100%);
  color: white;
}

.content-table td {
  color: white;
  text-align: left;
}

.document-link:hover {
  opacity: 0.8;
}

.popup {
  position: fixed;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  color: black;
}

.grid-container {
  display: flex;
  flex-wrap: wrap; 
}

.column {
  flex-grow: 1;
  flex-basis: 0;
  max-width: 300px;
}

.stop-container {
  width: 300px; 
}

.popup h3 {
font-weight:600;
font-size:1.3em;
}

.popup p{
padding:0px!important;
margin-bottom:5px!important;
}

.popup-content {
  max-width: 300px;
}


@media screen and (max-width: 900px) {
  .organ-historic-overview{
  margin-left:0px;
  margin-top:-35px;
}

#app .place-view {

        width: calc(100%) !important;
 
        margin-left: 0px !important;
        padding-left: 15px;
     
    }


.content-table{
  margin-top:30px;
}

.table-section{
  font-size:120%;
}

.tag.theme-color-text {
  color: var(--theme-3) !important;
}
#app .main-container {
  background-color: rgba(84, 105, 108, 0.7) !important;
  backdrop-filter: blur(10px) saturate(50%) brightness(100%);
}

.title-event{
  color:black;
  margin-left:-10px;
  background-color:transparent;
  padding-right:15px!important;
  margin-bottom:5px;
}

.title-builder{
  color:black;
  margin-left:-10px;
  margin-bottom:20px;
  padding-right:15px!important;
  line-height:1.1;
  background-color:transparent;
}

.metadata-section{
  margin-top:0px;
}

.tag{
  position:relative;
  float:left;
}

.documents{
  margin-top:10px;
  margin-bottom:30px;

}
.document-icon {
  height: 1.3em;
  vertical-align: middle;
  margin-right: 8px;
  margin-top:-6px;
  display: inline-block;
  background-image: url("@/assets/document-black.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width:30px;
}
.document-link {
  display: flex;
  align-items: left;
  font-size: 1.05em;
  padding-bottom: 5px;
  color:black;
  font-weight:100!important;
  line-height:1.5;
  padding-left:5px;
}

.document-link a {
  font-weight:300!important;

}

.column{
  text-align:left!important;
}

.popup {
  position: fixed;
  width:80%!important;
  height:auto!important;
  max-height:80vh!important;
  top:5vh!important;
  left:10%!important;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  color: black;
  overflow:auto;
}
.place-gallery-container {
    flex: 1;
    padding: 10px 30px 30px 0px;
}
.place-card-container{
  padding:0px;
}
}

</style>
    