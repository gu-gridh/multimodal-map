<template>
  <div v-if="styleType === 'button'" class="flex flex-wrap gap-2">
    <CategoryButton
      v-for="item in categories"
      :key="item.id"
      :text="item.text"
      :value="!!modelValue.includes(item.id)"
      @toggle="toggle(item.id)"
    />
  </div>
  <select v-else :value="modelValue[0]" class="dropdown theme-color-background" @change="dropdownToggle($event)">
    <option value="all">{{ defaultOptionLabel }}</option>
    <option 
      v-for="item in categories"
      :key="item.id"
      :value="item.id">
      {{ item.text }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import i18n from '../../../src/translations/sophia';
import CategoryButton from "../../../src/components/input/CategoryButton.vue";

const props = defineProps<{
  modelValue: string[];
  categories: { id: string | number; text: string }[];
  limit?: number;
  styleType?: "button" | "dropdown";
  type?: "language" | "tombType";
}>();

const emit = defineEmits(["update:modelValue", "click"]);

const defaultOptionLabel = computed(() => {
  return i18n.global.locale === 'en' ? 'Show all' : 'Показати все';
});

function toggle(key: string | number) {
  handleToggle(key);
}

function dropdownToggle(event: Event) {
  const selectElement = event.target as HTMLSelectElement | null;
  
  if (selectElement) {
    const selectedKey = selectElement.value;
    handleToggle(selectedKey);
  }
}

function handleToggle(key: string | number) {
  if (key === 'all') {
    emit("update:modelValue", ['all']);
    emit('click', 'all');
    return;
  }
  
  let newValue = [...props.modelValue];
  if (newValue.includes(key)) {
    newValue = newValue.filter(item => item !== key);
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
