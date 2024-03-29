import { ref } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const inscriptionsStore = defineStore("inscriptions", () => {
  const categories = ref<Array<string>>(["all"]);
  const tags = ref<Array<string>>(["all"]);
  //const necropoli = ref<Array<string>>(["all"]);
  const panelType = ref<Array<string>>(["all"]);
  const tagsLayerVisible = ref(false); // Default visibility state for tags layer
  const dataParams = ref<Record<string, string | number | null>>({});
  const imgParams = ref<Record<string, string | number | null>>({});
  // const selectedNecropolisCoordinates = ref<[number, number] | null>(null);
  // const enable3D = ref<boolean>(false);
  // const enablePlan = ref<boolean>(false);
  const areMapPointsLoaded = ref<boolean>(false);
  const panelId = ref<string | null>(null);

  return { categories, tags, panelType, tagsLayerVisible, dataParams, areMapPointsLoaded, imgParams, panelId };
});
