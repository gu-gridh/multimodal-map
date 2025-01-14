<script setup>
const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <router-link :to="`/detail/image/${image.id}`" class="clickable">
    <div>
      <div class="image-container">
        <img
          :src="`${image.iiif_file}/full/600,/0/default.jpg`"
          class="image"
        />
      </div>
      <div>{{ image.title }}</div>
      <div>{{ image.description }}</div>
      <div>{{ image.date }}</div>
    </div>
  </router-link>
</template>

<style>
</style>
