<script setup>
  import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
  import OpenSeadragon from "@/components/OpenSeadragonURL.vue";

  const props = defineProps({
    object: Object,
    id: Number,
  });
</script>

<template>
  <div class="metadata">
    <ObjectViewComponent :title="object.title" back="/">
      <p class="description">{{ object.description }}</p>
      <div class="metadata-post" v-if="object.photographer?.name">
        <div class="metadata-label">By:</div>
        <div class="metadata-item">{{ object.photographer.name }}</div>
      </div>
      <div class="metadata-post" v-if="object.place?.name">
        <div class="metadata-label">Place:</div>
        <div class="metadata-item">{{ object.place.name }}</div>
      </div>
      <div class="metadata-post" v-if="object.date?.length">
        <div class="metadata-label">Date:</div>
        <div class="metadata-item">{{ object.date }}</div>
      </div>
      <div class="metadata-post" v-if="object.focus?.text">
        <div class="metadata-label">Focus:</div>
        <div class="metadata-item">{{ object.focus.text }}</div>
      </div>
      <div class="metadata-post" v-if="object.tag?.length">
        <div class="metadata-label">Tags:</div>
        <div class="metadata-item"> {{ object.tag.map((tag) => tag.text).join(", ") }}</div>
      </div>
    </ObjectViewComponent>
  </div>

  <section class="illustration flex">

    <OpenSeadragon :src="`${object.iiif_file}/info.json`" class="flex-1" />

  </section>
</template>

<style scoped>
  .back-button {
    width: 20px !important;
    height: 20px !important;
    border-radius: 50%;
    overflow: hidden;
    position: fixed;
  }

  .illustration {
    height: calc(100vh - 80px);
  }
</style>