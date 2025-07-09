<script setup>
import ObjectViewComponent from "./ObjectViewComponent.vue";
import OpenSeadragon from "./OpenSeadragon.vue";
import { onMounted, ref } from "vue";
import { DianaClient } from "./settings/diana.js";

const props = defineProps({
  id: {
    type: Number
  },
});

const diana = new DianaClient("rwanda");
const object = ref();
const iiif_url = ref();

onMounted(async () => {
  if (props.id) {
    object.value = await diana.get("image", props.id.toString(), { depth: 1 });
    iiif_url.value = object.value.iiif_file
  }
  else console.log("no image id")
})

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<template>
  <div class="flex">
    <div class="metadata">
      <ObjectViewComponent :title="object?.title" back="/">
        <p v-if="object?.description" class="my-5 object-title">{{ object?.description }}</p>
        <p v-if="object?.place_of_interest.description" class="object-description">{{
          capitalize(object?.place_of_interest.description) }}</p>
      </ObjectViewComponent>
    </div>

    <section class="illustration flex">
      <OpenSeadragon v-if="iiif_url" :src="`${iiif_url}/info.json`" class="flex-1" />

    </section>
  </div>
</template>

<style>



</style>
