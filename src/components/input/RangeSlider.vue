<template>
  <div class="range-slider-container bg-white rounded">
    <div class="start-end-box">{{ min }}</div>
    <div style="width: 70%" class="clickable range-slider-wrapper">
      <Slider
        v-model="selection"
        :min="min"
        :max="max"
        :step="step"
        showTooltip="focus"
        class="slider-blue"
      />
    </div>
    <div class="start-end-box">{{ max }}</div>
  </div>
</template>

<script setup lang="ts">
import Slider from "@vueform/slider";
import { ref } from "vue";

const props = defineProps<{
  range?: Array<number>;
  min: number;
  max: number;
  step: number;
}>();

const selection = ref<Array<number>>([props.min, props.max]);
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style>
.range-slider-container {
  display: flex;
  width: 100%;
  align-items: center;
}

.range-slider-wrapper {
  padding-left: 15px;
  padding-right: 15px;
}

.start-end-box {
  width: 15%;
  text-align: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
