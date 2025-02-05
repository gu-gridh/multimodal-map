<script setup>
import ObjectViewComponent from "@/components/ObjectViewComponentReturn.vue";
import OpenSeadragon from "@/components/OpenSeadragon.vue";

const props = defineProps({
  object: Object,
  id: Number
});

const downloadImage = (fileUrl, fileName) => {
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

<style scoped>
.description ::v-deep * {
  color: white !important;
}

.metadata .theme-button {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0px 0px;
  width:120px;
  height:auto;
  font-size:20px !important;
}

.download-button {
  background: url("@/assets/interface/downloadbuttonwhite.png");
  background-size: 25px;
  background-repeat: no-repeat; 
  padding: 6px 10px 6px 40px;
  background-position: 6px 6px;
  margin-top:0px !important;
  
}
</style>

