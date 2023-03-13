<template>
  <div class="flex flex-wrap gap-2">
    <CategoryButton
      v-for="(label, key) in categories"
      :key="key"
      :text="label"
      :value="!!values[key]"
      @toggle="toggle(key)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CategoryButton from "./CategoryButton.vue";

defineProps<{
  categories: Record<string, string>;
}>();

const emit = defineEmits(["change"]);

const values = ref<Record<string, boolean>>({});

function toggle(key: string) {
  if (values.value[key]) {
    delete values.value[key];
  } else {
    values.value[key] = true;
  }
  emit("change", Object.keys(values.value));
}
</script>

<style scoped></style>
