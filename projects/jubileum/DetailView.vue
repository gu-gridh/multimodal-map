<script setup lang="ts">
import { inject, ref, watchEffect } from "vue";
import type { Image } from "./types";
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
  object.value = await diana.get(props.type, props.id, { depth: 1 });
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
.metadata {
  float: left;
  width: 450px;
  height: 100vh;
  background-color: black;
  color: white;
}
.illustration {
  float: left;
  width: calc(100% - 450px);
  background-color: black;
  height: 100vh;
}
</style>
