<script setup lang="ts">
import { watchEffect, ref, inject, defineComponent, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";
import VueMasonryWall from "@yeger/vue-masonry-wall";
import { useRouter, useRoute } from "vue-router";
import type { Place } from "./types";

const props = defineProps({
  id: {
    type: [String, Number],
  },
});

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;
const images = ref<Array<Image>>([]);
const place = ref() 
const interview: any = ref([]);
const informants:any = ref([]);
let layoutKey = ref(0);
const router = useRouter();
const store = mapStore();
const route = useRoute();

//values
const placeType = ref('')
const placeDescription = ref('')
const placeNames: any = ref([])

//Capitalize first letter since some are lowercase in database
const capitalize = (word: String) => {
  const first = word[0].toUpperCase()
  const rest = word.slice(1)
  return first + rest
}

//fetch place data
const fetchPlaceData =async () => {
    //if place is selected on map
    if(selectedFeature.value != undefined || null) {
        place.value = selectedFeature.value
        console.log('place', place.value)
        placeType.value = capitalize(place.value.values_.type.text)
        placeDescription.value = capitalize(place.value.values_.description)
        placeNames.value = place.value.values_.names
    }
    //if routing from url
    else {
        console.log('fetching place data')
        await fetch(`https://diana.dh.gu.se/api/rwanda/geojson/place/${route.params.placeId}`)
        .then(response => response.json())
        .then(data => {
            place.value = data.properties
            console.log('props place', place.value)
            placeType.value = capitalize(place.value.type.text)
            placeDescription.value = capitalize(place.value.description)
            placeNames.value = place.value.names
        }) 
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
        <!-- place card with place info -->
        <div class="place-card">
            <div style="width:100%;">
                <p>{{ placeType }} <span>- {{ placeDescription }}</span></p>
                <div v-for="name in placeNames">
                    <div style="width:100%; display:flex;">
                        <span class="lang" v-if="name.languages && name.languages.length > 0">{{ name.languages[0].abbreviation }}</span><span v-else></span>
                        <div class="long-name"><span class="centered-name">{{ name.text }}</span><span style="font-weight: lighter;" v-if="name.period?.text">- {{ name.period.text }}</span></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Interview if avaliable -->
    </div>
 </div>
</template>

<style>
.mapview-preview-container{
  height:calc(100vh - 80px);
}

.masonry {
}

#app h3 {
  font-size: 35px;
  font-weight: 100;
  margin-left: -2px;
  margin-bottom: 10px;
}

.image-card-white {
  float:left;
  height:auto;
  color:black;
  background-color: white;
  font-size: 14px;
  margin-bottom: 30px;
  border-radius: 10px;
  padding: 10px 10px 15px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  width:100%!important;
}

.image-card-white:hover {
  cursor:pointer;
  transform:scale(1.05);
}

#app .image-container {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  height:200px;
  width:100%!important;
}

#app .image {
  display: block;
  object-fit: cover;
  width:100%;
  height:100%;
  margin-bottom: 8px;
}

.place-card {
  float:left;
  height:auto;
  width:100%;
  color:black;
  background-color: white;
  font-size: 14px;
  margin-bottom: 40px;
  padding: 10px 10px 10px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  border-radius: 10px !important;
  overflow:hidden;
}

.place-card:hover {
  transform:scale(1.05);
}

.place-card p{
  color:rgb(180,100,100);
  padding-left:3px;
  font-size:1.5em;
}

.lang {
  float:left;
  border-radius: 5px;
  background: rgb(180,100,100);
  padding: 1px;
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height:1.9;
  margin:2px;
  color:white;
}

.long-name{
  width:80%;
  float:left;
  display:inline;
  margin-left:10px;
  vertical-align: middle;
  height:30px;
  line-height:35px;
  overflow:hidden;
}

.centered-name{
  display: inline-block;
  line-height:1.2 !important;
  height:auto!important;
}

.link {
  width:100%;
  height: auto !important;
  line-height: 0.8;
  text-align: center; 
  margin-top: 20px; 
  color: rgb(180,100,100);
  padding-bottom:0px;
  font-size:1.3em !important;
}

@media screen and (max-width: 1200px) {

  .long-name{
width:70%;
 
}
}
</style>