<script lang="ts" setup>
import { watchEffect, ref } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import axios from "axios";

const { selectedFeature } = storeToRefs(mapStore());

const objects = ref();

watchEffect(async () => {
  if (selectedFeature.value) {
    const response = await axios.get(
      "https://diana.dh.gu.se/api/rephotography/image/?place=" +
        selectedFeature.value.get("comment")
    );
    objects.value = response.data.results;
  } else {
    objects.value = [];
  }
});
</script>

<template>
  <div v-if="selectedFeature" class="col-start-5 col-span-2">
    <div class="bg-white rounded-lg shadow-lg mb-4">
      <div class="px-8 py-6">
        <h3 class="font-bold">{{ selectedFeature.get("name") }}</h3>

        <div v-for="object in objects" :key="object.uuid">
          <img :src="`${object.iiif_file}/full/380,/0/default.jpg`" />
        </div>
      </div>
    </div>
  </div>
</template>
