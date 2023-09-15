<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import type {
  Image,
  ImageDeep,
} from "./types";
import type { DianaClient } from "@/assets/diana";
import OpenSeadragon from "@/components/OpenSeadragonSequence.vue";
import MapViewPreviewImage from "./MapViewPreviewImage.vue";
import MapViewPreviewModel from "./MapViewPreviewModel.vue";

const { selectedFeature } = storeToRefs(mapStore());
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>();
const imageUrls = ref<string[]>([]);
let text = ref(false)
let place = ref()
let description = ref("");





//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    place = JSON.parse(JSON.stringify(selectedFeature.value))
    const placeId = selectedFeature.value.getId();  // Get ID of selected place
    images.value = await diana.listAll<Image>("image", { place: placeId });  // Use place ID to fetch images
    imageUrls.value = images.value.map(image => `${image.iiif_file}/info.json`);
  } else {
    images.value = [];
    imageUrls.value = [];
  }
});

//deselecting place will close the preview
function deselectPlace() {
  selectedFeature.value = undefined;
}
</script>

<template>
  <div v-if="selectedFeature" class="mapview-preview">
    <div class="place-card">
      <div class="close-button" @click="deselectPlace">+</div>
      <div  class="place-card-top">

        <OpenSeadragon
          :src="imageUrls" 
          :key="imageUrls.join(',')" 
          class="flex-1" 
        />

        <!-- Code to list all images -->
        <!-- <router-link :to="`/place/${place.id_}`"
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
      </router-link> -->
      </div>

      <div class="place-card-bottom">
        <div class="card-text">
          <div class="place-title">{{ selectedFeature.get("name") }}</div>
          <button class="theme-button">3D model</button>
        </div>
      </div>
          <div class="center-button">
            <router-link :to="`/place/${place.id_}`">
              <button class="theme-button" style="margin-top:20px;">More Info</button>
           </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app .mapview-preview {
  background-color: transparent;
  color: black;
  /* height: 100% !important; */
  pointer-events: none !important;
  overflow: hidden !important;
  padding-left: 30px;
  padding-bottom: 80px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}


#app .mapview-preview::-webkit-scrollbar {
    width: 0 !important
    }

.place-card {
  display: flex;
  flex-direction: column;
  align-items: left;
  width: auto;
  height: calc(100vh - 220px);
  pointer-events: auto !important;
  border-radius: 15px;
  margin-right: 30px;
  margin-top: 70px;
  padding: 0px;
  margin-bottom: 20px;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-color: rgba(250, 250, 250, 1.0) !important;
  box-shadow: 0px 0px 30px 0 rgba(0, 0, 0, 0.3),
    0 0px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.1s ease-in-out;
}
.place-card::-webkit-scrollbar {
    width: 0 !important
    }

  

.close-button {
  position: absolute;
  width: 35px;
  height: 35px;
  right: calc(40px) !important;
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
  z-index: 1000;
  background-color: rgb(180, 100, 100);
  margin-bottom: 0px;
}
.close-button:hover {
  background-color: rgb(140, 60, 60);
}

.place-card-top {
  display: flex;
  height:50%;
  border-radius: 0px !important;
  min-height:150px;
  background-color:rgb(60,60,60);
}

.image {
  display: block;
  object-fit: cover;
  width: 100% !important;
  height: 100% !important;
  transform: scale(1.2) !important;
}

.place-card-bottom {
  flex-grow: 1 !important;
  border-radius: 0px !important;

}
.card-text {
  font-family: "Barlow Condensed", sans-serif;
  color: black;
  font-size: 1.0em;
  text-align: left;
  hyphens: auto;
  line-height: 1.2;
  padding: 10px 20px 0px 20px;
 
}

.card-text p {
  padding: 0px;
}

.place-title {
  font-family: 'Teko', sans-serif;
  letter-spacing: -0.0rem;
  text-align: left;
  color: rgb(180, 100, 100);
  padding-bottom: 10px;
  padding-top: 10px;
  font-size: 35px;
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

.center-button {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 20px;
}
</style>
