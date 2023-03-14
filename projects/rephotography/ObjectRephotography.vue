<script setup lang="ts">
import { inject, ref, watchEffect } from "vue";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";

const props = defineProps({
  object: {
    type: Object,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const diana = inject("diana") as DianaClient;

const left = ref<Image>();
const right = ref<Image>();

watchEffect(async () => {
  [left.value, right.value] = await Promise.all([
    diana.get<Image>("image", props.object.old_image),
    diana.get<Image>("image", props.object.new_image),
  ]);
  console.log(left.value);
  console.log(right.value);
});
</script>

<template>
  <section class="illustration">
    <img v-if="left" :src="`${left.iiif_file}/full/800,/0/default.jpg`" />
    <img v-if="right" :src="`${right.iiif_file}/full/800,/0/default.jpg`" />
  </section>
  <h1 v-if="left">{{ left.title }}</h1>
  <h1 v-if="right">{{ right.title }}</h1>
</template>

<style scoped>
.illustration {
  min-height: 70vh;
}
</style>
