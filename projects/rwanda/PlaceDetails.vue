<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type { Image, Place } from "./types";
import PreviewImage from "./PreviewImage.vue";
import type { DianaClient } from "@/assets/diana";
//import { stringifyQuery } from "vue-router";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Array<Image>>();
let place = ref() 

watchEffect(async () => {
  if (selectedFeature.value) {
    const place_of_interest = selectedFeature.value.getId();
    place = JSON.parse(JSON.stringify(selectedFeature.value))
    console.log(place)
    images.value = await diana.listAll<Image>("image/", { place_of_interest });
  } else {
    images.value = [];
  }
});
function deselectPlace() {
  selectedFeature.value = undefined;
}

//Capitalize first letter
const capitalize = (word: String) => {
  const first = word[0].toUpperCase()
  const rest = word.slice(1)
  return first + rest
}
</script>

<template>
  <div v-if="selectedFeature" class="detail-view">
    <div class="px-2 py-6">
      <div class="close-button" @click="deselectPlace">+</div>

      <!-- place card -->
      <router-link :to="`/detail/place/${place.id_}`" class="clickable">
        <div class="place-card">
          <div style="width:100%;">
          <p>{{ capitalize(place.values_.type.text) }}</p>
        
          <div v-for="name in place.values_.names">
            <div style="width:100%; display:flex;">
            <span class="lang">{{ name.languages[0].abbreviation }}</span> <div class="long-name"><span class="centered-name">{{ name.text }}</span></div>
          </div>
        </div>
      </div>
          <p class="link">More</p>
        </div>
      </router-link>

      <!-- image card -->
      <div class="flex flex-col gap-4 pointer">
       
        <PreviewImage
          v-for="image in images"
          :key="image.uuid"
          :image="image"
        />
      </div>
    
    </div>
  </div>
</template>

<style>
#app h3 {
  font-size: 35px;
  font-weight: 100;
  margin-left: -2px;
  margin-bottom: 10px;
}

.image-card-white {
  height:auto;
  color:black;
  background-color: white;
  font-size: 14px;
  margin-bottom: 0px;
  border-radius: 10px;
  padding: 10px 10px 15px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
}

.image-card-white:hover {
  cursor:pointer;
  transform:scale(1.05);
}

.image-container {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  height:200px;
}

#app .image {
  display: block;
  object-fit: cover;
  height:100%;
  margin-bottom: 8px;
}

.place-card {
  height:auto;
  color:black;
  background-color: white;
  font-size: 14px;
  margin-bottom: 40px;
  border-radius: 10px;
  padding: 10px 10px 0px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
}

.place-card:hover {
  cursor:pointer;
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

  line.height: 1.0;
  text-align: center; 
  margin-top: 20px; 
  color: rgb(180,100,100);
  padding-bottom:10px;
  font-size:1.3em !important;
}

@media screen and (max-width: 1210px) {

  .long-name{
width:70%;
 
}
}



</style>
