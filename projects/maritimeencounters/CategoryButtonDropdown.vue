<template>
  <div v-if="styleType === 'button'" class="flex flex-wrap gap-2">
    <CategoryButton
      v-for="(label, key) in categories"
      :key="key"
      :text="label"
      :value="!!modelValue.includes(key)"
      @toggle="toggle(key)"
    />
  </div>
  <select v-else :value="modelValue[0]" class="dropdown theme-color-background" @change="dropdownToggle($event)">
    <option value="all">All</option>
    <option 
      v-for="(label, key) in categories"
      :key="key"
      :value="key">
      {{ label }}
    </option>
  </select>
</template>

<script setup>
import CategoryButton from "../../src/components/input/CategoryButton.vue";

const props = defineProps({
  modelValue: Array,
  categories: Object,
  limit: Number,
  styleType: String,
  type: String
});

const emit = defineEmits(["update:modelValue", "click"]);

function toggle(key) {
  handleToggle(key);
}

function dropdownToggle(event) {
  const selectElement = event.target;
  
  if (selectElement) {
    const selectedKey = selectElement.value;
    handleToggle(selectedKey);
  }
}

function handleToggle(key) {
  if (key === 'all') {
    emit("update:modelValue", ['all']); 
    emit('click', 'all');
    return;
  }
  
  let newValue = [...props.modelValue];
  if (newValue.includes(key)) {
    newValue.splice(newValue.indexOf(key), 1);
  } else if (props.limit === 1) {
    newValue = [key];
  } else {
    newValue.push(key);
  }
  
  emit("update:modelValue", newValue);
  emit('click', key); 
}

</script>

<style scoped>

</style>
