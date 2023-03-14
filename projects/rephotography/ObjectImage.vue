<script setup lang="ts">
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
  <section class="illustration">
    <img :src="`${object.iiif_file}/full/800,/0/default.jpg`" />
  </section>
  <h1>{{ object.title }}</h1>
</template>

<style scoped>
.illustration {
  min-height: 70vh;
}
</style>
