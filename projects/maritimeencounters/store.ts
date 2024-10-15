import { ref } from "vue";
import { defineStore } from "pinia";

export const maritimeencountersStore = defineStore("resources", () => {
  const categories = ref<Array<string>>(["all"]);
  const tags = ref<Array<string>>(["all"]);
  const dataSetValue = ref<Array<string>>(["all"]);
  const necropoli = ref<Array<string>>(["all"]);
  const selectedSite = ref<Array<string>>(["all"]);
  const selectedRange = ref([-1500, -500]);
  const showUnknownRange = ref(true);
  const tombType = ref<Array<string>>(["all"]);
  const tagsLayerVisible = ref(false); // Default visibility state for tags layer
  const dataParams = ref<Record<string, string | number | null>>({});
  const imgParams = ref<Record<string, string | number | null>>({});
  const selectedNecropolisCoordinates = ref<[number, number] | null>(null);
  const enable3D = ref<boolean>(false);
  const enablePlan = ref<boolean>(false);
  const areMapPointsLoaded = ref<boolean>(false);
  const placeId = ref<string | null>(null);
  const startRectangleDraw = ref<boolean>(false);

  return { categories, tags, dataSetValue, showUnknownRange, tagsLayerVisible, necropoli, selectedRange, tombType,  dataParams, selectedNecropolisCoordinates, enable3D, enablePlan, areMapPointsLoaded, imgParams, placeId, selectedSite, startRectangleDraw };
});