<script setup lang="ts">
import OpenSeadragon from "@/components/OpenSeadragon.vue";

defineProps({
  object: {
    type: Object,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <section class="illustration flex">
    <OpenSeadragon :src="`${object.iiif_file}/info.json`" class="flex-1" />
  </section>
  <h1>{{ object.title }}</h1>
</template>

<style scoped>
.illustration {
  min-height: 70vh;
}
</style>
