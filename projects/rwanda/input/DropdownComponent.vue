<template>
  <select :value="modelValue[0]" class="dropdown" @change="dropdownToggle($event)">
    <option value="all">All</option>
    <option 
      v-for="(label, key) in categories"
      :key="key"
      :value="key">
      {{ label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from 'vue';
import i18n from '../../../src/translations/rwanda';

const props = defineProps<{
  modelValue: string[];
  categories: Record<string, string>;
  limit?: 1;
  styleType?: "button" | "dropdown";
  type?: "language" | "timeperiod";
}>();

const emit = defineEmits(["update:modelValue", "click"]);



function toggle(key: string) {
  handleToggle(key);
}

function dropdownToggle(event: Event) {
  const selectElement = event.target as HTMLSelectElement | null;
  
  if (selectElement) {
    const selectedKey = selectElement.value;
    handleToggle(selectedKey);
  }
}

function handleToggle(key: string) {
  if (key === 'all') {
    emit("update:modelValue", ['all']); // Set modelValue to ['all']
    
    // If this dropdown is for "Necropolis", then move the map
    // if (props.type === 'necropolis') {
    //   selectedNecropolisCoordinates.value = [1335733.925763396, 5194636.579769473];
    // }

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
.dropdown{
  color:white;
}
</style>
