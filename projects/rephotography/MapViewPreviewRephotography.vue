<script setup>
import ComparisonSlider from "@/components/ComparisonSlider.vue";

const props = defineProps({
  rephotography: Object,
});
</script>

<template>
  <div class="container">
  <router-link
    :to="`/detail/rephotography/${rephotography.id}`"
    class="clickable no-touch image-card"
  >
    <div class="image-container no-touch">
      <ComparisonSlider locked>
        <template #left>
          <img
            :src="`${rephotography.old_image.iiif_file}/full/600,/0/default.jpg`"
            class="image no-touch"
          />
        </template>
        <template #right>
          <img
            :src="`${rephotography.new_image.iiif_file}/full/600,/0/default.jpg`"
            class="image no-touch"
          />
        </template>
      </ComparisonSlider>
    </div>

    <div class="flex justify-between">
      <div>
         <!--<div>{{ rephotography.old_image.title }}</div>
        <div>{{ rephotography.old_image.description }}</div> -->
        <div class="previewdate">{{ rephotography.old_image.date }}</div>
      </div>
      <div class="text-right">
         <!--<div>{{ rephotography.new_image.title }}</div>
        <div>{{ rephotography.new_image.description }}</div> -->
        <div class="previewdate">{{ rephotography.new_image.date }}</div>
      </div>
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
  background-color:none;
}
</style>
