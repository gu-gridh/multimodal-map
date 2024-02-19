<script setup lang="ts">
import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
import OpenSeadragon from "@/components/OpenSeadragon.vue";
import type { Image } from "./types";
import { onMounted, ref, inject } from "vue";
import type { DianaClient } from "@/assets/diana";

const props = defineProps<{
  id: Number;
}>();

const diana = inject("diana") as DianaClient;

const object = ref();
const iiif_url = ref<string>();

onMounted(async() => {
  if (props.id) {
    object.value = await diana.get("image", props.id.toString(), { depth: 1 });
    iiif_url.value = object.value.iiif_file
  }
  else console.log("no image id")
})

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

</script>

<template>
  <div class="flex">
  <div class="metadata">
    <ObjectViewComponent :title="object?.title" back="/">
      <p v-if="object?.description" class="my-5 object-title">{{ object?.description }}</p>
      <p v-if="object?.place_of_interest.description" class="object-description">{{ capitalize(object?.place_of_interest.description) }}</p>
    </ObjectViewComponent>
  </div>

  <section class="illustration flex">
    <OpenSeadragon v-if="iiif_url" :src="`${iiif_url}/info.json`" class="flex-1" />

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
</div>
</template>

<style>

.category-button{
  width:123px !important;
  padding:2px 10px !important;
}
.metadata {
  background-color: black !important;
  overflow:hidden !important;
  margin-bottom: 10px;
  padding: 0px 0px;
  max-width:350px;
}

.object-description {
  padding: 6px 20px 0px 0px;
  font-size: 24px;
}

.toPlace {
  margin-top: 50px; 
  color: rgb(180,100,100);
  font-size:1.1em !important;
  cursor: pointer;
}

@media screen and (min-width: 1900px) {
.metadata .category-button{
  width:140px!important;
padding:5px 18px!important;
margin-top:50px!important;
}

.metadata .back-button{
  margin-top:5px;
}


}



@media screen and (max-width: 900px) {

}

</style>
