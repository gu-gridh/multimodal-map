import { ref } from "vue";
import { defineStore } from "pinia";

export const inscriptionsStore = defineStore("inscriptions", () => {
  const categories = ref<Array<string>>(["all"]);
  const languageModel = ref<Array<string>>(["all"]);
  const pictorialModel = ref<Array<string>>(["all"]);
  const textualModel = ref<Array<string>>(["all"]);
  const writingModel = ref<Array<string>>(["all"]);
  const panelType = ref<Array<string>>(["all"]);
  const alignmentModel = ref<number | null>(null);
  const conditionModel = ref<number | null>(null);
  const mediaModel = ref<number | null>(null);
  const materialModel = ref<number | null>(null);
  const tagsLayerVisible = ref(false); //default visibility state for tags layer
  const dataParams = ref<Record<string, string | number | null>>({});
  const imgParams = ref<Record<string, string | number | null>>({});
  const surfaceParams = ref<Record<string, string | number | null>>({});
  const areMapPointsLoaded = ref<boolean>(false);
  const panelId = ref<string | null>(null);
  const panelStr = ref<string | null>(null);
  const inscriptionId = ref<string | null>(null);
  const selectedCategory = ref<number | null>(null); //the selected category number from mapviewcontrols

  const setSelectedCategory = (categoryNumber: number | null) => {
    selectedCategory.value = categoryNumber;
  };

  return {
    categories,
    languageModel,
    writingModel,
    pictorialModel,
    textualModel,
    panelType,
    tagsLayerVisible,
    dataParams,
    areMapPointsLoaded,
    imgParams,
    panelId,
    inscriptionId,
    setSelectedCategory,
    selectedCategory,
    alignmentModel,
    conditionModel,
    surfaceParams,
    mediaModel,
    materialModel,
    panelStr,
  };
});
