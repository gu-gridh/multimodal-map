<script setup lang="ts">
import { inject, ref, watchEffect } from "vue";
import type { Documentation, Image } from "./types";
import type { DianaClient } from "@/assets/diana";
import ObjectImage from "./ObjectImage.vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true,
  },
});

const diana = inject("diana") as DianaClient;
const object = ref<Image>();

watchEffect(async () => {
  object.value = await diana.get(props.type, props.id, { depth: 3 });
});

const objectComponent = {
  image: ObjectImage,
}[props.type];
</script>

<template>
  <article v-if="object">
    <component :is="objectComponent" :object="object" :id="Number(id)" />
  </article>
</template>

<style>
#app .detail-view {
  height: 100% !important;
  pointer-events: auto !important;
  overflow-y: scroll !important;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 80px;
}
</style>
