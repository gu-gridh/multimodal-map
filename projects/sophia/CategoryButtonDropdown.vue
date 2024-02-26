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

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CategoryButton from "../../src/components/input/CategoryButton.vue";
import { inscriptionsStore } from "./store";
// const { selectedNecropolisCoordinates } = storeToRefs(inscriptionsStore());


const props = defineProps<{
  modelValue: string[];
  categories: Record<string, string>;
  limit?: 1;
  styleType?: "button" | "dropdown";
  type?: "necropolis" | "tombType";
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
  font-family: "Sofia Sans Extra Condensed", sans-serif !important;
}
</style>
