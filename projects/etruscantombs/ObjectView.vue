<script setup lang="ts">
import { inject, ref, watchEffect } from "vue";
import type { Documentation } from "./types";
import type { DianaClient } from "@/assets/diana";
import ObjectViewImage from "./ObjectViewImage.vue";
import ObjectViewVideo from "./ObjectViewVideo.vue";

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
const object = ref<Documentation>();


watchEffect(async () => {
  object.value = await diana.get(props.type, props.id, { depth: 3 });
});

const objectComponent = {
  image: ObjectViewImage,
  video: ObjectViewVideo,
}[props.type];
</script>

<template>
  <div style="pointer-events:none !important;">
  <article v-if="object">
    <component :is="objectComponent" :object="object" :id="Number(id)" />
  </article>
</div>
</template>

<style>
.metadata {
  float: left;
  width: 450px;
  height: 100vh;
  background-color: black;
  pointer-events:auto;
  color: white;
}
.illustration {
  float: left;
  width: calc(100% - 450px);
  background-color: black;
  height: 100vh;

}
</style>
