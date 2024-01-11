<script setup lang="ts">
import router from './router'
import { ref, inject, onMounted } from "vue"
import markerIcon from "@/assets/marker-red.svg";

const props = defineProps<{
  id: string;
}>();

const organData = ref(null);

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

// const capitalize = (word: String) => {
//   if (word !== '') {
//     const first = word[0].toUpperCase()
//     const rest = word.slice(1)
//     return first + rest
//   }
//   else return word
// }

// const title = ref<string | null>(null);
// const necropolisName = ref<string | null>(null);
// const chambers = ref<number | null>(null);
// const type = ref<string | null>(null);
// const period = ref<string | null>(null);
// const subtitle = ref<string | null>(null);
// const description = ref<string | null>(null);

// const projection = ref("EPSG:4326");
// const zoom = ref(16);
// const rotation = ref(0);
// const strokeWidth = ref(5);
// const strokeColor = ref("red");
// const center = ref([11.999722, 42.224444])
// const minZoom = ref(12)

// const format = inject("ol-format");
// const geoJson = new format.GeoJSON();

// const url = "https://diana.dh.gu.se/api/etruscantombs/geojson/place/" + props.id

// const setCenter = async () => {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const placeData = await response.json();
//     if (placeData && placeData.geometry && placeData.geometry.coordinates) {
//       center.value = placeData.geometry.coordinates;
//     }
//   } catch (error) {
//     console.error("Error fetching place data:", error);
//   }
// };

// const fetchPlaceData = async () => {
//   try {
//     const response = await fetch(`https://diana.dh.gu.se/api/etruscantombs/geojson/place/?id=${props.id}`);
//     if (response.ok) {
//       const data = await response.json();
//       const feature = data.features[0];
//       const properties = feature.properties;

//       // Assign fetched data to Vue Ref variables
//       title.value = properties.name || null;
//       necropolisName.value = properties.necropolis.text || null;
//       chambers.value = properties.number_of_chambers || null;
//       type.value = properties.type.text || null;
//       period.value = properties.epoch.text || null;
//       subtitle.value = properties.subtitle || null;
//       description.value = properties.description || null;
//     }
//   } catch (error) {
//     console.error("Failed to fetch data", error);
//   }
// };

// Center the map based on fetched data.
onMounted(() => {
  //setCenter();
  //fetchPlaceData();  // Fetch image and details when component is mounted.
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
          <img v-if="organData" :src="organData.Fotografi" alt="Map Image" />
        </div>
        <div v-if="organData" class="placecard-text">
          <div class="placecard-title theme-color-text">Organ {{ id }}</div>
          <div class="placecard-subtitle theme-color-text">{{ subtitle }}</div>

          <div class="placecard-metadata-content" style="">
            <div  class="metadata-item">
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
            <div class="organ-historic-overview" v-html="organData.Historisk_översikt"></div>
        
          </div>
            <div class="placecard-metadata-content" style="margin-top:10px; border-top: 1.5px solid black;">
            <span>Disposition:</span>
            <div class="organ-historic-overview" v-html="organData.Disposition"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-map img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.metadata-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.place-back-button {
  left: 40px;
  top: 80px;
  background: url(@/assets/interface/backbutton.png);
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