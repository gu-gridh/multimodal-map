<script setup lang="ts">
import { inject, ref, watchEffect } from "vue";
import type { Image, Place } from "./types";
import type { DianaClient } from "@/assets/diana";
import ObjectImage from "./ObjectImage.vue";
import ObjectPlace from "./ObjectPlace.vue"

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true,
  },
});


const diana = inject("diana") as DianaClient;
const object = ref<Image>();
const place = ref<Place>()


watchEffect(async () => {
  if(props.type == 'image'){
    object.value = await diana.get(props.type, props.id, { depth: 1 });
    console.log('image id', props.id)
  }
  if (props.type == 'place') {
    place.value = await diana.get<Place>("geojson/place/", props.id);
  }
});

const objectComponent = {
  image: ObjectImage,
}[props.type];
</script>

<template>
  <article v-if="props.type == 'image'">
    <component :is="objectComponent" :object="object" :id="Number(id)" />
  </article>
  <article v-if="props.type == 'place'">
    <ObjectPlace  :place="place" :id="Number(id)"/>
  </article>
</template>

<style>
#app .detail-view {
  height: 100% !important;
  pointer-events: auto !important;
  overflow-y: scroll !important;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 80px;
}

.metadata {
  float: left;
  width: 450px;
  height: 100vh;
  color: white;
}

.illustration {
  float: left;
  width: calc(100% - 450px);
  background-color: black;
  height: 100vh;
}
</style>
