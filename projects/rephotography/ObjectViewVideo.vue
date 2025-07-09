<script setup>
import { computed } from "vue";
import ObjectViewComponent from "@/components/ObjectViewComponent.vue";
import GuplayViewer from "@/components/GuplayViewer.vue";

const props = defineProps({
  object: Object,
  id: Number,
});

const guplayId = computed(() => props.object.link.split("/").pop());
</script>

<template>
  <div class="metadata">
    <ObjectViewComponent :title="object.title" back="/">
      <p class="my-5 object-title">{{ object.description }}</p>
      
      <div class="metadata-post" v-if="object.photographer?.name">
        <div class="metadata-label">By: </div> 
        <div class="metadata-item"> {{ object.photographer.name }}</div>
      </div>
      <div class="metadata-post" v-if="object.place?.name">
      <div class="metadata-label">Place:</div> 
       <div class="metadata-item">{{ object.place.name }}</div>
      </div> 
      <div class="metadata-post" v-if="object.date">
        <div class="metadata-label">Date:</div> 
        <div class="metadata-item">{{ object.date }}</div>
      </div> 
      <div class="metadata-post" v-if="object.focus?.text">
        <div class="metadata-label">Focus:</div> 
        <div class="metadata-item">{{ object.focus.text }}</div>
      </div> 
      <div class="metadata-post" v-if="object.tag?.length">
        <div class="metadata-label">Tags:</div>
        <div class="metadata-item-tag">{{ object.tag.map((tag) => tag.text).join(", ") }}</div> 
      </div>
    </ObjectViewComponent>
  </div>

  <section class="illustration">
    <GuplayViewer :guplayId="guplayId || ''" class="w-full h-full" />
  </section>
</template>

<style scoped>
#app .illustration{
  pointer-events:auto !important;
}
</style>
