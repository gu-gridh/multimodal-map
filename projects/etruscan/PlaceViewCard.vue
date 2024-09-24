<script setup lang="ts">
import router from './settings/router'
import { ref, inject, onMounted } from "vue"
import markerIcon from "@/assets/marker-red-etruscan.svg";
import apiConfig from "./settings/apiConfig"

const props = defineProps<{
  id: string;
}>();

const capitalize = (word: String) => {
  if (word !== '') {
    const first = word[0].toUpperCase()
    const rest = word.slice(1)
    return first + rest
  }
  else return word
}

const title = ref<string | null>(null);
const necropolisName = ref<string | null>(null);
const siteName = ref<string | null>(null);
const chambers = ref<number | null>(null);
const type = ref<string | null>(null);
const dataset = ref<string | null>(null);
const period = ref<string | null>(null);
const subtitle = ref<string | null>(null);
const description = ref<string | null>(null);
const projection = ref("EPSG:4326");
const zoom = ref(16);
const rotation = ref(0);
const center = ref([11.999722, 42.224444])
const minZoom = ref(12)

const format = inject("ol-format");
const geoJson = new format.GeoJSON();

const url = `${apiConfig.PLACE}${props.id}`;

const setCenter = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const placeData = await response.json();
    if (placeData && placeData.geometry && placeData.geometry.coordinates) {
      center.value = placeData.geometry.coordinates;
    }
  } catch (error) {
    console.error("Error fetching place data:", error);
  }
};

const fetchPlaceData = async () => {
  try {
    const response = await fetch(`${apiConfig.PLACE}?id=${props.id}&depth=2`);
    if (response.ok) {
      const data = await response.json();
      const feature = data.features[0];
      const properties = feature.properties;

      title.value = properties.name || null;
      necropolisName.value = properties.necropolis?.text || null;
      chambers.value = properties.number_of_chambers || null;
      type.value = properties.type?.text || null;
      dataset.value = properties.dataset?.short_name || null;
      period.value = properties.epoch?.text || null;
      subtitle.value = properties.subtitle || null;
      description.value = properties.description || null;
      siteName.value = properties.necropolis?.site?.text || null;
    }
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
};

// Center the map based on fetched data.
onMounted(() => {
  setCenter();
  fetchPlaceData();  // Fetch image and details when component is mounted.
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
       
          <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:300px">
            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection"
              :minZoom="minZoom" />
            <ol-tile-layer>
              <ol-source-osm />
            </ol-tile-layer>

            <ol-vector-layer>
              <ol-source-vector :url="url" :format="geoJson">
              </ol-source-vector>
              <ol-style>
                <ol-style-icon :src="markerIcon" :scale="0.8" :displacement="[-10, 45]"
                  :anchor="[0.0, 0.0]"></ol-style-icon>
              </ol-style>
            </ol-vector-layer>
          </ol-map>
          <div class="placeview-main-title theme-title-typography theme-color-text">{{ $t('title') }}</div>
        </div>
   
        <div class="placecard-text">
      
          <div class="placecard-title theme-color-text theme-title-typography">{{ dataset }} - {{ title }}</div>
          <div class="placecard-subtitle theme-color-text theme-title-typography">{{ subtitle }}</div>

          <div class="placecard-metadata-content">
            <div class="metadata-item">
              <div class="short-label">{{ $t('site') }}:</div>
              <div class="tag theme-color-text">{{ siteName }}</div>
            </div>

            <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag theme-color-text">{{ necropolisName }}</div>
            </div>
      
            <div class="metadata-item">
              <div class="short-label">{{ $t('type') }}:</div>
              <div class="tag theme-color-text">{{ type }} </div>
            </div>

            <div class="metadata-item">
              <div class="label">{{ $t('chambers') }}:</div>
              <div class="tag theme-color-text">{{ chambers }}</div>
            </div>

            <div class="metadata-item">
              <div class="short-label">{{ $t('period') }}:</div>
              <div class="tag theme-color-text">{{ period }}</div>
            </div>

            <div class="metadata-item">
              <div class="label">{{ $t('dataset') }}:</div>
              <div class="dataset-tag">{{ dataset }}</div>
            </div>

          </div>
          <div class="placecard-metadata-content" style="margin-top:10px;">
            <div class="placecard-metadata-description" v-html="description">
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.placeview-main-title{
  pointer-events:none;
  position:relative;
  z-index:1000;
  font-size:60px;
  padding:25px 25px;
  margin-top:-300px;
  text-shadow: 0px 0px 50px rgba(255,255,255,0.8);
  white-space: pre-line;
  line-height: 0.7;
  width: auto;
  font-weight: 300;
  letter-spacing: 0.05rem;
  transition: all 0.5s ease-in-out;
}
.place-back-button {
  left: 40px;
  top: 80px;
  background: url(https://data.dh.gu.se/ui-icons/arrow_back_black_circle.png);
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
  .main-title{
  font-size:60px !important;
}

.placeview-main-title{

  font-size:45px;

}

.placecard-full {
    margin-top:60px!important;
  }

  #app .place-meta-container {
    position: relative !important;
    margin-top: 0px !important;
    top: 20px !important;
    height: auto;
    width: 100%;
    z-index: 100;
    padding-right: 0px !important;
    padding-left: 0px !important;
    padding-bottom: 0px !important;
    overflow-y: auto;
  }

  .place-back-button {
    left: 30px;
    top: 18px;
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