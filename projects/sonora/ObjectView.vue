<script setup lang="ts">
import { inject, ref, watchEffect, onMounted } from "vue";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";
import ObjectViewImage from "./ObjectViewImage.vue";

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

const fetchObjectData = async () => {
  try {
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/document.php?id=${props.id}&lang=sv`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    object.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(fetchObjectData);

const objectComponent = {
  image: ObjectViewImage,
}[props.type];
</script>

<template>

    <component :is="objectComponent" :object="object" :id="Number(id)" />

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
