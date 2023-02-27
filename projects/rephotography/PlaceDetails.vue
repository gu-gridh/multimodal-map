<script lang="ts" setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import axios from "axios";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";

const { selectedFeature } = storeToRefs(mapStore());

const objects = ref<Array<Image | any>>();

const diana = inject("diana") as DianaClient;

watchEffect(async () => {
  if (selectedFeature.value) {
    const response = await diana?.list("image", {
      place: selectedFeature.value.get("comment"),
    });
    objects.value = response.results;
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

        <router-link
          v-for="object in objects"
          :key="object.uuid"
          :to="`/detail/image/1`"
          class="clickable"
        >
          <div>
            <img :src="`${object.iiif_file}/full/380,/0/default.jpg`" />
            <div>{{ object.title }}</div>
            <div>{{ object.description }}</div>
            <div>{{ object.date }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
