<template>
  <Tooltip :text=hover position="top">
    <button class="p-1 px-2 clickable category-button" :class="{ active: value }" @click="toggle"
      v-html="text"></button>
  </Tooltip>
</template>

<script setup>
import Tooltip from './Tooltip.vue'

const props = defineProps({
  text: {
    type: String
  },
  value: {
    type: Boolean
  },
  hover: {
    type: String
  },
});

const emit = defineEmits(["toggle"]);

function toggle() {
  emit("toggle");
}
</script>

<style scoped>
.category-button:hover {
  background-color: #096058;
  color: white;
}

.category-button.active {
  background-color: #0d9488;
  color: white;
}

.tooltip--top {
  inset-block-end: 120%;
  inset-inline-start: 50%;
  margin-inline-start: -60px;
}
</style>