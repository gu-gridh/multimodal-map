<script setup lang="ts">
import { computed } from "vue";
import ObjectViewComponent from "./ObjectViewComponentSonora.vue";
import OpenSeadragon from "@/components/OpenSeadragonSequence.vue";
import type { ImageDeep } from "./types";

const baseImageUrl = "https://img.dh.gu.se/sonora/iiif/SE_ATA_ENSK_31-1_F1_1_";
const imageExtension = "_h.tif/info.json";
const firstImageNumber = 1;
const lastImageNumber = 188;
const hasImages = computed(() => imageUrls.length > 0);


const imageUrls = Array.from({ length: lastImageNumber - firstImageNumber + 1 }, (_, i) => 
  `${baseImageUrl}${String(i + firstImageNumber).padStart(5, '0')}${imageExtension}`
);

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
    <ObjectViewComponent :title="'Organ ' + (object?.Titel)">
      <div class="objects">
        <div><div class="label">Sender:</div> <div class="data">{{ object?.Avsändare }}</div></div>
        <div><div class="label">Number of Organs:</div> <div class="data">{{ object?.no_organs }}</div></div>
        <div><div class="label">Number of Facsimiles:</div> <div class="data">{{ object?.no_facs }}</div></div>
        <div v-if="object?.['0']">
          <div><div class="label">Org Nr:</div> <div class="data">{{ object['0'].org_nr }}</div></div>
          <div><div class="label">Place:</div> <div class="data">{{ object['0'].place }}</div></div>
          <div><div class="label">Longitude:</div> <div class="data">{{ object['0'].lng }}</div></div>
          <div><div class="label">Latitude:</div> <div class="data">{{ object['0'].lat }}</div></div>
        </div>
      </div>
    </ObjectViewComponent>

    <ObjectViewComponent :title="'TEST'">
      <div class="objects">
        <div><div class="label">Type:</div> </div>
        <div class="label">Creator:  </div>
        <div class="label">Date:</div> 
      </div>
    </ObjectViewComponent>
  </div>

  <section class="illustration flex">
    <OpenSeadragon v-if="hasImages" :src="imageUrls" :showReferenceStrip="true" :key="imageUrls.join(',')" class="flex-1" />

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

.data{
  color:rgb(255,150,150);
}



.theme-button{
  margin-top:20px;
  margin-bottom:10px;
}


</style>
