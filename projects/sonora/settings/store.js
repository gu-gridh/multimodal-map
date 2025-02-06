import { ref } from "vue";
import { defineStore } from "pinia";

export const sonoraStore = defineStore("sonora", () => {
  const categories = ref(["all"]);
  const selectedRange = ref([1300, 1899]);
  const tags = ref(["all"]);
  const necropoli = ref(["all"]);
  const tombType = ref(["all"]);
  const tagsLayerVisible = ref(false); //default visibility state for tags layer
  const placesLayerVisible = ref(true); //default visibility state for places layer
  const builderLayerVisible = ref(false);
  const dataParams = ref({});
  const placeClicked = ref(false);
  const noPlaceCount = ref(0);
  const enable3D = ref(false);
  const selectedBuilderId = ref(0);
  const selectedBuildingTypeIndex = ref(0);
  const updateMapParams = (buildingTypeId, yearRange) => {
    dataParams.value = {
      ...dataParams.value,
      buildingTypeId: buildingTypeId,
      year1: selectedRange.value[0],
      year2: selectedRange.value[1]
    };
  };

  return { categories, selectedBuildingTypeIndex, selectedRange, tags, tagsLayerVisible, placesLayerVisible, necropoli, tombType,  dataParams, enable3D, selectedBuilderId, noPlaceCount, builderLayerVisible, placeClicked, updateMapParams };
});
