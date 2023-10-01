<script setup lang="ts">
import router from './router'
import { ref, inject, onMounted } from "vue"
import markerIcon from "@/assets/marker-red.svg";

const props = defineProps<{
  id: number;
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
const chambers = ref<number | null>(null);
const type = ref<string | null>(null);
const period = ref<string | null>(null);
const subtitle = ref<string | null>(null);
const description = ref<string | null>(null);

const projection = ref("EPSG:4326");
const zoom = ref(16);
const rotation = ref(0);
const strokeWidth = ref(5);
const strokeColor = ref("red");
const center = ref([11.999722, 42.224444])
const minZoom = ref(12)

const format = inject("ol-format");
const geoJson = new format.GeoJSON();

const url = "https://diana.dh.gu.se/api/etruscantombs/geojson/place/" + props.id

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
    const response = await fetch(`https://diana.dh.gu.se/api/etruscantombs/geojson/place/?id=${props.id}`);
    if (response.ok) {
      const data = await response.json();
      const feature = data.features[0];
      const properties = feature.properties;

      // Assign fetched data to Vue Ref variables
      title.value = properties.name || null;
      necropolisName.value = properties.necropolis.text || null;
      chambers.value = properties.number_of_chambers || null;
      type.value = properties.type.text || null;
      period.value = properties.epoch.text || null;
      subtitle.value = properties.subtitle || null;
      description.value = properties.description || null;
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
                <ol-style-icon :src="markerIcon" :scale="1.8" :displacement="[-10, 45]"
                  :anchor="[0.0, 0.0]"></ol-style-icon>
              </ol-style>
            </ol-vector-layer>
          </ol-map>
        </div>
        <div class="placecard-text">
          <div class="placecard-title theme-color-text">Tomb {{ title }}</div>
          <div class="placecard-subtitle theme-color-text">{{ subtitle }}</div>

          <div class="placecard-metadata-content" style="">
            <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag theme-color-text">{{ necropolisName }}</div>
            </div>
            <div class="metadata-item">
              <div class="short-label">Type:</div>
              <div class="tag theme-color-text">{{ type }} </div>
            </div>
            <div class="metadata-item">
              <div class="label">Chambers:</div>
              <div class="tag theme-color-text">{{ chambers }}</div>
            </div>
            <div class="metadata-item">
              <div class="short-label">Period:</div>
              <div class="tag theme-color-text">{{ period }}</div>
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
.place-back-button {
  left: 40px;
  top: 80px;
  background: url(@/assets/backbutton.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
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
  border-radius: 10px !important;
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
  font-size:1.0em;
}




/* For small screens */
@media screen and (max-width: 900px) {

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
    top: 70px;
    width: 50px;
    height: 50px;
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