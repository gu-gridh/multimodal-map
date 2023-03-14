<script setup lang="ts">
import { inject, ref, watchEffect } from "vue";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";
import ObjectImage from "./ObjectImage.vue";
import ObjectRephotography from "./ObjectRephotography.vue";

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
  object.value = await diana.get(props.type, props.id);
  console.log(object.value);
});

const objectComponent = {
  image: ObjectImage,
  rephotography: ObjectRephotography,
}[props.type];
</script>

<template>
  <article v-if="object">
    <component :is="objectComponent" :object="object" :id="id" />
  </article>
</template>
