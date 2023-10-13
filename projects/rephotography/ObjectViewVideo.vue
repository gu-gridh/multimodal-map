<script setup lang="ts">
import { computed } from "vue";
import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
import type { VideoDeep } from "./types";
import GuplayViewer from "@/components/GuplayViewer.vue";

const props = defineProps<{
  object: VideoDeep;
  id: Number;
}>();

const guplayId = computed(() => props.object.link.split("/").pop());
</script>

<template>
  <div class="metadata">
    <ObjectViewComponent :title="object.title" back="/">
      <p class="my-5 object-title">{{ object.description }}</p>
      <div v-if="object.photographer?.name">
        By: {{ object.photographer.name }}
      </div>
      <div v-if="object.place?.name">At: {{ object.place.name }}</div>
      <div v-if="object.date">On: {{ object.date }}</div>
      <div v-if="object.focus?.text">Focus: {{ object.focus.text }}</div>
      <div v-if="object.tag?.length">
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
    </ObjectViewComponent>
  </div>

  <section class="illustration">
    <GuplayViewer :guplayId="guplayId || ''" class="w-full h-full" />
  </section>
</template>

<style scoped>
#app .illustration{
  pointer-events:auto !important;
}
</style>
