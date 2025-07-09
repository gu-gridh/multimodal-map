<script setup>
  import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
  import ComparisonSlider from "@/components/ComparisonSlider.vue";

  const props = defineProps({
    object: Object,
    id: Number,
  });

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
        <div class="metadata-post" v-if="image.photographer?.name">
          <div class="metadata-label">By:</div>
          <div class="metadata-item">{{ image.photographer.name }}</div>
        </div>

        <div class="metadata-post" v-if="image.place?.name">
          <div class="metadata-label">Place:</div>
          <div class="metadata-item">{{ image.place.name }}</div>
        </div>

        <div class="metadata-post" v-if="image.date">
          <div class="metadata-label">Date:</div>
          <div class="metadata-item">{{ image.date }}</div>
        </div>

        <div class="metadata-post" v-if="image.focus?.text">
          <div class="metadata-label">Focus:</div>
          <div class="metadata-item">{{ image.focus.text }}</div>
        </div>

        <div class="metadata-post" v-if="image.tag?.length">
          <div class="metadata-label">Tags:</div>
          <div class="metadata-item">{{ image.tag.map((tag) => tag.text).join(", ") }}</div>
        </div>

      </template>
    </ObjectViewComponent>
  </div>

  <section class="illustration justify-center no-touch">
    <ComparisonSlider>
      <template #left>
        <img :src="`${object.old_image.iiif_file}/full/1500,/0/default.jpg`" class="image no-touch" />
      </template>
      <template #right>
        <img :src="`${object.new_image.iiif_file}/full/1500,/0/default.jpg`" class="image no-touch" />
      </template>
    </ComparisonSlider>
  </section>
</template>

<style scoped>
  html,
  body {
    background-color: black !important;
  }

  #app .no-touch {
    pointer-events: none !important;
  }

  #app .illustration {
    width: calc(100% - 450px) !important;
    height: calc(100% - 80px) !important;
    pointer-events: none !important;
    overflow: hidden;
  }

  @media screen and (max-width: 900px) {

    #app .illustration {
      float: left;
      width: 100% !important;
      height: auto !important;
      max-height: 50vh !important;
      background-color: black
    }
  }
</style>