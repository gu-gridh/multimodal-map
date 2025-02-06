<template>
  <!-- <div v-if="styleType === 'button'" class="flex flex-wrap gap-2">
    <CategoryButton
      v-for="(label, key) in categories"
      :key="key"
      :text="label"
      :value="!!modelValue.includes(key)"
      @toggle="toggle(key)"
    />
  </div> -->
  <select :value="modelValue[0]" class="dropdown theme-color-background" @change="dropdownToggle($event)">
    <option value="all">{{ $t('all') }}</option>
    <template v-if="props.type === 'necropolis'">
      <option 
        v-for="([label, key], index) in displayCategories"
        :key="index"
        :value="key">
        {{ label }}
      </option>
    </template>
    <template v-else>
      <option 
        v-for="(label, key) in categories"
        :key="key"
        :value="key">
        {{ label }}
      </option>
    </template>
  </select>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Array,
  categories: [Object, Array],
  limit: Number,
  styleType: String,
  type: String,
});

const emit = defineEmits(["update:modelValue", "click"]);

//computed property for necropolis vs other types
const displayCategories = computed(() => {
  if (props.type === "necropolis" && Array.isArray(props.categories)) {
    return props.categories.map(item => [item.text, item.id]);
  } else {
    return Object.entries(props.categories);
  }
});

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
    emit("update:modelValue", ['all']); // Set modelValue to ['all']
    emit('click', 'all'); // Emit the special 'all' value
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
