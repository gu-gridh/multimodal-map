<script setup lang="ts">
import { computed } from "vue";
import type { Video } from "./types";
import GuplayPreview from "@/components/GuplayPreview.vue";

const props = defineProps<{
  video: Video;
}>();

const guplayId = computed(() => props.video.link.split("/").pop());
</script>

<template>
  <router-link :to="`/detail/video/${video.id}`" class="clickable">
    <div>
      <div class="image-container">
        <GuplayPreview :guplayId="guplayId || ''" />
      </div>
      <div>{{ video.title }}</div>
      <div>{{ video.description }}</div>
      <div>{{ video.date }}</div>
    </div>
  </router-link>
</template>
