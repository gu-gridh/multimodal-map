<template>
  <select :value="modelValue[0]" class="dropdown" @change="dropdownToggle($event)">
    <option selected value="">All</option>
    <option 
      v-for="(label, key) in categories"
      :key="key"
      :value="key"
      :title="key"
      >
      {{ label }}
    </option>
  </select>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { rwandaStore } from "../settings/rwandaStore";


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
  styleType: {
    type: String, 
  },
  type: {
    type: String, 
  },
});

const { showAdvancedLayer, allLayer } = storeToRefs(rwandaStore());

const emit = defineEmits(["update:modelValue", "click"]);

function toggle(key) {
  handleToggle(key);
}

function dropdownToggle(event) {
  const selectElement = event.target;
  
  if (selectElement) {
    const selectedKey = selectElement.value;
    if (selectedKey === '') {;
      showAdvancedLayer.value = false;
      allLayer.value = true;
      return;
    }
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
.dropdown{
  color:white;
}
</style>