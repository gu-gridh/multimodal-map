<script setup lang="ts">
import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
import OpenSeadragon from "@/components/OpenSeadragon.vue";
import type { Image } from "./types";

defineProps<{
  object: Image;
  id: Number;
}>();
</script>

<template>
  <div class="metadata">
    <ObjectViewComponent :title="object.title" back="/">
      <p class="my-5 object-title">{{ object.description }}</p>
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

<style>
<<<<<<< Updated upstream
=======

.category-button{
  width:123px !important;
  padding:2px 10px !important;
}

>>>>>>> Stashed changes
.metadata {
  background-color: black !important;
  overflow:hidden !important;
  width: 450px !important;
}

<<<<<<< Updated upstream
=======
.metadata .back-button {

  top: 50px !important;

}


.toPlace {
  margin-top: 50px; 
  color: rgb(180,100,100);
  font-size:1.1em !important;
  cursor: pointer;
}
>>>>>>> Stashed changes

@media screen and (min-width: 1900px) {

.metadata .category-button{
  width:160px!important;
  padding:6px 20px!important;
}
}



@media screen and (max-width: 900px) {

}

</style>
