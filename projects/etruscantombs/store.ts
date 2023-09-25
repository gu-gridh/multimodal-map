import { ref } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const etruscanStore = defineStore("etruscan", () => {
  const categories = ref<Array<string>>(["all"]);
  const years = ref<[number, number]>(config.timeRange);
  const tags = ref<Array<string>>([]);
  const necropoli = ref<Array<string>>([]);
  const tombType = ref<Array<string>>([]);
  const tagsLayerVisible = ref(false); // Default visibility state for tags layer
  const placesLayerVisible = ref(true); // Default visibility state for places layer
  return { categories, years, tags, tagsLayerVisible, placesLayerVisible, necropoli, tombType };
});
