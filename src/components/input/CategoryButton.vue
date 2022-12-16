<template>
  <button
    class="clickable base-shadow category-button"
    v-class="{ active: isActive }"
    @click="toggle"
    v-html="text"
  ></button>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  text: string;
}>();

const isActive = ref<boolean>(false);

function toggle() {
  isActive.value = !isActive.value;
}
</script>

<style scoped>
.category-button {
  background-color: white;
  color: rgb(71, 85, 105);
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  border-radius: 4px;
}

.category-button:hover {
  background-color: #096058;
  color: white;
}

.category-button:active {
  background-color: #0d9488;
  color: white;
}
</style>
