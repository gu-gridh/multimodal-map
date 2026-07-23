<script setup>
/** Dual-thumb year slider, styled for the dark theme (the shared
    RangeSlider renders a white @vueform card that clashed with it). */
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Array, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 10 },
});
const emit = defineEmits(["update:modelValue"]);

const lo = computed(() => props.modelValue[0]);
const hi = computed(() => props.modelValue[1]);

function setLo(value) {
  const v = Math.min(Number(value), hi.value - props.step);
  emit("update:modelValue", [v, hi.value]);
}

function setHi(value) {
  const v = Math.max(Number(value), lo.value + props.step);
  emit("update:modelValue", [lo.value, v]);
}

const pct = (v) => ((v - props.min) / (props.max - props.min)) * 100;
const fillStyle = computed(() => ({
  left: `${pct(lo.value)}%`,
  width: `${pct(hi.value) - pct(lo.value)}%`,
}));
</script>

<template>
  <div class="time-slider">
    <span class="year-label">{{ lo }}</span>
    <div class="track-wrap">
      <div class="track"></div>
      <div class="track-fill" :style="fillStyle"></div>
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="lo"
        @input="setLo($event.target.value)"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="hi"
        @input="setHi($event.target.value)"
      />
    </div>
    <span class="year-label">{{ hi }}</span>
  </div>
</template>

<style scoped>
.time-slider {
  display: flex;
  align-items: center;
  gap: 10px;
}

.year-label {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px;
  opacity: 0.8;
  width: 38px;
  text-align: center;
}

.track-wrap {
  position: relative;
  flex: 1;
  height: 24px;
}

.track,
.track-fill {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  border-radius: 2px;
  pointer-events: none;
}

.track {
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.15);
}

.track-fill {
  background: var(--accent);
}

.track-wrap input[type="range"] {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  background: none;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
}

.track-wrap input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: ew-resize;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.track-wrap input[type="range"]::-moz-range-thumb {
  pointer-events: auto;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: ew-resize;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.track-wrap input[type="range"]::-moz-range-track {
  background: none;
}
</style>
