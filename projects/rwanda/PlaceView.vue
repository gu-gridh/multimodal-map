<script setup lang="ts">
import { ref, inject, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";
import VueMasonryWall from "@yeger/vue-masonry-wall";
import { useRouter, useRoute } from "vue-router";
import {fromLonLat} from 'ol/proj.js';
import * as turf from '@turf/turf'


const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;
let layoutKey = ref(0);
const router = useRouter();
const store = mapStore();
const route = useRoute();
//values
const images = ref<Array<Image>>([]);
const place = ref()
const interviews: any = ref([]);
const informants: any = ref([]);
const placeType = ref()
const placeDescription = ref()
const placeNames: any = ref([])
const placeGeoJson = ref()
const coordinates: any = ref([])

//Capitalize first letter since some are lowercase in database
const capitalize = (word: String) => {
  if (word[0]) {
    const first = word[0].toUpperCase()
    const rest = word.slice(1)
    return first + rest
  }
  else return
}
//fetch informants
const fetchInformants = () => {
  informants.value = []
  for (let j = 0; j < interviews.value.length; j++) {
    for (let i: number = 0; i < interviews.value[0].informants.length; i++) {
      fetch(`https://diana.dh.gu.se/api/rwanda/informant/${interviews.value[i].informants[i]}`)
        .then(response => response.json())
        .then(data => {
          informants.value.push(data)
        })
    }
  }
}
//fetch interviews
const fetchInterviews = async (id: any) => {
  interviews.value = []
  const data = await diana.listAll("text/");
  const newInterview = data.find((interview: any) => interview.place_of_interest === id);
  if (newInterview) {
    const seenInterviews = new Set(interviews.value.map((i: { id: any }) => i.id));
    if (!seenInterviews.has(newInterview.id)) {
      interviews.value.push(newInterview);
    }
    fetchInformants();
  } else {
    informants.value = [];
  }
}
const fetchImages = async (id: Number) => {
  images.value = await diana.listAll<Image>("image/", { place_of_interest: id });
  console.log(images.value)
}
const featureZoom = 19;

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
        store. updateZoom(featureZoom)
    }
    if (geometry.type == "MultiLineString") {
        const multilinestring = turf.multiLineString(geometry.coordinates)
        const center = turf.pointOnSurface(multilinestring)
        coordinates.value = center.geometry.coordinates
        store.updateCenter(fromLonLat(coordinates.value))
        store. updateZoom(featureZoom)
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
        store. updateZoom(featureZoom)
    }
    else console.log("not found")
}
//fetch place data
const fetchPlaceData =async () => {
    //if place is selected on map
    if(selectedFeature.value != undefined || null) {
        place.value = selectedFeature.value
        placeType.value = capitalize(place.value.values_.type.text)
        placeDescription.value = capitalize(place.value.values_.description)
        placeNames.value = place.value.values_.names
        const placeId = selectedFeature.value?.getId()
        fetchInterviews(placeId)
        fetchImages(Number(placeId))
    }
    //if routing from url
    else {
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
        zoomMap()
    }
}
onMounted(() => {
  fetchPlaceData()
})
watch(selectedFeature, () => {
  fetchPlaceData()
})

function deselectPlace() {
  selectedFeature.value = undefined;
  //change zoom to original state
  store.updateCenter([3346522.1909503858, -217337.69352852934])
  store.updateZoom(15)
  router.push(`/`)
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
                    <div style="width:100%; display:flex;">
                        <span class="lang" v-if="name.languages && name.languages.length > 0">{{ name.languages[0].abbreviation }}</span>
                        <div class="long-name"><span class="centered-name">{{ name.text }}</span><span style="font-weight: lighter;" v-if="name.period?.text">- {{ name.period.text }}</span></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Interview if avaliable -->
        <div class="place-card" v-if="interviews && interviews.length != 0">
            <span v-for="text in interviews">
                <p>{{ text.title }}</p>
                <p style="font-style: italic;">{{ text.text}}</p>
            </span>
            <!-- Informants if avaliable -->
            <div v-if="informants && informants.length != 0">
                 <span v-for="informant in informants">
                    <p>/{{ informant.custom_id }}</p>
                </span>
            </div>
        </div>
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
  overflow-y: scroll !important;
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
  color: rgb(180, 100, 100);
  padding-left: 3px;
  font-size: 1.5em;
}
.lang {
  float: left;
  border-radius: 5px;
  background: rgb(180, 100, 100);
  padding: 1px;
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 1.9;
  margin: 2px;
  color: white;
}
.long-name {
  width: 80%;
  float: left;
  display: inline;
  margin-left: 10px;
  vertical-align: middle;
  height: 30px;
  line-height: 35px;
  overflow: hidden;
}
.centered-name {
  display: inline-block;
  line-height: 1.2 !important;
  height: auto !important;
}
.link {
  width: 100%;
  height: auto !important;
  line-height: 0.8;
  text-align: center;
  margin-top: 20px;
  color: rgb(180, 100, 100);
  padding-bottom: 0px;
  font-size: 1.3em !important;
}
@media screen and (max-width: 1200px) {
  .long-name {
    width: 70%;
  }
}
</style>