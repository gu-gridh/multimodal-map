<template>
  <div class="range-slider-container bg-white rounded">
    <div class="checkbox" style="margin-left: 10px; text-align: center">
      <input type="checkbox" id="showUnknownRange" v-model="showUnknownRange">
      <label for="showUnknownRange">Unknown</label>
    </div>
    <div class="start-end-box">{{ formatBCYear(min) }}</div>
    <div
      style="width: 70%"
      :class="['clickable', 'range-slider-wrapper', { 'no-pointer-events': isSliderVisible === false }]"
    >
      <Slider
        v-model="selection"
        :min="min"
        :max="max"
        :step="step"
        showTooltip="focus"
        class="slider-blue"
        :format="v => `${Math.round(Math.abs(v))} BC`"
      />
    </div>
    <div class="start-end-box">{{ formatBCYear(max) }}</div>
  </div>
</template>

<script setup lang="ts">
import Slider from "@vueform/slider";
import { storeToRefs } from "pinia";
import { etruscanStore } from "./store";
import { ref, watch, computed } from "vue";
const { showUnknownRange } = storeToRefs(etruscanStore());
const props = withDefaults(defineProps<{
  modelValue: [number, number];
  min: number;
  max: number;
  step: number;
  isSliderVisible: boolean;
}>(), {
  isSliderVisible: true
});

const emit = defineEmits(["update:modelValue"]);
const isSliderVisible = computed(() => props.isSliderVisible !== false); 
const selection = ref<[number, number]>(props.modelValue);

function formatBCYear(year) {
  return `${Math.abs(year)} BC`;
}

watch(selection, () => {
  emit("update:modelValue", selection.value);
});
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

.slider-connect
{
  background-color: var(--theme-3) !important; 
}

.slider-handle:focus {
  box-shadow: 0 0 0 var(--slider-handle-ring-width, 3px) var(--slider-handle-ring-color, rgba(180, 100, 100, 0.188)), var(--slider-handle-shadow, .5px .5px 2px 1px rgba(180, 100, 100, 0.32));
}

.slider-tooltip-top
{
  background-color: var(--theme-3) !important;
  border: var(--theme-3) !important;
}

</style>
