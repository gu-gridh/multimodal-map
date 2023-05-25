import { ref, watch } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const rephotographyStore = defineStore("rephotography", () => {
  const categories = ref<Array<string>>(["all"]);
  const years = ref<[number, number]>(config.timeRange);
  const tags = ref<Array<string>>([]);  
  return { categories, years, tags };
});
