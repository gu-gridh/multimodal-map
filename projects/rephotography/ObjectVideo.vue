<script setup lang="ts">
import { computed } from "vue";
import DetailPage from "@/components/DetailPage.vue";
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
    <DetailPage :title="object.title" back="/">
      <p class="my-2">{{ object.description }}</p>
      <div>By: {{ object.creator.name }}</div>
      <div>At: {{ object.place.description }}</div>
      <div>On: {{ object.date }}</div>
      <div>Focus: {{ object.focus.text }}</div>
      <div>
        Tags:
        {{ object.tag.map((tag) => tag.text).join(", ") }}
      </div>
    </DetailPage>
  </div>

  <section class="illustration">
    <GuplayViewer :guplayId="guplayId || ''" class="w-full h-full" />
  </section>
</template>

<style scoped></style>
