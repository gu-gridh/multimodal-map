<script setup>
import { ref, inject, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import VueMasonryWall from "@yeger/vue-masonry-wall";
import { useRouter, useRoute } from "vue-router";
import {fromLonLat} from 'ol/proj.js';
import * as turf from '@turf/turf'
import { nextTick } from "vue";
import { DianaClient } from "./settings/diana.js";

const { selectedFeature } = storeToRefs(mapStore());
const diana = new DianaClient("rwanda");
let layoutKey = ref(0);
const router = useRouter();
const store = mapStore();
const route = useRoute();
//values
const images = ref([]);
const place = ref()
const interviews = ref([]);
const placeType = ref()
const placeDescription = ref()
const placeNames = ref([])
const placeGeoJson = ref()
const coordinates = ref([])
const documents = ref([])

//Capitalize first letter since some are lowercase in database
const capitalize = (word) => {
  if (word[0]) {
    const first = word[0].toUpperCase()
    const rest = word.slice(1)
    return first + rest
  }
  else return
}
//fetch interviews
const fetchInterviews = async (id) => {
  interviews.value = []
  const data = await diana.listAll("text", {});
  //fetch all interviews and find the ones that matches the place id
  interviews.value = data.filter((interview) => interview.place_of_interest === id);
  //fetch the informants of the interviews
  for (let i = 0; i < interviews.value.length; i++) {
    const informant = await diana.get("informant", interviews.value[i].informants[0]);
    //add the informant to the interview
    interviews.value[i].informant = informant;
  }
}
const fetchImages = async (id) => {
  if(isNaN(id)) return
  else
  images.value = await diana.listAll("image", { place_of_interest: id });
}
const featureZoom = 18;

const zoomMap = () => {
    const geometry = placeGeoJson.value
    if (geometry.type == "Point") {
        const center = geometry.coordinates
        coordinates.value = center.geometry.coordinates
        store.updateCenter(fromLonLat(coordinates.value))
        store.updateZoom(featureZoom)
    }
    if(geometry.type == "MultiPolygon" ) {
        const multipolygon = turf.multiPolygon(geometry.coordinates)
        const center = turf.pointOnSurface(multipolygon)
        coordinates.value = center.geometry.coordinates
        store.updateCenter(fromLonLat(coordinates.value))
        store.updateZoom(featureZoom)
    }
    if (geometry.type === "MultiLineString") {
        const multilinestring = turf.multiLineString(geometry.coordinates)
        const center = turf.pointOnSurface(multilinestring)
        coordinates.value = center.geometry.coordinates
        store.updateCenter(fromLonLat(coordinates.value))
        store.updateZoom(featureZoom)
    }
    if (geometry.type == "Polygon" ) {
        const polygon = turf.polygon(geometry.coordinates)
        const center = turf.pointOnSurface(polygon)
        coordinates.value = center.geometry.coordinates
        
        store.updateCenter(fromLonLat(coordinates.value))
        store. updateZoom(featureZoom)
    }
    if (geometry.type == "LineString" ) {
        const polygon = turf.lineString(geometry.coordinates)
        const center = turf.pointOnSurface(polygon)
        coordinates.value = center.geometry.coordinates
        store.updateCenter(fromLonLat(coordinates.value))
        store.updateZoom(featureZoom)
    }
    else {
      return
    }
}

const fetchDocuments = async (id) => {
  if(id){
    documents.value = await diana.listAll("document", { place_of_interest: id });
  }
  else return
}

//fetch place data
const fetchPlaceData =async () => {  
    //if place is selected on map
    if(selectedFeature.value !== undefined || null) {
        place.value = selectedFeature.value
        placeType.value = capitalize(place.value.values_.type.text)
        placeDescription.value = capitalize(place.value.values_.description)
        placeNames.value = place.value.values_.names
        const placeId = selectedFeature.value?.getId()
        fetchInterviews(placeId)
        fetchImages(Number(placeId))
        fetchDocuments(Number(placeId))
    }
    else return

}
onMounted(async ()  => {
  if(route.params.placeId){
     await fetch(`https://diana.dh.gu.se/api/rwanda/geojson/place/${route.params.placeId}`)
        .then(response => response.json())
        .then(data => {
            place.value = data.properties
            placeType.value = capitalize(place.value.type.text)
            placeDescription.value = capitalize(place.value.description)
            placeNames.value = place.value.names
            placeGeoJson.value = data.geometry
        })
        const placeId = Number(route.params.placeId)
        fetchInterviews(placeId)
        fetchImages(placeId)
        fetchDocuments(placeId)
        zoomMap()
  }
  else fetchPlaceData()
})

watch(selectedFeature, () => {
  fetchPlaceData()
})

function deselectPlace() {
  router.push("/")
  selectedFeature.value = undefined;
  place.value = undefined
  placeGeoJson.value = undefined
  store.selectedFeature = undefined
  nextTick(() => {
    store.updateCenter([3346522.1909503858, -217337.69352852934])
    store.updateZoom(15)
  })
}

</script>
<template>
<div class="mapview-preview">
    <div class="py-6">
        <div class="close-button" @click="deselectPlace">+</div>
    </div>
        <!-- place card with place info -->
        <div class="place-card">
            <div style="width:100%;">
                <p>{{ placeType }} <span>- {{ placeDescription }}</span></p>
                <div v-for="name in placeNames">
                    <div style="width:100%; display:flex; align-items: center;">
                        <span class="lang" v-if="name.languages && name.languages.length > 0">{{ name.languages[0].abbreviation }}</span>
                        <div class="long-name"><span class="centered-name">{{ name.text }} <span style="font-weight: lighter; " v-if="name.period?.text">- {{ name.period.text }}</span></span></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Interview if avaliable -->
        <div class="place-card citation" v-if="interviews.length > 0">
            <span v-for="inter in interviews">
                <p>{{ inter.title }}</p>
                <p style="font-style: italic;">{{ inter.text}}</p>
                <p>/{{ inter.informant.custom_id }}</p>
            </span>
             
            <!-- <button v-if="showMore" @click="interviewsToShow += 1">Show more</button> -->
        </div>
        <!-- If documents avaliable-->
        <div v-if="documents.length" class="document">
          Documents
          <div v-for="doc in documents"> 
            <a :href="doc.filename" target="_blank">
              <div style="font-style: italic;">{{doc.title}}</div>
            </a>
          </div>
        </div>
        <!-- Images -->
        <div v-if="images.length != 0" class="masonry">
        <div>
          <p>Images</p>
          <VueMasonryWall :key="layoutKey" class="masonry-wall" :items="images" :column-width="150" :gap="10">
            <template v-slot:default="{ item }">
              <router-link :key="item.uuid" :to="`/image/${item.id}`" class="grid-item">
                <img :src="`${item.iiif_file}/full/450,/0/default.jpg`" />
                <div class="grid-item-info">
                  <div class="grid-item-info-meta">
                    <h1>{{ item.title }}</h1>
                  </div>
                </div>
              </router-link>
            </template>
          </VueMasonryWall>
        </div>
      </div>
    </div>
</template>
<style>
#app .mapview-preview {
  display:block;
  height: calc(100vh - 80px) !important;
  pointer-events: auto !important;
  overflow-y: auto !important;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 100px;
}
.mapview-preview-container {
  height: calc(100vh - 80px);
}
#app .masonry-wall {
  z-index: auto !important;
}
.masonry {
  width: 100%;
}
#app h3 {
  font-size: 35px;
  font-weight: 100;
  margin-left: -2px;
  margin-bottom: 10px;
}
.image-card-white {
  float: left;
  height: auto;
  color: black;
  background-color: white;
  font-size: 14px;
  margin-bottom: 30px;
  border-radius: 10px;
  padding: 10px 10px 15px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  width: 100% !important;
}
.image-card-white:hover {
  cursor: pointer;
  transform: scale(1.05);
}
#app .image-container {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  height: 200px;
  width: 100% !important;
}
#app .image {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
  margin-bottom: 8px;
}
.place-card {
  float: left;
  height: auto;
  width: 100%;
  color: black;
  background-color: white;
  font-size: 1.0vw;
  line-height: 1.2;
  margin-bottom: 40px;
  padding: 10px 10px 10px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  border-radius: 10px !important;
  overflow: hidden;
}
.citation {
  font-size: 0.7vw;
}
.place-card p {
  color: var(--theme-2);
  padding-left: 3px;
  font-size: 1.5em;
}
.lang {
  border-radius: 5px;
  background: var(--theme-2);
  padding: 4px;
  display: inline-block;
  width: auto;
  height: auto;
  text-align: center;
  line-height: 1.7;
  margin: 2px;
  color: white;
  font-size: small;
  min-width:55px;
}
.long-name {
  
  margin-left: 10px;
  vertical-align: middle;
  line-height: 1.3 !important;    
  
}
.centered-name {
  
  line-height: 1.3 !important;
  height: auto !important;
}
.link {
  width: 100%;
  height: auto !important;
  line-height: 0.8;
  text-align: center;
  margin-top: 20px;
  color: var(--theme-2);
  padding-bottom: 0px;
  font-size: 1.3em !important;
}
@media screen and (max-width: 1200px) {
  .long-name {
    width: 70%;
  }
}

.document {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>