import { ref } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const rephotographyStore = defineStore("rephotography", () => {
  const categories = ref(["all"]);
  const years = ref(config.timeRange);
  const tags = ref([]);  
  const tagsLayerVisible = ref(false); // Default visibility state for tags layer
  const placesLayerVisible = ref(true); // Default visibility state for places layer
  const mapLayerVisibility = ref(false); // Default visibility state for map layer
  const mapLayerVisibilityTwo = ref(false); // Default visibility state for map layer
  const mapLayerVisibilityThree = ref(false); // Default visibility state for map layer
  return { categories, years, tags, tagsLayerVisible, placesLayerVisible, mapLayerVisibility, mapLayerVisibilityTwo, mapLayerVisibilityThree };
});
