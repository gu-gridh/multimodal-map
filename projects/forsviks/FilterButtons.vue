<template>
  <div class="filter-buttons">
    <button
      v-for="(marker, key) in types"
      :key="key"
      class="filterBtn"
      :class="{ selected: selectedType === marker.value }"
      @click="selectType(marker.value)"
    >
      {{ marker.label }}
    </button>

  </div>
</template>

<script setup>
import { ref } from "vue";
import config from "./settings/config";

const props = defineProps({
  types: {
    label: String,
    value: String,
    default: "all"
  },
  selectedType: {
    type: String,
    default: "all"
  }
});


const emit = defineEmits(["update:selectedType"]);

const selectType = (type) => {
  emit("update:selectedType", type);
  console.log(type);
};
</script>

<style scoped>
  .filterBtn {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.filterBtn.selected {
  background-color: var(--theme-3);
  color: white;
  border-color: var(--theme-3);
}
</style>