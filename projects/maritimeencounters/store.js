import { ref } from "vue";
import { defineStore } from "pinia";

export const maritimeencountersStore = defineStore("resources", () => {
  const categories = ref(["all"]);
  const tags = ref(["all"]);
  const dataSetValue = ref(["all"]);
  const necropoli = ref(["all"]);
  const dataType = ref(["all"]);
  const selectedRange = ref([-2450, 50]);
  const showUnknownRange = ref(true);
  const tagsLayerVisible = ref(false);
  const dataParams = ref({});
  const imgParams = ref({});
  const selectedNecropolisCoordinates = ref(null);
  const enable3D = ref(false);
  const enablePlan = ref(false);
  const areMapPointsLoaded = ref(false);
  const placeId = ref(null);
  const startRectangleDraw = ref(false);
  const showHeatMap = ref(false);
  const doneFetching = ref(false);

  return { 
    categories, 
    tags, 
    dataSetValue, 
    showUnknownRange, 
    tagsLayerVisible, 
    necropoli, 
    selectedRange, 
    dataParams, 
    selectedNecropolisCoordinates, 
    enable3D, 
    enablePlan, 
    areMapPointsLoaded, 
    imgParams, 
    placeId, 
    dataType, 
    startRectangleDraw, 
    showHeatMap, 
    doneFetching 
  };
});
