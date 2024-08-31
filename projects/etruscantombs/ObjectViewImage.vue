<script setup lang="ts">
import ObjectViewComponent from "@/components/ObjectViewComponentReturn.vue";
import OpenSeadragon from "@/components/openseadragon.vue";
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
    <ObjectViewComponent :title="'Tomb ' + object.tomb.name" :backName="object.tomb.name">
      <div class="objects">
        <div class="imagedata">
          <div class="labels">
            <div>
              <div class="label">Type:</div>
              <div class="data">{{ object.type_of_image[0].text }}</div>
            </div>
            <div v-if="object.author?.firstname">
              <div class="label">Creator:</div>
              <div class="data">{{ object.author.lastname }}, {{ object.author.firstname }}</div>
            </div>
            <div v-if="object.date">
              <div class="label">Date:</div>
              <div class="data">{{ object.date }}</div>
            </div>
            <div>
              <div class="label">Dataset:</div>
              <div class="data">CTSG-2015</div>
            </div>
          </div>
          <div class="description" v-html="object.description"></div>
          <div v-if="object.tag?.length">
            Tags:
            {{ object.tag.map((tag) => tag.text).join(", ") }}
          </div>
        </div>
        <div class="theme-button theme-color-background">
        <button class="download-button"
          @click="downloadImage(object.file, `${object.title}.tif`)">Download</button>
        </div>
        <div v-if="object.tomb?.name">
          <h2>Description</h2>
        </div>
        <div class="description" v-if="object.tomb?.description" v-html="object.tomb.description"></div>
      </div>
    </ObjectViewComponent>
  </div>

  <section class="illustration flex">
    <OpenSeadragon :src="`${object.iiif_file}/info.json`" class="flex-1" />

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

<style>

.metadata .meta-title {
  font-weight: 100;
  font-size: 45px;
  line-height: 1.0;
  padding-right: 20px;
  margin-top: 20px;
  width: calc(100% - 25px);
 
}

.metadata .description {
font-weight:300!important;
padding:0px!important;
}

#app .metadata .label {
font-weight:300!important;
}

.metadata .theme-button {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0px 0px;
  width:120px;
  height:auto;
  font-size:20px !important;
}

.metadata .download-button {
  background: url("https://data.dh.gu.se/ui-icons/download_white_circle.png")!important;
  background-size: 25px!important;
  background-repeat: no-repeat!important;
  padding: 6px 10px 6px 40px!important;
  background-position: 6px 6px!important;
  margin-top:0px !important;
}

.meta-top-gradient{
  margin-top:0vh;
 width:400px!important;
 height:30px;
 background: linear-gradient(0deg, rgba(232, 228, 217,0) 00%, rgba(232, 228, 217,1) 90%);
 z-index:100;
 position:absolute;
}

.meta-container{
  background-color: transparent!important;
  overflow-y: auto;
  height:calc(100vh - 80px);
  padding-top:0px;
  padding-bottom:30px;
  padding-left:40px;
  padding-right:0px;
  -ms-overflow-style: none!important;
  scrollbar-width: none;
}

.meta-container::-webkit-scrollbar {
    width: 0px !important;
    }

  .meta-container .back-button {
  left: 0px;
  top: 30px;
  background: url(https://data.dh.gu.se/ui-icons/arrow_back_black_circle.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent!important;
  border-radius: 50%;
  width: 35px!important;
  height: 35px!important;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

@media screen and (max-width: 900px) {
  .meta-container .back-button {
display:none;
}

.metadata .meta-title {

  margin-top: 0px;

 
}

  .meta-top-gradient{
    width:100%!important;
  margin-top:50vh;

}
}

</style>

