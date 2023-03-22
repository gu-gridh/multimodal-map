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
  object.value = await diana.get(props.type, props.id, { depth: 1 });
  console.log(object.value);
});

const objectComponent = {
  image: ObjectImage,
  rephotography: ObjectRephotography,
}[props.type];
</script>

<template>
  <article v-if="object">
    <component :is="objectComponent" :object="object" :id="Number(id)" />
  </article>
</template>

<style>

.meta-title{
font-weight:100;
font-size:50px;
line-height:0.9;
margin-left:75px;
}

.metadata {
  float:left;
  width:350px;
  height:100vh;
  background-color:black;
  color:white;

}

.illustration {
  float:left;
  width:calc(100% - 350px);
  background-color:black;
  height:100vh;
}

</style>
