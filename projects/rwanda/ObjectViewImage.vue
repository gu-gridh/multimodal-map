<script setup lang="ts">
import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
import OpenSeadragon from "@/components/OpenSeadragon.vue";
import type { Image } from "./types";
import router from './router'

const props = defineProps<{
  object: Image;
  id: Number;
}>();

const pushToPage = () => {
  router.push({path: `/place/${props.object.place_of_interest.id}`})
  .then(() => {router.go(0)})
}
</script>

<template>
  <div class="metadata">
    <ObjectViewComponent :title="object?.title" back="/">
      <p v-if="object.description" class="my-5 object-title">{{ object?.description }}</p>
      <div v-if="object.informants && object.informants.length > 0">
        <p v-for="info in object?.informants">Informants: {{ info.custom_id }}</p>
      </div>
      <p class="toPlace clickable" @click="pushToPage">Place of interest</p>
    </ObjectViewComponent>
  </div>

  <section class="illustration flex">
    <OpenSeadragon :src="`${object.iiif_file}/info.json`" class="flex-1" />

    <div id="ToolbarVertical">
      <a id="full-page" href="#full-page">
        <div id="FullPage" class="NavButton"></div>
      </a>
      <a id="zoom-in" href="#zoom-in">
        <div id="ZoomIn" class="NavButton"></div>
      </a>
      <a id="zoom-out" href="#zoom-out">
        <div id="ZoomOut" class="NavButton"></div>
      </a>
    </div>

  </section>
</template>

<style scoped>
.metadata {
  background-color: black !important;
  overflow:hidden !important;
  width: 450px !important;
}

.toPlace {
  margin-top: 100px; 
  color: rgb(180,100,100);
  font-size:1.1em !important;
  cursor: pointer;
}



@media screen and (max-width: 900px) {

}

</style>
