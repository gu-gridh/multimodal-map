import { ref, watch } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const rephotographyStore = defineStore("rephotography", () => {
  const categories = ref<Array<string>>([]);
  const years = ref<[number, number]>(config.timeRange);
  return { categories, years };
});
