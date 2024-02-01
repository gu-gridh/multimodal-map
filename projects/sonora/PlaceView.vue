<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
import type { DianaClient } from "@/assets/diana";
import documentIcon from '@/assets/document.svg'; 
import PlaceViewCard from "./PlaceViewCard.vue"; 
import MapComponent from "@/components/MapComponent.vue";
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const organData = ref(null);

// Popup data
const popupData = ref(null);
const isPopupVisible = ref(false);
const mousePosition = ref({ x: 0, y: 0 });

const route = useRoute();
const sort = ref('type');
const groupedByYear = ref<{ [year: string]: (Image | Observation | Document | Pointcloud | Mesh )[] }>({});
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
  }  }
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
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log(documents.value)
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
      console.log(`Division info link clicked, ID: ${divId}`);
      await fetchDivisionInfo(divId);
    } else if (url.pathname.endsWith('stopinfo.php')) {
      const stopId = url.searchParams.get("stop_id");
      console.log(`Stop info link clicked, ID: ${stopId}`);
      await fetchStopInfo(stopId);
    } else {
      console.log('Other link clicked');
    }
  }
};

</script>
    
<template>
    <div class="main-container">
        <div class="place-card-container">
            <PlaceViewCard :id="id" />
        </div>
        <div class="place-view">
        <div class="place-gallery-container">
            <table class="content-table" v-if="organData">  
              <tbody>
                <tr v-if="documents.length > 0">
                  <td class="wide-first-td">Documents:</td>
                  <td>
                    <div v-for="(doc, index) in documents" :key="index" class="document-link">
                      <router-link :to="`/detail/image/${doc.Nr}`">
                        <img src="@/assets/document-white.svg" class="document-icon" />
                        {{ doc.Document }}
                      </router-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="organData.Verksgrundare">
                  <td class="wide-first-td">Verksgrundare:</td>
                  <td class="tag theme-color-text">{{ organData.Verksgrundare }}</td>
                </tr>
                <tr v-if="organData.Tillkomstår">
                  <td class="wide-first-td">Tillkomstår:</td>
                  <td class="tag theme-color-text">{{ organData.Tillkomstår }}</td>
                </tr>
                <tr v-if="organData.Disposition">
                  <td class="wide-first-td">Disposition:</td>
                  <div class="organ-historic-overview" v-html="organData.Disposition" @click="handleDisposition"></div>
                    <div v-if="isPopupVisible" class="popup" :style="{ left: mousePosition.x + 'px', top: mousePosition.y + 'px' }">
                      <h3 v-if="popupData?.Verk">Division Info:</h3>
                      <h3 v-else-if="popupData?.Stämma">Stop Info:</h3>

                      <div v-if="popupData?.Verk">
                        <p>Verk: {{ popupData.Verk }}</p>
                        <p>Beskrivning väderlåda: {{ popupData.Beskrivning_väderlåda }}</p>
                        <p>Lufttryck: {{ popupData.Lufttryck }}</p>
                      </div>

                      <div v-else-if="popupData?.Stämma">
                        <p>Stämma: {{ popupData.Stämma }}</p>
                        <p>Stämma info: {{ popupData.Stämma_info }}</p>
                      </div>

                      <button @click="isPopupVisible = false" style="font-weight: bold">Close</button>
                    </div>
                  </tr>
                  <tr v-if="organData.Koppel_ & _kombinationer_info">
                    <td class="wide-first-td">Koppel kombinationer:</td>
                    <td class="tag theme-color-text">{{ organData.Koppel_ & _kombinationer_info }}</td>
                  </tr>
                  <tr v-if="organData.Fasadpipor_info">
                    <td class="wide-first-td">Fasadpipor info:</td>
                    <td class="tag theme-color-text">{{ organData.Fasadpipor_info }}</td>
                  </tr>
                  <tr v-if="organData.Typ_av_traktursystem">
                    <td class="wide-first-td">Typ av traktursystem:</td>
                    <td class="tag theme-color-text">{{  organData.Typ_av_traktursystem }}</td>
                  </tr>
                  <tr v-if="organData.Typ_av_registratursystem">
                    <td class="wide-first-td">Typ av registratursystem:</td>
                    <td class="tag theme-color-text">{{ organData.Typ_av_registratursystem }}</td>
                  </tr>
                  <tr v-if="organData.Typ_av_huvudbälg">
                    <td class="wide-first-td">Typ av huvudbälg:</td>
                    <td class="tag theme-color-text">{{ organData.Typ_av_huvudbälg }}</td>
                  </tr>
                  <tr v-if="organData.Info_bälgar / luftsystem">
                    <td class="wide-first-td">Info bälgar/luftsystem:</td>
                    <td class="tag theme-color-text">{{ organData.Info_bälgar / luftsystem }}</td>
                  </tr>
                  <tr v-if="organData.Antal_bälgar">
                    <td class="wide-first-td">Antal bälgar:</td>
                    <td class="tag theme-color-text">{{ organData.Antal_bälgar }}</td>
                  </tr>
              </tbody>
            </table>
        </div>  
        </div>
    </div>
    <MapComponent />
</template>

    
<style scoped>
.document-icon {
    height: 1.3em; 
    vertical-align: middle; 
    margin-right: 5px; 
    display: inline-block; 
}

.document-link {
    display: flex;
    align-items: center; 
    font-size:1.05em;
    padding-bottom:5px;
}

.content-table {
  table-layout: auto;
  width: 100%;
}

.tag.theme-color-text {
  color: rgb(250,220,220) !important;
}

.wide-first-td {
  max-width: 75px; 
}

a {
  color: white;
  font-weight: normal;
}

.main-container{
    background-color:rgba(84,105,108, 0.7) !important;
    backdrop-filter: blur(10px) saturate(50%) brightness(100%);
    color:white;
}

.content-table td{
    color:white;
    text-align: left;
}

.document-link:hover{
  opacity:0.8;
}

.popup {
  position: fixed;
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.popup-content {
  max-width: 300px;
}
</style>
    