<script setup lang="ts">
import DetailPage from "@/components/DetailPage.vue";
import type { RephotographyDeep } from "./types";
import ComparisonSlider from "@/components/ComparisonSlider.vue";

const props = defineProps<{
  object: RephotographyDeep;
  id: number;
}>();

const images = {
  "Left image": props.object.old_image,
  "Right image": props.object.new_image,
};
</script>

<template>
  <div class="metadata">
    <DetailPage :title="object.title" back="/">
      <template v-for="(image, label) in images" :key="label">
        <h2 class="text-xl mt-5 theme-color">{{ label }}:</h2>

        <p v-if="image.description" class="my-1 object-title">
          {{ image.description }}
        </p>
        <div v-if="image.photographer?.name">
          By: {{ image.photographer.name }}
        </div>
        <div v-if="image.place?.name">At: {{ image.place.name }}</div>
        <div v-if="image.date">On: {{ image.date }}</div>
        <div v-if="image.focus?.text">Focus: {{ image.focus.text }}</div>
        <div v-if="image.tag?.length">
          Tags:
          {{ image.tag.map((tag) => tag.text).join(", ") }}
        </div>
      </template>
    </DetailPage>
  </div>

  <section class="illustration justify-center">
    <ComparisonSlider>
      <template #left>
        <img
          :src="`${object.old_image.iiif_file}/full/1500,/0/default.jpg`"
          class="image"
        />
      </template>
      <template #right>
        <img
          :src="`${object.new_image.iiif_file}/full/1500,/0/default.jpg`"
          class="image"
        />
      </template>
    </ComparisonSlider>
  </section>
</template>

<style scoped>
.illustration {
  min-height: 100vh;
}

.image-title {
  font-size: 150%;
}

@media screen and (max-width: 900px) {
  #app .illustration {
  min-height: 30vh;
  height:30vh;
}
#app .meta-container{
  margin-top: 35vh;
  height:65vh;
}
}

</style>
