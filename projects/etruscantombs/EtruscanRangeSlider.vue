<template>
  <div class="range-slider-container bg-white rounded">
<div class="start-end-box">{{ props.startLabel }}</div>
    <div
      style="width: 70%"
      :class="['clickable', 'range-slider-wrapper', { 'no-pointer-events': isSliderVisible === false }]"
    >
      <Slider
        v-model="selection"
        :min="min"
        :max="max"
        :step="step"
        class="slider-blue"
      />
    </div>
<div class="start-end-box">{{ props.endLabel }}</div>
  </div>
</template>

<script setup lang="ts">
import Slider from "@vueform/slider";
import { ref, watch, computed } from "vue";

const props = withDefaults(defineProps<{
  modelValue: [number, number];
  min: number;
  max: number;
  step: number;
  isSliderVisible: boolean;
  startLabel: string;
  endLabel: string;
}>(), {
  isSliderVisible: true
});

const emit = defineEmits(["update:modelValue"]);

const selection = ref<[number, number]>(props.modelValue);

watch(selection, () => {
  emit("update:modelValue", selection.value);
});

const isSliderVisible = computed(() => props.isSliderVisible !== false); 
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

.range-slider-wrapper.no-pointer-events {
  pointer-events: none !important; /* Apply pointer-events: none only when isSliderVisible is false */
}

.start-end-box {
  width: 15%;
  text-align: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

div.slider-tooltip.slider-tooltip-top {
  display: none;
}
</style>
