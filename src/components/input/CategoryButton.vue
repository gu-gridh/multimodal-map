<template>
  <button
    class="p-1 px-2 clickable base-shadow category-button"
    :class="{ active: isActive }"
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
  border-radius: 4px;
}

.category-button:hover {
  background-color: #096058;
  color: white;
}

.category-button.active {
  background-color: #0d9488;
  color: white;
}
</style>
