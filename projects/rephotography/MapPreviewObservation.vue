<template>
  <div class="observation-card">
      <h3 class="title">{{ observation.title }}</h3>
      <p class="description" v-html="observation.description"></p>
      <p class="date">{{ observation.date }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Observation } from "./types";

defineProps<{
  observation: Observation;
}>();
</script>

<style scoped>
.observation-card {
  float: left;
  height: auto;
  width: 100%;
  color: black;
  background-color: rgb(100, 100, 100);
  font-size: 14px;
  margin-bottom: 30px;
  padding: 10px 10px 10px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  border-radius: 10px !important;
}

.observation-card:hover {
  cursor: pointer;
  transform: scale(1.05);
}

.title {
  font-size: 1.5em;
  font-weight: 200;
  color: white;
}

.description {
  margin-top: 10px;
  font-size: 1em;
  color: white;
}

.date {
  margin-top: 20px;
  font-size: 0.9em;
  color: white;
}
</style>
