<script setup lang="ts">
import { computed, watch } from "vue";
import ObjectViewComponent from "./ObjectViewComponentSonora.vue";
import OpenSeadragon from "./OpenSeadragonSonora.vue";
import type { ImageDeep } from "./types";

const props = defineProps<{
  object: ImageDeep;
  id: Number;
}>();

const metadataFields = computed(() => {
  return Object.entries(props.object).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object' && 'label' in value && 'data' in value) {
      acc[key] = value;
    }
    return acc;
  }, {});
});

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


</script>

<template>
  <div class="metadata">
    <ObjectViewComponent :title="(object['Titel'] ? object['Titel'].data : '')">
      <div class="objects">
        <div v-for="(field, key) in metadataFields" :key="key">
          <div class="label">{{ field.label }}:</div>
          <div class="data">{{ field.data }}</div>
        </div>
        <div class="places-list" style="margin-top: 20px;" v-if="placesBeforeFiles.length > 0">
          <h3>{{ $t('found_in') }}:</h3>
          <ul>
            <li v-for="(place, index) in placesBeforeFiles" :key="index">
              <router-link :to="`/place/${place.placeNr}`">{{ place.name }}</router-link>
            </li>
          </ul>
        </div>
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
.back-button {
  left: 20px;
  top: 40px;
  background: url(@/assets/backbutton.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 20px!important;
  height: 20px!important;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
}

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
