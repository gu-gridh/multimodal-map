<template>
  <div class="flex flex-wrap gap-2">
    <CategoryButton
      v-for="category in categories"
      v-bind:key="category"
      :text="category"
    />
  </div>
</template>

<script setup lang="ts">
import CategoryButton from "./CategoryButton.vue";

defineProps<{
  categories: Array<string>;
}>();
</script>

<style scoped></style>
