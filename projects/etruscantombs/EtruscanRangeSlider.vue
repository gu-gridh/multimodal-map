<template>
  <div class="range-slider-container bg-white rounded">
    <div class="computed-range">{{ computedRange }}</div>
    <div
      style="width: 90%; margin-bottom: 10px;"
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
  </div>
</template>

<script setup lang="ts">
import Slider from "@vueform/slider";
import { ref, watch, computed } from "vue";
import type { RangeMapping } from "./types";

const rangeMapping: RangeMapping = {
  1: { range: '700-650 BC', id: 5 },
  2: { range: '625-400 BC', id: 6 },
  3: { range: '400-200 BC', id: 7 },
};

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

const computedRange = computed(() => {
  const startRangeNumbers = props.startLabel.split('-').map(str => parseInt(str.replace(/\D/g, '')));
  const endRangeNumbers = props.endLabel.split('-').map(str => parseInt(str.replace(/\D/g, '')));
  const maxStart = Math.max(...startRangeNumbers);
  const minEnd = Math.min(...endRangeNumbers);
  return `${maxStart}-${minEnd} BC`;
});
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style>
.range-slider-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  height: 100%; 
}

#app .range-slider-container {
  height: 70px !important;
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
