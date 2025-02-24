import { ref } from "vue";
import { defineStore } from "pinia";

export const etruscanStore = defineStore("etruscan", () => {
  const categories = ref(["all"]);
  const tags = ref(["all"]);
  const dataSetValue = ref(["all"]);
  const necropoli = ref(["all"]);
  const selectedSite = ref(["1"]);
  const selectedRange = ref([-700, -200]);
  const showUnknownRange = ref(true);
  const tombType = ref(["all"]);
  const tagsLayerVisible = ref(false); //default visibility state for tags layer
  const dataParams = ref({});
  const imgParams = ref({});
  const enable3D = ref(false);
  const enablePlan = ref(false);
  const areMapPointsLoaded = ref(false);
  const placeId = ref(null);

  return { categories, tags, dataSetValue, showUnknownRange, tagsLayerVisible, necropoli, selectedRange, tombType, dataParams, enable3D, enablePlan, areMapPointsLoaded, imgParams, placeId, selectedSite };
});
