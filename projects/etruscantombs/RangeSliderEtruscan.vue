<template>
  
  <div class="range-slider-container">
  
    <!-- <div class="start-end-box">{{ formatBCYear(min) }}</div> -->
    <div
      style="width: 100%"
      :class="['clickable', 'range-slider-wrapper', { 'no-pointer-events': isSliderVisible === false }]"
    >
      <Slider
        v-model="selection"
        :min="min"
        :max="max"
        :step="step"
        showTooltip="always"
        class="slider-blue"
        :format="v => `${Math.round(Math.abs(v))} BC`"
      />
    </div>
    <!-- <div class="start-end-box" style="margin-right: 5px">{{ formatBCYear(max) }}</div> -->
    <div class="checkbox-container" style="">
      <input type="checkbox" id="showUnknownRange" v-model="showUnknownRange">
      <label style="margin-left:5px; margin-top:-3px; font-size:0.9em; " for="showUnknownRange">Include unknown</label>
    </div> 
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

function formatBCYear(year: any): string {
  return `${Math.abs(year)} BC`;
}

watch(selection, () => {
  emit("update:modelValue", selection.value);
});
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style>
.range-slider-container {
  height: auto;
  width: 100%;
  align-items: center;
  background-color:rgba(255,255,255,0.5);
  border-radius:10px;
  padding:45px 20px 5px 20px;
}

.checkbox-container{
  display: flex;
  align-content: center;
  justify-content: center;
  margin-top:8px;
}

.checkbox-container input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 1rem;
  padding: 0.2rem;
  width: 20px;
  height: 20px;
  border-radius: 0.2rem;
  background-color:rgb(200,200,200);
}

.checkbox-container input[type="checkbox"]::before {
  content: "";
  width: 100%;
  height: 100%;
  transform: scale(0);
  clip-path:circle(1);
  background-color:var(--theme-3) !important; 
}

.checkbox-container input[type="checkbox"]:checked::before {
  transform: scale(1);
}

.checkbox-container input[type="checkbox"]:hover {
  color: black;
}




.slider-blue{
  padding:0px;
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
