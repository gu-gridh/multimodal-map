<template>
  <div class="flex flex-wrap gap-2">
    <CategoryButton
      v-for="(label, key) in categories"
      :key="key"
      :text="label"
      :value="!!modelValue.includes(key)"
      @toggle="toggle(key)"
    />
  </div>
</template>

<script setup lang="ts">
import CategoryButton from "./CategoryButton.vue";

const props = defineProps<{
  modelValue: string[];
  categories: Record<string, string>;
  limit?: 1;
}>();

const emit = defineEmits(["update:modelValue"]);

function toggle(key: string) {
  let newValue = [...props.modelValue];
  if (newValue.includes(key)) {
    newValue.splice(newValue.indexOf(key), 1);
  } else if (props.limit === 1) {
    newValue = [key];
  } else {
    newValue.push(key);
  }
  emit("update:modelValue", newValue);
}
</script>

<style scoped></style>
