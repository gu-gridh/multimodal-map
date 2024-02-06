<script setup lang="ts">
import router from './router'
import { ref, inject, onMounted, nextTick } from "vue"
import markerIcon from "@/assets/marker-red.svg";
import { watch } from 'vue';

const emit = defineEmits(['link-clicked']);

const props = defineProps<{
  id: string;
}>();

const organData = ref(null);
const processedOrganData = ref([]);

const processOrganData = (data) => {
  // Filter entries that start with 'work'
  const filteredData = Object.values(data).filter(item => item.work);

  // Sort entries by date
  filteredData.sort((a, b) => new Date(a.date.trim()) - new Date(b.date.trim()));

  processedOrganData.value = filteredData;
};

const fetchOrganData = async () => {
  try {
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ.php?id=${props.id}&lang=sv`);
    if (response.ok) {
      const data = await response.json();
      organData.value = data;
      processOrganData(data); // Process the data for the table
    } else {
      throw new Error('Failed to fetch organ data');
    }
  } catch (error) {
    console.error("Error fetching organ data:", error);
  }
};

//when clicking on organs in the historical overview
const handleLinkClick = (event, itemLink, item) => {
  event.preventDefault();

  const url = new URL(itemLink, window.location.href);
  const newId = url.searchParams.get("id");

  if (newId) {
    router.push(`/place/${newId}`);
    emit('link-clicked', { builder: item.builder, work: item.work });
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
        <div class="placeview-main-title">{{ organData?.Plats }}</div>
        <div v-if="organData" class="placecard-text">
          <div class="placecard-metadata-content" style="margin-top:10px;">
            <div class="historical-overview-title">Historisk översikt</div>
            <div class="historical-overview">
              <div v-for="item in processedOrganData" :key="item.date" class="overview-row">
                <a href="#" v-if="item.link" @click="handleLinkClick($event, item.link, item)">
                  <div class="date-column" style="font-weight: 500">{{ item.date }}</div>
                  <div class="info-column">
                    <div style="font-weight: 600;">{{ item.work }}</div>
                    <div style="font-weight: 300;">{{ item.builder }}</div>
                    <div style="font-weight: 300;">{{ item.place }}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fog" style=""></div>
  </div>

</template>
<style scoped>
.placeview-main-title{
  pointer-events:none;
  position:absolute;
  z-index:1000;
  font-size:30px;
  padding:25px 25px;
  top:80px;
  text-shadow: 0px 0px 50px rgba(0,0,0,0.8);
  white-space: pre-line;
  line-height: 0.9;
  width: 250px;
  font-weight: 600;
  letter-spacing: 0.05rem;
  transition: all 0.5s ease-in-out;
  color:white;
  float:left;
}
.placecard-text{
  overflow-y:scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  height:46vh;
}

.placecard-text::-webkit-scrollbar {
  width: 0 !important
}


.fog{
    background:linear-gradient(00deg, #ffffff 10%, transparent);;
    bottom:150px;
    width:calc(100% - 50px);
    height:150px;
    position:relative;
    float:left;
    margin-top:-10px;
    margin-left:50px;
    border-radius:0px 0px 16px 16px;
    pointer-events:none;
}
.placecard-title {
  padding-left: 10px;
  font-size:2.2em;
}

.historical-overview-title {
  font-size: 1.5em;
  padding-left: 10px;
  padding-top: 0px;
  font-weight: 300;
}

.historical-overview {
  display: flex;
  flex-direction: column;
  padding-bottom:100px;
}

.overview-row {
  display: flex;
  align-items: center;
  width: calc(100% + 60px);
  margin-left: -30px;
  padding: 15px 30px;
  cursor: pointer;
}

.overview-row:hover {
  background-color: rgb(240, 240, 240);
  text-decoration: none;
  cursor: pointer;
}

.overview-row a {
 float:left;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.overview-row a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;

}

.date-column {
  float:left;
  width: 160px;
  padding: 10px;
  font-size: 25px;
}
@media screen and (max-width: 1400px) {
  .date-column {
  width: 120px;
}
}

.info-column {
  display: flex;
  flex-direction: column;
  padding: 5px;
  text-decoration: none;
}

::v-deep a:hover {
  color: var(--theme-3) !important;
  text-decoration: underline;
}

.short-label {
  width: 100%;
}

.label {
  width: 100%;
}

.mini-map img,
.no-image-placeholder {
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
  overflow-y: hidden;
  height: calc(100vh - 80px);
  padding-bottom: 30px;
  padding-left: 45px;
  padding-right: 20px;
}

/* #app .place-meta-container {} */

.placecard-full {
  margin-top: 80px;
  margin-left: 50px;
  color: black;
  background-color: white;
  padding: 0px;
  box-shadow: -3px 0px 25px rgba(0, 0, 0, 0.3);
  height: calc(100vh - 230px);
  overflow: hidden;
  overflow-y: hidden;
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

.placecard-full .placecard-text {
  padding: 10px 30px 0px 30px;
}

.mini-map {
  width: 100%;
  height: 35vh;
 
  overflow: hidden;
  background-color: grey;
  margin-bottom: 0px;
display:block;
}

.placecard-metadata-description {
  font-size: 0.9em;
}

/* For small screens */
@media screen and (max-width: 900px) {
  .placecard-full {
    margin-top: 40px !important;
  }

  .placeview-main-title{
  font-size:30px;
  padding:25px 25px;
  top:40px;
  line-height: 0.9;
  width: 250px;
}

.mini-map {
  width: 100%;
  height: 50vh;
  overflow: hidden;
  background-color: grey;
  margin-bottom: 0px;
display:block;
}

  .fog{
display:none;
  }

  .placecard-text{
  height:auto;
}
  

  .placecard-title{
    font-size:6em;
  }

  .date-column {
  width: 240px;
  font-size: 40px;
}

.historical-overview a {

  font-size: 24px;
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
}</style>