<template>
  <button
    class="p-1 px-2 clickable category-button"
    :class="{ active: value }"
    @click="toggle"
    v-html="text"
  ></button>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  value: boolean;
}>();

const emit = defineEmits(["toggle"]);

function toggle() {
  emit("toggle");
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
