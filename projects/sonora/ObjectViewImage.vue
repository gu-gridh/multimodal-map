<script setup lang="ts">
import { computed, watch } from "vue";
import ObjectViewComponent from "./ObjectViewComponentSonora.vue";
import OpenSeadragon from "@/components/OpenSeadragonSequence.vue";
import type { ImageDeep } from "./types";

const props = defineProps<{
  object: ImageDeep;
  id: Number;
}>();

const imageUrls = computed(() => {
  const urls = [];
  for (const key in props.object) {
    if (props.object[key].Filename) {
      urls.push(props.object[key].Filename + '/info.json');
    }
  }
  return urls;
});

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
    <ObjectViewComponent :title="'Organ ' + (object?.Titel)">
      <div class="objects">
        <div v-if="object?.Avsändare"><div class="label">Sender:</div> <div class="data">{{ object.Avsändare }}</div></div>
        <div v-if="object?.no_organs"><div class="label">Number of Organs:</div> <div class="data">{{ object.no_organs }}</div></div>
        <div v-if="object?.no_facs"><div class="label">Number of Facsimiles:</div> <div class="data">{{ object.no_facs }}</div></div>
        <div v-if="object?.Arkiv"><div class="label">Arkiv:</div> <div class="data">{{ object.Arkiv }}</div></div>
        <div v-if="object?.Serie"><div class="label">Serie:</div> <div class="data">{{ object.Serie }}</div></div>
        <div v-if="object?.Volym"><div class="label">Volym:</div> <div class="data">{{ object.Volym }}</div></div>
        <div v-if="object?.Fascikel"><div class="label">Fascikel:</div> <div class="data">{{ object.Fascikel }}</div></div>
        <div v-if="object?.Ordningsnummer"><div class="label">Ordningsnummer:</div> <div class="data">{{ object.Ordningsnummer }}</div></div>
        <div v-if="object?.Källa"><div class="label">Källa:</div> <div class="data">{{ object.Källa }}</div></div>
        <div v-if="object?.Källa_info"><div class="label">Källa info:</div> <div class="data">{{ object.Källa_info }}</div></div>
        <div v-if="object?.Typ_av_dokument"><div class="label">Typ av dokument:</div> <div class="data">{{ object.Typ_av_dokument }}</div></div>
        <div v-if="object?.['0']">
          <div v-if="object['0'].org_nr"><div class="label">Org Nr:</div> <div class="data">{{ object['0'].org_nr }}</div></div>
          <div v-if="object['0'].place"><div class="label">Place:</div> <div class="data">{{ object['0'].place }}</div></div>
          <div v-if="object['0'].lng"><div class="label">Longitude:</div> <div class="data">{{ object['0'].lng }}</div></div>
          <div v-if="object['0'].lat" style="margin-bottom:20px;"><div class="label">Latitude:</div> <div class="data">{{ object['0'].lat }}</div></div>
        </div>
        <div class="label" v-html="object ? object.Innehåll : ''"></div>
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
  <OpenSeadragon
      v-if="imageUrls.length > 0"
      :src="imageUrls"
      :showReferenceStrip="true"
      :key="imageUrls.join(',')"
      class="flex-1"
    />
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
  color: var(--theme-6) !important;
}

.metadata{
  background-color:rgb(114,135,138) !important;
}

.theme-button{
  margin-top:20px;
  margin-bottom:10px;
}


</style>
