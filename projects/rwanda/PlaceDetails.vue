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
    <div class="px-4 py-6">
      <div class="close-button" @click="deselectPlace">+</div>

      <!-- place card -->
      <router-link :to="`/detail/place/${place.id_}`" class="clickable">
        <div class="place-card">
          <p>{{ capitalize(place.values_.type.text) }}</p>
          <div v-for="name in place.values_.names">
            <span class="lang">{{ name.languages[0].abbreviation }}</span> <span>{{ name.text }}</span>
          </div>
          <p class="link">More</p>
        </div>
      </router-link>

      <!-- image card -->
      <div class="flex flex-col gap-10 pointer">
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

.image {
  margin-bottom: 8px;
}

.split-image {
  display: flex;
}
.split-image img {
  width: 50%;
}

.pointer:hover {
  cursor: pointer;
}

.image-container {
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
  height:200px;
}

#app .image {
  display: block;
  object-fit: cover;
}

.lang {
  border-radius: 4px;
  background: rgb(180,100,100);
  padding: 1px;
  display: inline-block;
  width: 25px;
  text-align: center;
  margin: 2px;
}

.place-card {
  color:black;
  background-color: white;
  font-size: 14px;
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 5px;
  padding-top: 10px;
}

.link {
  font-size: 16px;
  text-align: center; 
  padding-top: 10px; 
  color: rgb(180,100,100);
}
</style>
