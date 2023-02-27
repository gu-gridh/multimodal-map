<script setup lang="ts">
import { ref, watchEffect } from "vue";
import axios from "axios";
import type { Image } from "./types";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    require: true,
  },
});

const object = ref<Image>();

watchEffect(async () => {
  const response = await axios.get(
    `https://diana.dh.gu.se/api/rephotography/${props.type}/${props.id}`
  );
  object.value = response.data;
});
</script>

<template>
  <article v-if="object">
    <section>
      <img :src="`${object.iiif_file}/full/800,/0/default.jpg`" />
    </section>
    <h1>{{ object.title }}</h1>
  </article>
</template>
