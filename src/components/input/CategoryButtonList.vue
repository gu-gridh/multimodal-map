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

<script setup>
import CategoryButton from "./CategoryButton.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  categories: {
    type: Object,
    required: true,
  },
  limit: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:modelValue", "click"]);

function toggle(key) {
  let newValue = [...props.modelValue];
  if (newValue.includes(key)) {
    // If the toggled category was selected before, unselect it.
    newValue.splice(newValue.indexOf(key), 1);
  } else if (props.limit === 1) {
    // If the limit is one, select only the new one.
    newValue = [key];
  } else {
    // If it was not selected before, select it.
    newValue.push(key);
  }
  emit("update:modelValue", newValue);
  emit('click', key); // Emitting the click event here
}
</script>

<style scoped>
</style>
