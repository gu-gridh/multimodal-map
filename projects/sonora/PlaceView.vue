<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
import type { DianaClient } from "@/assets/diana";
import PlaceViewCard from "./PlaceViewCard.vue";
import MapComponent from "@/components/MapComponent.vue";
import { watch } from 'vue';
import { useRoute } from 'vue-router';

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
      const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ.php?id=${newId}&lang=sv`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ.php?id=${id}&lang=sv`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
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
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/divinfo.php?div_id=${divId}&lang=sv`);
    if (response.ok) {
      const data = await response.json();
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
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/stopinfo.php?stop_id=${stopId}&lang=sv`);
    if (response.ok) {
      const data = await response.json();
      popupData.value = data;
      isPopupVisible.value = true;
    } else {
      throw new Error('Failed to fetch stop info');
    }
  } catch (error) {
    console.error("Error fetching stop info:", error);
  }
};

const handleDisposition = async (event) => {
  const anchor = event.target.closest('a');
  if (anchor) {
    event.preventDefault();
    const url = new URL(anchor.href);

    // Capture mouse position
    mousePosition.value = { x: event.clientX, y: event.clientY };

    // Close any currently open popup
    popupData.value = null;
    isPopupVisible.value = false;

    if (url.pathname.endsWith('divinfo.php')) {
      const divId = url.searchParams.get("div_id");
      await fetchDivisionInfo(divId);
    } else if (url.pathname.endsWith('stopinfo.php')) {
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
                <td class="wide-second-td">{{ $t('verksgrundare') }}:</td>
                <td class="tag theme-color-text">{{ organData.Verksgrundare }}</td>
              </tr>
              <tr v-if="organData.Tillkomstår">
                <td class="wide-second-td">{{ $t('tillkomstår') }}:</td>
                <td class="tag theme-color-text">{{ organData.Tillkomstår }}</td>
              </tr>
              <!-- <tr v-if="organData.Koppel_ & _kombinationer_info">
                <td class="wide-second-td">Koppel kombinationer:</td>
                <td class="tag theme-color-text">{{ organData.Koppel_ & _kombinationer_info }}</td>
              </tr> -->
              <tr v-if="organData.Fasadpipor_info">
                <td class="wide-second-td">{{ $t('fasadpipor') }}:</td>
                <td class="tag theme-color-text">{{ organData.Fasadpipor_info }}</td>
              </tr>
              <tr v-if="organData.Typ_av_traktursystem">
                <td class="wide-second-td">{{ $t('traktursystem') }}:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_traktursystem }}</td>
              </tr>
              <tr v-if="organData.Typ_av_registratursystem">
                <td class="wide-second-td">{{ $t('registratursystem') }}:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_registratursystem }}</td>
              </tr>
              <tr v-if="organData.Typ_av_huvudbälg">
                <td class="wide-second-td">{{ $t('huvudbälg') }}:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_huvudbälg }}</td>
              </tr>
              <!-- <tr v-if="organData.Info_bälgar / luftsystem">
                <td class="wide-second-td">Info bälgar/luftsystem:</td>
                <td class="tag theme-color-text">{{ organData.Info_bälgar / luftsystem }}</td>
              </tr> -->
              <tr v-if="organData.Antal_bälgar">
                <td class="wide-second-td">{{ $t('antalbälgar') }}:</td>
                <td class="tag theme-color-text">{{ organData.Antal_bälgar }}</td>
              </tr>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-section">
          <table class="content-table" v-if="organData">

            <tbody>
              <tr v-if="organData.Disposition">
                <td class="wide-first-td">{{ $t('disposition') }}:</td>
                  <div class="organ-historic-overview" v-html="organData.Disposition" @click="handleDisposition"></div>
                  <div v-if="isPopupVisible" class="popup"
                    :style="{ left: mousePosition.x +50 + 'px', top: mousePosition.y -100 + 'px' }">
                    <h3 v-if="popupData?.Verk">{{ $t('divisioninfo') }}</h3>
                    <h3 v-else-if="popupData?.Stämma">{{ $t('stopinfo') }}</h3>

                    <div v-if="popupData?.Verk">
                      <p><b>{{ $t('verk') }}:</b> {{ popupData.Verk }}</p>
                      <p><b>{{ $t('väderlåda') }}:</b> {{ popupData.Beskrivning_väderlåda }}</p>
                      <p><b>{{ $t('lufttryck') }}:</b> {{ popupData.Lufttryck }}</p>
                    </div>

                    <div v-else-if="popupData?.Stämma">
                      <p><b>{{ $t('stämma') }}:</b> {{ popupData.Stämma }}</p>
                      <p><b>{{ $t('stämmainfo') }}:</b> {{ popupData.Stämma_info }}</p>
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
  border-radius:8px;
  padding: 15px 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  color: black;
  width:300px;
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
    