import { ref } from "vue";
import { defineStore } from "pinia";

export const inscriptionsStore = defineStore("inscriptions", () => {
  const categories = ref(["all"]);
  const languageModel = ref(["all"]);
  const pictorialModel = ref(["all"]);
  const textualModel = ref(["all"]);
  const writingModel = ref(["all"]);
  const panelType = ref(["all"]);
  const alignmentModel = ref(null);
  const conditionModel = ref(null);
  const mediaModel = ref(null);
  const materialModel = ref(null);
  const tagsLayerVisible = ref(false);
  const dataParams = ref({});
  const imgParams = ref({});
  const surfaceParams = ref({});
  const areMapPointsLoaded = ref(false);
  const panelId = ref(null);
  const panelStr = ref(null);
  const inscriptionId = ref(null);
  const selectedCategory = ref(null);
  const showGallery = ref(false);
  const showGalleryInscriptions = ref(false);
  const showPlan = ref(true);

  const setSelectedCategory = (categoryNumber) => {
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
    showGallery,
    showGalleryInscriptions,
    showPlan,
  };
});
