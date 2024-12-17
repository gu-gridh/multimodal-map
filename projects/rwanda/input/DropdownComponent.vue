<template>
  <select :value="modelValue[0]" class="dropdown" @change="dropdownToggle($event)">
    <option value="all">All</option>
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

<script setup lang="ts">


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
