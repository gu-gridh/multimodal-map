import { ref, shallowRef, computed } from "vue";
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

  // Sites are fetched once with their site types and filtered on the client.
  // shallowRef: thousands of plain features do not need deep reactivity.
  const sites = shallowRef([]);
  const siteTypes = ref([]); // [{ id, text, count, is_data_type }]
  const visibleSiteCount = ref(0);

  // Compare mode state
  const compareMode = ref(false);
  const compareTypes = ref([]);

  // Computed: whether compare has enough types selected
  const canCompare = computed(() => compareTypes.value.length >= 2);

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
    doneFetching,
    compareMode,
    compareTypes,
    sites,
    siteTypes,
    visibleSiteCount,
    canCompare,
  };
});
