<script setup lang="ts">
import router from './router'
import { ref, inject, onMounted, nextTick } from "vue"
import markerIcon from "@/assets/marker-red.svg";
import { watch } from 'vue';

const props = defineProps<{
  id: string;
}>();

const organData = ref(null);

// Popup data
const popupData = ref(null);
const isPopupVisible = ref(false);
const mousePosition = ref({ x: 0, y: 0 });

const fetchOrganData = async () => {
  try {
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ.php?id=${props.id}&lang=sv`);
    if (response.ok) {
      const data = await response.json();
      organData.value = data;
    } else {
      throw new Error('Failed to fetch organ data');
    }
  } catch (error) {
    console.error("Error fetching organ data:", error);
  }
};

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

const handleLinkClick = (event) => {
  if (event.target.tagName === 'A') {
    event.preventDefault();
    const url = new URL(event.target.href);

    const newId = url.searchParams.get("id");
    if (newId) {
      router.push(`/place/${newId}`);
    }
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
    const newId = url.searchParams.get("id");
    if (newId) {
      router.push(`/place/${newId}`);
    }
  }
};


watch(() => props.id, async (newId) => {
  if (newId) {
    await fetchOrganData(); // Refetch the data with the new ID
  }
}, { immediate: true });

onMounted(() => {
  fetchOrganData();
});

</script>

<template>
  <button class="place-back-button" @click="router.push({ path: '/' })"></button>
  <div class="place-meta-container">

    <div class="placecard-full">
  

      <div class="placecard-full-content">

        <div class="placecard-text-overlay"></div>

          <!-- mini map -->
          <div class="mini-map">
            <img v-if="organData?.Fotografi" :src="organData.Fotografi" alt="Map Image" />
            <div v-else class="no-image-placeholder"></div>
          </div>
        <div v-if="organData" class="placecard-text">
          <div class="placecard-title theme-color-text">Organ {{ id }}</div>
          <div class="placecard-metadata-content" style="">
            <div class="metadata-item">
              <div class="label">Verksgrundare: </div>
              <div class="tag theme-color-text">{{ organData.Verksgrundare }}</div>
            </div>
            <div class="metadata-item">
              <div class="short-label">Fasadpipor_info: </div>
              <div class="tag theme-color-text">{{ organData.Fasadpipor_info }} </div>
            </div>
            <div class="metadata-item">
              <div class="label">Typ_av_traktursystem: </div>
              <div class="tag theme-color-text">{{ organData.Typ_av_traktursystem }}</div>
            </div>
            <div class="metadata-item">
              <div class="short-label">Typ_av_registratursystem: </div>
              <div class="tag theme-color-text">{{ organData.Typ_av_registratursystem }}</div>
            </div>
            <div class="metadata-item">
              <div class="short-label">Typ_av_huvudbälg: </div>
              <div class="tag theme-color-text">{{ organData.Typ_av_huvudbälg }}</div>
            </div>
             <div class="metadata-item">
              <div class="short-label">Info_bälgar/luftsystem: </div>
              <div class="tag theme-color-text">{{ organData.Info_bälgar/luftsystem }}</div>
            </div>
             <div class="metadata-item">
              <div class="short-label">Antal_bälgar: </div>
              <div class="tag theme-color-text">{{ organData.Antal_bälgar }}</div>
            </div>
          </div>
          <div class="placecard-metadata-content" style="margin-top:10px; border-top: 1.5px solid black;">
            <span>Historisk_översikt:</span>
          <div class="organ-historic-overview" v-html="organData.Historisk_översikt" @click="handleLinkClick"></div>
        
          </div>
          <div class="placecard-metadata-content" style="margin-top:10px; border-top: 1.5px solid black;">
            <span>Disposition:</span>
            <div class="organ-historic-overview" v-html="organData.Disposition"  @click="handleDisposition"></div>
          </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::v-deep a {
  color: blue !important;
  text-decoration: underline;
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

.mini-map img, .no-image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  background-color: black;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.place-back-button {
  left: 40px;
  top: 80px;
  background: url(@/assets/interface/backbuttonwhite.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;

  border-radius: 50%;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
}

.place-meta-container {
  overflow-y: auto;
  height: calc(100vh - 80px);
  padding-bottom: 30px;
  padding-left: 45px;
  padding-right: 20px;
}

#app .place-meta-container {}

.placecard-full {
  margin-top: 80px;
  margin-left: 50px;
  color: black;
  background-color: white;
  padding: 0px;
  box-shadow: -3px 0px 25px rgba(0, 0, 0, 0.3);
  height: calc(100vh - 230px);
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 10px;
  border-radius: 15px !important;
  -ms-overflow-style: none;
  scrollbar-width: none;
  transition: all 0.0s ease-in-out;
}

.placecard-full::-webkit-scrollbar {
  width: 0 !important
}

.placecard-full-content {
  height: auto;
  width: 100%;
  padding: 0px 0px 10px 0px;
}


.placecard-full .category-button {
  width: 110px !important;
  padding: 4px 18px !important;
  margin-top: 15px;
  margin-bottom: 20px;

}

.placecard-full .placecard-text{
  padding:10px 30px 0px 30px;
}

.mini-map {
  width: 100%;
  height: 35vh;
  max-height: 300px;
  overflow: hidden;
  background-color: grey;
  margin-bottom: 0px;
}

.placecard-metadata-description{
  font-size:0.9em;
}




/* For small screens */
@media screen and (max-width: 900px) {
  .placecard-full {
    margin-top:40px!important;
  }
  #app .place-meta-container {
    position: relative !important;
    margin-top: 0px !important;
    top: 20px !important;
    height: auto;
    width: 100%;
    z-index: 100;
    padding-right: 20px !important;
    padding-left: 20px !important;
    padding-bottom: 0px !important;
    overflow-y: auto;
  }

  .place-back-button {
    left: 30px;
    top: 10px;
    width: 40px;
    height: 40px;
    z-index: 1000;
  }

  .placecard-full {
    margin-top: 30px;
    color: black;
    margin-left: 0px;
    background-color: white;
    padding-bottom: 30px;
    box-shadow: 0px -15px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.0s ease-in-out;
    height: auto;
    overflow: hidden;
    border-radius: 20px 20px 0px 0px !important;
  }

  .placecard-full .category-button {
    width: 120px !important;
    padding: 8px 15px !important;
    margin-top: 15px;
    padding: 0px;
    padding-left: 0px;
    margin-bottom: 0px !important;
  }
}
</style>