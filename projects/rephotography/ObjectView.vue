<script setup>
import { ref, watchEffect } from "vue";
import ObjectViewImage from "./ObjectViewImage.vue";
import ObjectViewVideo from "./ObjectViewVideo.vue";
import ObjectViewRephotography from "./ObjectViewRephotography.vue";
import { DianaClient } from "./settings/diana.js";

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

const diana = new DianaClient("rephotography");
const object = ref();

watchEffect(async () => {
  object.value = await diana.get(props.type, props.id, { depth: 3 });
});

const objectComponent = {
  image: ObjectViewImage,
  video: ObjectViewVideo,
  rephotography: ObjectViewRephotography,
}[props.type];
</script>

<template>
  <div id="object-container" style="pointer-events:none !important;">
  <article v-if="object">
    <component :is="objectComponent" :object="object" :id="Number(id)" />
  </article>
</div>
</template>

<style>
#object-container{
  background-color: black;
  height:100vh;
  width:100%;
}

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
