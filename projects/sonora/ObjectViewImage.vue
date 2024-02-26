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

const placesBeforeFiles = computed(() => {
  const places = [];
  for (const key in props.object) {
    if (props.object[key].Filename) break;
    if (props.object[key].place && props.object[key].org_nr) {
      places.push({ name: props.object[key].place, placeNr: props.object[key].org_nr });
    }
  }
  return places;
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
<ObjectViewComponent :title="'Organ ' + (object['Titel'] ? object['Titel'].data : '')">
      <div class="objects">
        <div v-if="object?.no_organs"><div class="label">{{ $t('number_of_organs') }}:</div> <div class="data">{{ object.no_organs }}</div></div>
        <div v-if="object['Arkiv']">
          <div class="label">{{ object['Arkiv'].label }}:</div>
          <div class="data">{{ object['Arkiv'].data }}</div>
        </div>
        <div v-if="object['Serie']">
          <div class="label">{{ object['Serie'].label }}:</div>
          <div class="data">{{ object['Serie'].data }}</div>
        </div>
        <div v-if="object['Volym']">
          <div class="label">{{ object['Volym'].label }}:</div>
          <div class="data">{{ object['Volym'].data }}</div>
        </div>
        <div v-if="object['Fascikel']">
          <div class="label">{{ object['Fascikel'].label }}:</div>
          <div class="data">{{ object['Fascikel'].data }}</div>
        </div>
        <div v-if="object['Ordningsnummer']">
          <div class="label">{{ object['Ordningsnummer'].label }}:</div>
          <div class="data">{{ object['Ordningsnummer'].data }}</div>
        </div>
        <div v-if="object['Källa']">
          <div class="label">{{ object['Källa'].label }}:</div>
          <div class="data">{{ object['Källa'].data }}</div>
        </div>
        <div v-if="object['Källa_info']">
          <div class="label">{{ object['Källa_info'].label }}:</div>
          <div class="data">{{ object['Källa_info'].data }}</div>
        </div>
        <div v-if="object['Typ_av_dokument']">
          <div class="label">{{ object['Typ_av_dokument'].label }}:</div>
          <div class="data">{{ object['Typ_av_dokument'].data }}</div>
        </div>
        <!-- <div v-if="object?.['0']"> -->
          <!-- <div v-if="object['0'].org_nr"><div class="label">Org Nr:</div> <div class="data">{{ object['0'].org_nr }}</div></div> -->
          <!-- <div v-if="object['0'].place"><div class="label">Place:</div> <div class="data">{{ object['0'].place }}</div></div>
          <div v-if="object['0'].lng"><div class="label">{{ $t('longitude') }}:</div> <div class="data">{{ object['0'].lng }}</div></div>
          <div v-if="object['0'].lat" style="margin-bottom:20px;"><div class="label">{{ $t('latitude') }}:</div> <div class="data">{{ object['0'].lat }}</div></div> -->
        <!-- </div> -->
        <div class="places-list" style="margin-top: 20px;" v-if="placesBeforeFiles.length > 0">
          <h3>{{ $t('found_in') }}:</h3>
          <ul>
            <li v-for="(place, index) in placesBeforeFiles" :key="index">
              <router-link :to="`/place/${place.placeNr}`">{{ place.name }}</router-link>
            </li>
          </ul>
        </div>
        <div class="content" v-if="object['Innehåll']" style="margin-top:20px">
          <div class="label">{{ object['Innehåll'].label }}:</div>
          <div class="data">{{ object['Innehåll'].data }}</div>
        </div>
      </div>
    </ObjectViewComponent>

    <!-- <ObjectViewComponent :title="'TEST'">
      <div class="objects">
        <div><div class="label">Type:</div> </div>
        <div class="label">Creator:  </div>
        <div class="label">Date:</div> 
      </div>
    </ObjectViewComponent> -->
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

.places-list a {
  color: var(--theme-6) !important;
}

.places-list a:hover {
  color: white !important;
  font-size: 110%;
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.content{
  width: 100%;
}
</style>
