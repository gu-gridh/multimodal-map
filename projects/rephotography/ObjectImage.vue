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
      <p class="my-5 object-title">{{ object.description }}</p>
      <div v-if="object.photographer?.name">
        By: {{ object.photographer.name }}
      </div>
      <div v-if="object.place?.name">At: {{ object.place.name }}</div>
      <div v-if="object.date?.length">On: {{ object.date }}</div>
      <div v-if="object.focus?.text">Focus: {{ object.focus.text }}</div>
      <div v-if="object.tag?.length">
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
    </DetailPage>
  </div>

  <section class="illustration flex">

    <OpenSeadragon :src="`${object.iiif_file}/info.json`" class="flex-1" />

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


</style>
