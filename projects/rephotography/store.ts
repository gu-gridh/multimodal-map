import { ref } from "vue";
import { defineStore } from "pinia";

export const rephotographyStore = defineStore("rephotography", () => {
  const categories = ref<Array<string>>([]);
  return { categories };
});
