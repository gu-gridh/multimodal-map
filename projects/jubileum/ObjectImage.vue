<script setup lang="ts">
import DetailPage from "@/components/DetailPage.vue";
import OpenSeadragon from "@/components/OpenSeadragon.vue";
import type { ImageDeep } from "./types";

defineProps<{
  object: ImageDeep;
  id: Number;
}>();
</script>

<template>
  <div class="metadata">
    <DetailPage :title="object.title" back="/">
      <p class="my-2">{{ object.description }}</p>
      <div v-if="object.creator">By: {{ object.creator.name }}</div>
      <div v-if="object.place">At: {{ object.place.description }}</div>
      <div>On: {{ object.date }}</div>
      <div v-if="object.focus">Focus: {{ object.focus.text }}</div>
      <div v-if="object.tag?.length">
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
    </DetailPage>
  </div>

  <section class="illustration flex">
    <OpenSeadragon :src="`${object.iiif_file}/info.json`" class="flex-1" />
  </section>
</template>

<style scoped></style>
