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
let description = ref("");

//when a place is selected, fetch image and info
watchEffect(async () => {
  if (selectedFeature.value) {
    const place = selectedFeature.value.getId();
    description = selectedFeature.value.get("description") 
    //here we will fetch one "hero" IIIF image instead
    images.value = await diana.listAll<Image>("image", { place }); 
    //response to json (this can be deleted later)
    const imgArr = JSON.parse(JSON.stringify(images.value))
    //if no image, show text?
    if(imgArr.length == 0 ){
      text.value = true
    }
    else {
      text.value = false
    }
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
    <div class="close-button" @click="deselectPlace">+</div>
    <!-- if there are images. This is hard coded -->
    <router-link
      v-for="image in images"
      :key="image.uuid"
      :to="`/place/124`" 
      class="clickable"
    >
      <div class="image-container">
        <img
          :src="`${image.iiif_file}/full/500,/0/default.jpg`"
          class="image"
        />
      </div>
    </router-link>
    <!-- if no image, show something else?-->
    <div v-if="text">
      <div class="image-card">
        <div>
            <div>
              <div>
                <div class="card-text" v-html="description"></div>
              </div>
            </div>
          </div>
        </div>    
    </div>
    <h2>{{ selectedFeature.get("name") }}</h2>
    <p>More info fetched here</p>
    <!-- Link to model that will open up in new window-->
    <button style="background-color: rgb(180, 100, 100)">3D model</button>
    <div>
      <h3>Title from backend</h3>
      <p>Text fetched from backend</p>
    </div>
    <div>
      <router-link to="/place/124">
        <button style="background-color: rgb(180, 100, 100)">More...</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
#app .mapview-preview {
  background-color: white;
  color: black;
  /* height: 100% !important; */
  pointer-events: auto !important;
  overflow-y: scroll !important;
  padding-left: 30px;
  padding-bottom: 80px;
}

.place-title {
  font-family: "Josefin Sans", sans-serif !important;
  letter-spacing: -0.1rem;
  text-align: center;
  width: calc(100% - 20px);
  margin-bottom: -30px;
  margin-top:10px;
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



.image-card {
  display:flex;
  flex-direction:column;
  align-items:center;
  width: auto;
  pointer-events: auto !important;
  border-radius: 10px;
  margin-right: 20px;
  padding: 20px 20px;
  margin-bottom: 20px;
  background-color: rgba(248, 249, 229, 0.95);
  box-shadow: 0px 0px 20px 0 rgba(0, 0, 0, 0.2),
    0 0px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.2s ease-in-out;
}

.card-meta-container {
  color: black;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
  text-align: center;
  margin-top: 10px;
  padding:0px 0px;
}


.image-card:hover .image-container {
  transform: scale(1.03);
  background-color: rgba(248, 249, 229, 1);
}

.image-card:hover .image {
}

.image-card:hover {
  background-color: rgba(248, 249, 229, 1);
}

 .image-container {
  overflow: hidden;
  width: 90%;
  margin-top: 10px;
}

.image {
  display: block;
  object-fit: cover;
  width:100%!important;
  height:100%!important;
  transform:scale(1.2)!important;
}

.close-button {
  width: 45px;
  height: 45px;
  margin-left: calc(50% - 40px) !important;
  margin-top: 0px !important;
  padding: 18px 15px 10px 11px;
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


.card-text {
  font-family: "Barlow Condensed", sans-serif;
  color: black;
  margin-top:10px;
  font-size:1.0em;
  text-align: left;
  hyphens: auto;
  line-height:1.2;
  padding:5px 5px;
}

@media screen and (min-width: 1900px) {

  #app .image-container {
  border-radius:50%;
  overflow: hidden;
  margin-bottom: 8px;
  height: 350px;
  width: 350px;
}

#app .image {
  overflow:hidden!important;
  width:100%!important;
  height:100%!important;
  transform:scale(1.2)!important;
}
}

@media screen and (max-width: 1200px) {

  #app .image-container {
  border-radius:50%!important;
  overflow: hidden!important;
  margin-bottom: 8px;
  height: 160px!important;
  width: 160px!important;
}

#app .image {
  overflow:hidden!important;
  width:100%!important;
  height:100%!important;
  transform:scale(1.2)!important;

}

.place-title p {

  font-size: 20px;
 
}
}

@media screen and (max-width: 900px) {

#app .image-container {
border-radius:8px!important;
overflow: hidden!important;
margin-bottom: 8px;
height: auto!important;
width: 100%!important;
}

#app .image {
overflow:hidden!important;
width:100%!important;
height:100%!important;
transform:scale(1.2)!important;

}

.place-title p {

font-size: 25px;

}

.card-text {
  
  font-size:1.1em;
  padding:5px 15px;
}


}




</style>
