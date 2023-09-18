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
    <div class="placecard">
      <div class="close-button" @click="deselectPlace">+</div>
      <div class="placecard-top">

        <OpenSeadragon :src="imageUrls" :key="imageUrls.join(',')" class="flex-1" />

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

      <div class="placecard-bottom">
        <div class="placecard-text">
          <div class="placecard-title">{{ selectedFeature.get("name") }}</div>
          <div class="placecard-subtitle">240</div>
          <button class="theme-button">3D model</button>
        </div>
        <div class="placecard-content">
          <div class="placecard-metadata-content" style="height:45px; overflow:hidden;">


            <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag">Grotte Tufarina</div>
            </div>
            <div class="metadata-item">
              <div class="label">Type:</div>
              <div class="tag">Tumulus</div>
            </div>
            <div class="metadata-item">
              <div class="label">Chambers:</div>
              <div class="tag">1</div>
            </div>
            <div class="metadata-item">
              <div class="label">Period:</div>
              <div class="tag">Before 650 BC</div>
            </div>


          </div>
        </div>
      </div>
      <div class="placecard-center-button">
        <router-link :to="`/place/${place.id_}`">
          <button class="theme-button" style="margin-top:20px;">More Info</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
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

.placecard {
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

.placecard-top {
  display: flex;
  height: 50%;
  border-radius: 0px !important;
  min-height: 150px;
  background-color: rgb(60, 60, 60);
}

.image {
  display: block;
  object-fit: cover;
  width: 100% !important;
  height: 100% !important;
  transform: scale(1.2) !important;
}

.placecard-bottom {
  flex-grow: 1 !important;
  border-radius: 0px !important;

}

.placecard-text {
  font-family: "Barlow Condensed", sans-serif;
  color: black;
  font-size: 1.0em;
  text-align: left;
  hyphens: auto;
  line-height: 1.2;
  padding: 10px 20px 0px 20px;

}

.placecard-text p {
  padding: 0px;
}

.placecard-title {
  font-family: 'Teko', sans-serif;
  letter-spacing: -0.0rem;
  text-align: left;
  color: rgb(180, 100, 100);
  padding-bottom: 1px;
  padding-top: 10px;
  font-size: 35px;
}

.placecard-title p {
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

.placecard-subtitle {
  font-family: 'Teko', sans-serif;
  letter-spacing: -0.0rem;
  font-size: 28px;
  text-align: left;
  color: rgb(180, 100, 100);
  width: calc(100%);
  margin-bottom: 10px;
  margin-top: -5px;
  float: left;

}

.placecard-type {
  font-family: 'Teko', sans-serif;
  letter-spacing: -0.0rem;
  font-size: 25px;
  text-align: left;
  color: rgb(180, 100, 100);
  width: calc(100% - 20px);
  margin-bottom: 10px;
  margin-top: -5px;
  float: left;

}

.placecard-content {
  padding: 20px 0px 10px 20px;
}

.placecard-metadata-content {
  padding: 0px 0px 10px 0px;
  font-size: 1.0em;
  line-height: 1.2;
  float: left;
  width: 100%;
}

.placecard-center-button {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 20px;
}

.metadata-item {
  margin-bottom: 5px;
  float: left;
  width: 200px;

}

.placecard-metadata-content .label {
  float: left;
  text-align: right;
  width: 65px;
}

.placecard-metadata-content .tag {
  float: left;
  color: rgb(180, 100, 100);
  padding-left: 10px;
  padding-right: 10px;
  width: auto;

  font-weight: 600;

}

@media screen and (max-width: 900px) {

  .placecard {
  height: calc(100vh - 300px);
  margin-top: 10px;
  
}


  .placecard-title {
    font-size: 50px;
  }

  .placecard-subtitle {
    font-size: 38px;
  }

  /*  .placecard-metadata-content .label {
    font-size:1.3em;
  float: left;
  text-align: left;
  width:80px;
}

.placecard-metadata-content .short {
  width:60px;
  text-align: right;
}

.placecard-metadata-content .tag {
  font-size:1.3em;
  float: left;
  color: rgb(180, 100, 100);
  padding-left: 10px;
  padding-right:10px;
  width:170px;
  font-weight:600;

} */
}
</style>
