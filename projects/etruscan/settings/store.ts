import { ref } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const etruscanStore = defineStore("etruscan", () => {
  const categories = ref<Array<string>>(["all"]);
  const tags = ref<Array<string>>(["all"]);
  const dataSetValue = ref<Array<string>>(["all"]);
  const necropoli = ref<Array<string>>(["all"]);
  const selectedSite = ref<Array<string>>(["all"]);
  const selectedRange = ref([-700, -200]);
  const showUnknownRange = ref(true);
  const tombType = ref<Array<string>>(["all"]);
  const tagsLayerVisible = ref(false); // Default visibility state for tags layer
  const dataParams = ref<Record<string, string | number | null>>({});
  const imgParams = ref<Record<string, string | number | null>>({});
  const enable3D = ref<boolean>(false);
  const enablePlan = ref<boolean>(false);
  const areMapPointsLoaded = ref<boolean>(false);
  const placeId = ref<string | null>(null);

  return { categories, tags, dataSetValue, showUnknownRange, tagsLayerVisible, necropoli, selectedRange, tombType, dataParams, enable3D, enablePlan, areMapPointsLoaded, imgParams, placeId, selectedSite };
});
