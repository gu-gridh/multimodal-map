<script setup>
import { computed } from "vue";
import GuplayPreview from "@/components/GuplayPreview.vue";

const props = defineProps({
  video: Object,
});

const guplayId = computed(() => props.video.link.split("/").pop());
</script>

<template>
<div class="container">
  <router-link :to="`/detail/video/${video.id}`" class="">
    <div class="image-card">
      <div class="image-container">
        <GuplayPreview :guplayId="guplayId || ''" />
      </div>
      <h2>Video </h2>
      <div class="previewtitle">{{ video.title }}</div>
      <!-- <div>{{ video.description }}</div> -->
      <div class="previewdate">{{ video.date }}</div>
    </div>
  </router-link>
</div>
</template>

<style scoped>
h2{
  font-size:1.5em;
  font-weight:200;
}

.container{
  height:auto;
  max-height:(100vh - 80px);
  background-color:none;
}
</style>

