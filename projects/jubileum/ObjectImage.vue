<script setup lang="ts">
import DetailPage from "@/components/DetailPage.vue";
import OpenSeadragon from "@/components/OpenSeadragon.vue";
import type { ImageDeep } from "./types";

defineProps<{
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
    <DetailPage :title="object.title" back="/">
      <div class="objects">
        <p v-html="object.description"></p>


      <div v-if="object.creator?.name">By: {{ object.creator.name }}</div>
      <div v-if="object.place?.decription">
        At: {{ object.place.description }}
      </div>
      <div v-if="object.date?.string">On: {{ object.date }}</div>
      <div v-if="object.focus?.text">Focus: {{ object.focus.text }}</div>
      <div v-if="object.tag?.length">
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
      <button @click="downloadImage(object.file, `${object.title}.tif`)">Download Image</button>

    </div>
    </DetailPage>
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
  font-family: "Josefin Sans", sans-serif !important;
}

.metadata .objects {
margin-top:30px;
font-weight:200;
font-size:1.0em;
line-height:1.2;
text-align:left;
padding:0px 40px 0px 0px;
hyphens: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.illustration {
  height: calc(100vh - 80px);
}
</style>
