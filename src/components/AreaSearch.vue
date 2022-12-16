<template>
  <div class="area-search-button-background">
    <button class="area-search-button" @click="onClick">
      {{ searchLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

const store = mapStore();
const { extent, params } = storeToRefs(store);

defineProps({
  searchLabel: {
    default: "Search this area",
  },
});

function onClick() {
  // Set the current bbox as the search bbox
  params.value.bbox = extent.value;
}
</script>

<style scoped>
.area-search-button-background {
  position: static;
  background-color: #fff6;
  border-radius: 9999px;
  padding: 0.5rem/* 8px */;
  display: inline-block;

}

.area-search-button {
  background-color: rgb(255, 255, 255, 100);
  color: rgb(71, 85, 105);
  font-weight: bold;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem /* 16px */;
  padding-right: 1rem /* 16px */;
  border-radius: 9999px;
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
    0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.area-search-button:hover {
  background-color: #0d9488;
  color: white;
}

.area-search-button:active {
  background-color: #096058;
  color: white;
}
</style>
