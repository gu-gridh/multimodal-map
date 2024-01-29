import { ref } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const sonoraStore = defineStore("sonora", () => {
  const categories = ref<Array<string>>(["all"]);
  const tags = ref<Array<string>>(["all"]);
  const necropoli = ref<Array<string>>(["all"]);
  const tombType = ref<Array<string>>(["all"]);
  const tagsLayerVisible = ref(false); // Default visibility state for tags layer
  const placesLayerVisible = ref(true); // Default visibility state for places layer
  const dataParams = ref<Record<string, string | number | null>>({});
  const selectedNecropolisCoordinates = ref<[number, number] | null>(null);
  const enable3D = ref<boolean>(false);
  const selectedBuilderId = ref(null);
  const updateMapParams = (buildingTypeId, yearRange) => {
    dataParams.value = {
      ...dataParams.value,
      buildingTypeId: buildingTypeId,
      year1: yearRange ? yearRange[0] : null,
      year2: yearRange ? yearRange[1] : null
    };
  };

  return { categories, tags, tagsLayerVisible, placesLayerVisible, necropoli, tombType,  dataParams, selectedNecropolisCoordinates, enable3D, selectedBuilderId, updateMapParams };
});
