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

    const lastWorkKey = Object.keys(data).filter(key => data[key].work).pop();
    if (lastWorkKey) {
      // Update the linkData with the last work's details from api
      linkData.value = {
        builder: data[lastWorkKey].builder,
        work: data[lastWorkKey].work,
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
          <div style="font-weight: 600;">{{ linkData.work }}</div>
          <div style="font-weight: 300;">{{ linkData.builder }}</div>
      </div>
      <div class="place-gallery-container">
        <div class="table-section">
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
            </tbody>
          </table>
        </div>
        <div class="table-section">
          <table class="content-table" v-if="organData">
            <tbody>
              <tr v-if="organData.Verksgrundare || organData.Tillkomstår ||
                organData.Fasadpipor_info || organData.Typ_av_traktursystem || organData.Typ_av_registratursystem ||
                organData.Typ_av_huvudbälg || organData.Antal_bälgar">
                <td class="wide-first-td">Metadata:</td>
              <tr v-if="organData.Verksgrundare">
                <td class="wide-second-td">Verksgrundare:</td>
                <td class="tag theme-color-text">{{ organData.Verksgrundare }}</td>
              </tr>
              <tr v-if="organData.Tillkomstår">
                <td class="wide-second-td">Tillkomstår:</td>
                <td class="tag theme-color-text">{{ organData.Tillkomstår }}</td>
              </tr>
              <!-- <tr v-if="organData.Koppel_ & _kombinationer_info">
                <td class="wide-second-td">Koppel kombinationer:</td>
                <td class="tag theme-color-text">{{ organData.Koppel_ & _kombinationer_info }}</td>
              </tr> -->
              <tr v-if="organData.Fasadpipor_info">
                <td class="wide-second-td">Fasadpipor info:</td>
                <td class="tag theme-color-text">{{ organData.Fasadpipor_info }}</td>
              </tr>
              <tr v-if="organData.Typ_av_traktursystem">
                <td class="wide-second-td">Typ av traktursystem:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_traktursystem }}</td>
              </tr>
              <tr v-if="organData.Typ_av_registratursystem">
                <td class="wide-second-td">Typ av registratursystem:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_registratursystem }}</td>
              </tr>
              <tr v-if="organData.Typ_av_huvudbälg">
                <td class="wide-second-td">Typ av huvudbälg:</td>
                <td class="tag theme-color-text">{{ organData.Typ_av_huvudbälg }}</td>
              </tr>
              <!-- <tr v-if="organData.Info_bälgar / luftsystem">
                <td class="wide-second-td">Info bälgar/luftsystem:</td>
                <td class="tag theme-color-text">{{ organData.Info_bälgar / luftsystem }}</td>
              </tr> -->
              <tr v-if="organData.Antal_bälgar">
                <td class="wide-second-td">Antal bälgar:</td>
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
                <td class="wide-first-td">Disposition:</td>
                <td>
                  <div class="organ-historic-overview" v-html="organData.Disposition" @click="handleDisposition"></div>
                  <div v-if="isPopupVisible" class="popup"
                    :style="{ left: mousePosition.x + 'px', top: mousePosition.y + 'px' }">
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
                </td>
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
  margin-top: 35px;
}

.document-icon {
  height: 1.3em;
  vertical-align: middle;
  margin-right: 5px;
  display: inline-block;
}

.document-link {
  display: flex;
  align-items: left;
  font-size: 1.05em;
  padding-bottom: 5px;
}

.content-table {

}

.table-section {
 /* padding-bottom:30px; */
}

.tag.theme-color-text {
  color: rgb(250, 220, 220) !important;
}

table td {
        width: 0px !important;
    }

.wide-first-td {
  width:110px!important;
  max-width:0px;
}

.wide-second-td {
  min-width: 180px !important;
  padding-bottom: 5px;
}

.organ-historic-overview{
  text-align:left!important;
  margin-left:-60px;
  margin-top:-28px;
}

a {
  color: white;
  font-weight: normal;
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
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  color: black;
}

.popup-content {
  max-width: 300px;
}

.tag.theme-color-text {
  width: 100% !important;
}

.overview-row {
  display: flex;
  flex-direction: column; 
  align-items: start; 
  width: 100%; 
  padding: 15px;
  font-size: 30px;
  color: rgb(250,220,220);
}
</style>
    