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
      <p class="my-2 object-title">{{ object.description }}</p>


      <div v-if="object.creator?.name">By: {{ object.creator.name }}</div>
      <div v-if="object.place?.decription">At: {{ object.place.description }}</div>
      <div v-if="object.date?.text">On: {{ object.date }}</div>
      <div v-if="object.focus?.text">Focus: {{ object.focus.text }}</div>
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
