<script setup lang="ts">
import { inject, ref, watchEffect } from "vue";
import axios from "axios";
import type { Image } from "./types";
import type { DianaClient } from "@/assets/diana";

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
