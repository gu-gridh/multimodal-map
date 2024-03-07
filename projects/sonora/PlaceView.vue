<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
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

const linkData = ref({ builder: '', work: '' }); // Selected builder and work from placeviewcard 

const route = useRoute();
const sort = ref('type');
const groupedByYear = ref<{ [year: string]: (Image | Observation | Document | Pointcloud | Mesh)[] }>({});
const { id } = defineProps<{ id: string; }>();
let documents = ref<Document[]>([]); // Initialized as an empty array

watch(() => route.params.id, async (newId) => {
  if (newId) {
    try {
      const currentLocale = i18n.global.locale;

      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ1.php?id=${newId}&lang=${currentLocale}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      processOrganData(data);
      organData.value = data;

      documents.value = [];
      for (const key in data) {
        if (data[key].Document) {
          documents.value.push(data[key]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});

onMounted(async () => {
  try {
    const currentLocale = i18n.global.locale;

    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ1.php?id=${id}&lang=${currentLocale}`);    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    processOrganData(data);
    organData.value = data;

    documents.value = [];
    for (const key in data) {
      if (data[key].Document) {
        documents.value.push(data[key]);
      }
    }

    //find the element with the matching org_nr from the api
    const matchingElement = Object.values(data).find(element => element.org_nr === data.org_id);
    if (matchingElement) {
      linkData.value = {
        builder: matchingElement.builder,
        work: matchingElement.work,
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const fetchDivisionInfo = async (divId) => {
  try {
    const currentLocale = i18n.global.locale;

    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/divinfo1.php?div_id=${divId}&lang=${currentLocale}`);
    if (response.ok) {
      const data = await response.json();
      processOrganData(data);
      popupData.value = data;
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
      processOrganData(data);
      popupData.value = data;
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
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && data[key].includes(';')) {
      const index = data[key].indexOf(';');
      const label = data[key].substring(0, index).trim();
      const remainingData = data[key].substring(index + 1).trim();
      data[key] = { label, data: remainingData };
    }
  });
};

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
  linkData.value.work = data.work;
};
</script>
    
<template>
  <div class="main-container">
    <div class="place-card-container">
      <PlaceViewCard :id="id" @link-clicked="handleLinkClicked" />
    </div>
    <div class="place-view">
      <div class="overview-row">
          <div class="title-event" style="font-weight: 600;">{{ linkData.work }}</div>
          <div  class="title-builder" style="font-weight: 300;">{{ linkData.builder }}</div>
      </div>
      <div class="place-gallery-container">
        <div class="table-section">
          <table class="content-table" v-if="organData">
            <tbody>
              <tr v-if="documents.length > 0">
                <td class="wide-first-td">Documents</td>
                
                  <div v-for="(doc, index) in documents" :key="index" class="document-link">
                    <router-link :to="`/detail/image/${doc.Nr}`">
                      <img src="@/assets/document-white.svg" class="document-icon" />
                      {{ doc.Document }}
                    </router-link>
                  </div>
           
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-section">
          <table class="content-table" v-if="organData">
            <tbody>
              <tr v-if="organData.Verksgrundare || organData.Tillkomstår ||
                organData.Fasadpipor_info || organData.Typ_av_traktursystem || organData.Typ_av_registratursystem ||
                organData.Typ_av_huvudbälg || organData.Antal_bälgar">
              <td class="wide-first-td">Metadata</td>
              <tr v-if="organData.Verksgrundare">
                <td class="wide-second-td">{{ organData.Verksgrundare.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Verksgrundare.data }}</td>
              </tr>
              <tr v-if="organData.Tillkomstår">
                <td class="wide-second-td">{{ organData.Tillkomstår.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Tillkomstår.data }}</td>
              </tr>
              <!-- <tr v-if="organData.Koppel_ & _kombinationer_info">
                <td class="wide-second-td">Koppel kombinationer:</td>
                <td class="tag theme-color-text">{{ organData.Koppel_ & _kombinationer_info }}</td>
              </tr> -->
               <tr v-if="organData.Fasadpipor_info">
                <td class="wide-second-td">{{ organData.Fasadpipor_info.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Fasadpipor_info.data }}</td>
              </tr>
              <tr v-if="organData.Typ_av_traktursystem">
                <td class="wide-second-td">{{ organData.Typ_av_traktursystem.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_traktursystem.data }}</td>
              </tr>
              <tr v-if="organData.Typ_av_registratursystem">
                <td class="wide-second-td">{{ organData.Typ_av_registratursystem.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_registratursystem.data }}</td>
              </tr>
              <tr v-if="organData.Typ_av_huvudbälg">
                <td class="wide-second-td">{{ organData.Typ_av_huvudbälg.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_huvudbälg.data }}</td>
              </tr>
              <!-- <tr v-if="organData.Info_bälgar / luftsystem">
                <td class="wide-second-td">Info bälgar/luftsystem:</td>
                <td class="tag theme-color-text">{{ organData.Info_bälgar / luftsystem }}</td>
              </tr> -->
              <tr v-if="organData.Antal_bälgar">
                <td class="wide-second-td">{{ organData.Antal_bälgar.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Antal_bälgar.data }}</td>
              </tr>
              <tr v-if="organData.Aktivitet_info">
                <td class="wide-second-td">{{ organData.Aktivitet_info.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Aktivitet_info.data }}</td>
              </tr>
              <tr v-if="organData.Koppel_kombinationer_info">
                <td class="wide-second-td">{{ organData.Koppel_kombinationer_info.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Koppel_kombinationer_info.data }}</td>
              </tr>
              <tr v-if="organData.Tillbehör">
                <td class="wide-second-td">{{ organData.Tillbehör.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Tillbehör.data }}</td>
              </tr>
              <tr v-if="organData.Fasadhistorik">
                <td class="wide-second-td">{{ organData.Fasadhistorik.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Fasadhistorik.data }}</td>
              </tr>
              <tr v-if="organData.Info_traktursystem">
                <td class="wide-second-td">{{ organData.Info_traktursystem.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Info_traktursystem.data }}</td>
              </tr>
              <tr v-if="organData.Info_registratursystem">
                <td class="wide-second-td">{{ organData.Info_registratursystem.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Info_registratursystem.data }}</td>
              </tr>
              <tr v-if="organData.Info_luftsystem">
                <td class="wide-second-td">{{ organData.Info_luftsystem.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Info_luftsystem.data }}</td>
              </tr>
              <tr v-if="organData.Övrig_info">
                <td class="wide-second-td">{{ organData.Övrig_info.label }}:</td>
                <td class="tag theme-color-text">{{ organData.Övrig_info.data }}</td>
              </tr>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-section">
          <table class="content-table" v-if="organData">

            <tbody>
              <tr v-if="organData.Disposition">
                <td class="wide-first-td">{{ organData.Disposition.label }}</td>
                  <div class="organ-historic-overview" v-html="organData.Disposition.data" @click="handleDisposition"></div>
                  <div v-if="isPopupVisible" class="popup"
                    :style="{ left: mousePosition.x +50 + 'px', top: mousePosition.y -100 + 'px' }">
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
                        <div class="column">
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
  padding-left:15px;

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
 padding-bottom:30px;
}

.tag.theme-color-text {
  color: var(--theme-6) !important;
  width:auto!important;
}

table td {
        width: 0px !important;
        
    }

.wide-first-td {
  width:130px!important;
text-align:right!important;
padding-right:45px;

}

.wide-second-td {
  min-width: 180px !important;
  padding-bottom: 5px;
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
  max-width: 600px; 
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px; 
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

.table-section{
  font-size:130%;
}

.tag.theme-color-text {
  color: var(--theme-3) !important;
}
#app .main-container {
  background-color: rgba(84, 105, 108, 0.7) !important;
  backdrop-filter: blur(10px) saturate(50%) brightness(100%);
}
}

</style>
    