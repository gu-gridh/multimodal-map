<script setup lang="ts">
import ObjectViewComponent from "./ObjectViewComponentSonora.vue";
import OpenSeadragon from "@/components/OpenSeadragon.vue";
import type { ImageDeep } from "./types";

const props = defineProps<{
  object: ImageDeep;
  id: Number;
}>();

const downloadImage = (fileUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="metadata">
    <!-- <ObjectViewComponent :title="'Tomb ' + object.tomb.name">
      <div class="objects">
      
      <div><div class="label">Type:</div> <div class="data">{{ object.type_of_image[0].text }}</div></div>
      <div v-if="object.author?.firstname"><div class="label">Creator:</div>  <div class="data">{{ object.author.lastname }}, {{ object.author.firstname }}</div></div>
      <div v-if="object.date"><div class="label">Date:</div> <div class="data">{{ object.date }}</div></div>
      <div class="description" v-html="object.description"></div>
      <div v-if="object.tag?.length">
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
      <button class="theme-button download-button" @click="downloadImage(object.file, `${object.title}.tif`)">Download</button>

      <div v-if="object.tomb?.name"><h2>Tomb {{ object.tomb.name }}</h2> </div>
      <div class="description" v-if="object.tomb?.description" v-html="object.tomb.description"></div>
    </div>
    </ObjectViewComponent> -->

    <ObjectViewComponent :title="'TEST'">
      <div class="objects">
        <div><div class="label">Type:</div> </div>
        <div class="label">Creator:  </div>
        <div class="label">Date:</div> 
      </div>
    </ObjectViewComponent>
  </div>

  <section class="illustration flex">
    <!-- <OpenSeadragon :src="`${object.iiif_file}/info.json`" class="flex-1" /> -->
    
    <!-- <div id="ToolbarVertical">
      <a id="full-page" href="#full-page">
        <div id="FullPage" class="NavButton"></div>
      </a>
      <a id="zoom-in" href="#zoom-in">
        <div id="ZoomIn" class="NavButton"></div>
      </a>
      <a id="zoom-out" href="#zoom-out">
        <div id="ZoomOut" class="NavButton"></div>
      </a>
    </div> -->

  </section>
</template>

<style scoped>

.data{
  color:rgb(255,150,150);
}



.theme-button{
  margin-top:20px;
  margin-bottom:10px;
}


</style>
