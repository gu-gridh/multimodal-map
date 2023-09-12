<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type {
  Image,
  ImageDeep,
} from "./types";
import type { DianaClient } from "@/assets/diana";
import MapViewPreviewImage from "./MapViewPreviewImage.vue";
import MapViewPreviewModel from "./MapViewPreviewModel.vue";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;

const images = ref<Image[]>();
let text = ref(false)
let place = ref() 
let description = ref("");

//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    const place_of_interest = selectedFeature.value.getId();
    place = JSON.parse(JSON.stringify(selectedFeature.value))
    const placeId = selectedFeature.value.getId();  // Get ID of selected place
    images.value = await diana.listAll<Image>("image", { place: placeId });  // Use place ID to fetch images
  } else {
    images.value = [];
  }
});

//deselecting place will close the preview
function deselectPlace() {
  selectedFeature.value = undefined;
}
</script>

<template>
  <div v-if="selectedFeature" class="mapview-preview" @click="deselectPlace">

    <div class="place-card">
    <div class="close-button" @click="deselectPlace">+</div>
   
    <router-link :to="`/place/${place.id_}`"
      v-for="image in images"
      :key="image.uuid"
      class="clickable"
    >
      <div class="image-container">
        <img
          :src="`${image.iiif_file}/full/500,/0/default.jpg`"
          class="image"
        />
      </div>
    </router-link>

   
        <div class="card-text">
          <div class="place-title">{{ selectedFeature.get("name") }}</div>
          <button class="model-button">3D model</button>

    
      </div>    
    </div>
  </div>

</template>

<style scoped>
#app .mapview-preview {
  background-color: transparent;
  color: black;
  /* height: 100% !important; */
  pointer-events: auto !important;
  overflow-y: scroll !important;
  padding-left: 30px;
  padding-bottom: 80px;
}

.place-card {
  display:flex;
  flex-direction:column;
  align-items:left;
  width: auto;
  height: calc(100vh - 200px);
  pointer-events: auto !important;
  border-radius: 15px;
  margin-right: 30px;
  margin-top: 40px;
  padding: 0px;
  margin-bottom: 20px;
  overflow:hidden;
  overflow-y:scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-color: rgba(250, 250, 250, 1.0)!important;
  box-shadow: 0px 0px 30px 0 rgba(0, 0, 0, 0.3),
    0 0px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.1s ease-in-out;
}

.close-button {
  position:absolute;
  width: 35px;
  height: 35px;
  margin-left: calc(10px) !important;
  margin-top: 10px !important;
  padding: 14px 12px 10px 7px;
  line-height: 1px;
  font-size: 50px;
  font-weight: 100;
  border-radius: 50%;
  color: white;
  transform: rotate(45deg);
  cursor: pointer;
  pointer-events: auto;
  z-index:1000;
  background-color: rgb(180, 100, 100);
  margin-bottom: 0px;
}

.close-button:hover {
  background-color: rgb(140, 60, 60);
}

.image-container {
  overflow: hidden;
  width: 100%;
  height:40vh;
  margin-top: 0px;
  border-radius:0px !important;
}
.image {
  display: block;
  object-fit: cover;
  width:100%!important;
  height:100%!important;
  transform:scale(1.2)!important;
}

.card-text {
  font-family: "Barlow Condensed", sans-serif;
  color: black;
  margin-top:0px;
  font-size:1.0em;
  text-align: left;
  hyphens: auto;
  line-height:1.2;
  padding:10px 20px 20px 20px;
  float:left;
}

.card-text p{
padding: 0px;
}

.place-title {
  letter-spacing: -0.1rem;
  text-align: left;
  color: rgb(180, 100, 100);
  width: calc(100% - 20px);
  margin-bottom: 10px;
  margin-top:10px;
  float:left;
  font-size:35px;
}

.place-title p {
  color: white;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.0;
  background-color: rgb(180, 100, 100);
  border-radius: 10px 10px 0 0;
  padding: 20px 10px 15px 10px;
  width: 100%;
  opacity: 0.99;
  box-shadow: 0px -5px 10px 0 rgba(0, 0, 0, 0.2),
    0 0px 0px 0 rgba(0, 0, 0, 0.19);
}

.model-button{
  background-color: rgb(180, 100, 100);
  border-radius:5px;
  padding:5px 10px;
  color:white;
}


@media screen and (min-width: 1900px) {

}

@media screen and (max-width: 1200px) {

}

@media screen and (max-width: 900px) {


}




</style>
