<script setup lang="ts">
import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
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
    <ObjectViewComponent :title="object.title" back="/">
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
    </ObjectViewComponent>
  </div>

  <section class="illustration justify-center no-touch">
    <ComparisonSlider>
      <template #left>
        <img
          :src="`${object.old_image.iiif_file}/full/1500,/0/default.jpg`"
          class="image no-touch"
        />
      </template>
      <template #right>
        <img
          :src="`${object.new_image.iiif_file}/full/1500,/0/default.jpg`"
          class="image no-touch"
        />
      </template>
    </ComparisonSlider>
  </section>
</template>

<style scoped>
#app .no-touch{
  pointer-events:none !important;
}

#app .metadata{
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  pointer-events:auto !important;
  background-color:black!important;
}

#app .illustration{
  width:calc(100% - 450px)!important;
  height:calc(100% - 80px)!important;
  pointer-events:none !important;
  overflow:hidden;
}

@media screen and (max-width: 900px) {

#app .illustration {
  float: left;
  width: 100%!important;
  height: auto!important;
  max-height: 50vh!important;
  background-color: black;
}
}


</style>
