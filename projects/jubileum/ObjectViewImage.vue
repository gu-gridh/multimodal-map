<script setup>
import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
import OpenSeadragon from "/OpenSeadragon.vue";

const props = defineProps({
  object: {
    type: Object
  },
  id: {
    type: Number
  },
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
    <ObjectViewComponent :title="object.title" back="/">
      <div class="objects">
        <p v-html="object.description"></p>


      <div v-if="object.creator?.name">By: {{ object.creator.name }}</div>
      <div v-if="object.date">On: {{ object.date }}</div>
      <div v-if="object.focus?.text">Focus: {{ object.focus.text }}</div>
      <div v-if="object.tag?.length">
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
      <h2>Om platsen  </h2>
      <div v-if="object.place?.description" v-html="object.place.description"></div>

      <button class="category-button" @click="downloadImage(object.file, `${object.title}.tif`)">Ladda ner bild</button>

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
  .metadata{
    background-color: rgb(234, 228, 219) !important;
    color:black!important;
  }
.metadata .object-title {
  font-family: "Josefin Sans", sans-serif !important;

}

#app .meta-top-gradient{
 background: linear-gradient(0deg, rgba(234, 228, 219, 0) 00%, rgba(234, 228, 219) 90%)!important;
}

.metadata .back-button {
  left: 20px;
  top: 43px;
  background-image:url(https://data.dh.gu.se/ui-icons/arrow_back_black_circle.png)!important;
  background-color: rgba(35, 35, 35, 0.0);
}

#app .meta-container a {
 color:rgb(180,100,100);
}

h2{
  font-size:1.5em;
  margin-top:30px;
  margin-bottom:5px;
}


.metadata .objects {
margin-top:30px;
font-weight:200;
font-size:1.0em;
line-height:1.2;
text-align:left;
padding:0px 40px 0px 0px;
font-weight: 300;
}
.illustration {
  height: calc(100vh - 80px);
}

.metadata .category-button{
  margin-top:30px;
  cursor:pointer;
  font-size:1.1em;
  padding:8px 16px;
  background: url("@/assets/interface/downloadbuttonwhite.png");
  background-size: 25px;
      background-repeat: no-repeat;
      padding-left: 45px;
      background-position: 8px 5px;

}
</style>
