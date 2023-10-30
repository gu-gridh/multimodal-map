import { ref } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const etruscanStore = defineStore("etruscan", () => {
  const categories = ref<Array<string>>(["all"]);
  const tags = ref<Array<string>>(["all"]);
  const necropoli = ref<Array<string>>(["all"]);
  const tombType = ref<Array<string>>(["all"]);
  const tagsLayerVisible = ref(false); // Default visibility state for tags layer
  const placesLayerVisible = ref(true); // Default visibility state for places layer
  const dataParams = ref<Record<string, string | number | null>>({});
  const imgParams = ref<Record<string, string | number | null>>({});
  const selectedNecropolisCoordinates = ref<[number, number] | null>(null);
  const enable3D = ref<boolean>(false);
  const areMapPointsLoaded = ref<boolean>(false);

  return { categories, tags, tagsLayerVisible, placesLayerVisible, necropoli, tombType,  dataParams, selectedNecropolisCoordinates, enable3D, areMapPointsLoaded, imgParams };
});
