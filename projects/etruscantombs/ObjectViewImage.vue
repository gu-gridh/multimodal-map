<script setup lang="ts">
import ObjectViewComponent from "@/components/ObjectViewComponentReturn.vue";
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
    <ObjectViewComponent :title="object.title">
      <div class="objects">
      <p v-html="object.description"></p>
      <div v-if="object.author?.firstname"><div class="label">Author:</div>  <div class="data">{{ object.author.lastname }}, {{ object.author.firstname }}</div></div>
      <div v-if="object.date"><div class="label">Date:</div> <div class="data">{{ object.date }}</div></div>
      <div v-if="object.tag?.length">
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
      <button class="category-button" @click="downloadImage(object.file, `${object.title}.tif`)">Download</button>

      <div v-if="object.tomb?.name"><h2>Tomb:</h2>  <div class="data">{{ object.tomb.name }}</div></div>
      <div v-if="object.tomb?.description" v-html="object.tomb.description"></div>
    </div>
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
.metadata .object-title {

}

h2{
  font-size:1.5em;
  margin-top:30px;
  margin-bottom:5px;
  display: inline-block;
}


.metadata .objects {
margin-top:30px;
font-weight:200;
font-size:1.2em;
line-height:1.2;
text-align:left;
padding:0px 40px 0px 0px;
}
.metadata .objects .label {
width:50px;
float:left;
}
.metadata .objects .data {
color:rgb(255,150,150);
display:inline;
}
.illustration {
  height: calc(100vh - 80px);
}

.category-button{
  margin-top:30px;
  color:white !important;
  cursor:pointer;
  font-size:1.1em;
  padding:8px 16px;
  background-color:rgb(180,100,100)!important;
  background: url("@/assets/interface/downloadbuttonwhite.png");
  background-size: 25px;
      background-repeat: no-repeat;
      padding-left: 45px;
      background-position: 8px 8px;
}
</style>
