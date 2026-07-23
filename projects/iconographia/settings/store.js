import { ref } from "vue";
import { defineStore } from "pinia";
import config from "./config";

export const iconographiaStore = defineStore("iconographia", () => {
  /** Which collection is shown: "all" | "object" | "ir_motive".
      "all" browses both, museum objects first (as the original did). */
  const layer = ref("all");
  /** Selected category chip; ["all"] means no filter. */
  const categories = ref(["all"]);
  /** Selected technique (Registry layer only); "all" means no filter. */
  const technique = ref("all");
  /** Free-text search (DRF ?search=). */
  const searchString = ref("");
  /** Year range [min, max]; equal to config.timeRange means "no filter". */
  const selectedRange = ref([...config.timeRange]);
  /** Include records without dating. */
  const includeUndated = ref(true);
  /** Place filter, set by a map pin or a search suggestion. */
  const placeId = ref(null);
  const placeName = ref("");
  /** Current map extent as "west,south,east,north" (EPSG:4326); the
      gallery follows it (legacy "filter by adjusting the map view"). */
  const mapBbox = ref(null);
  /** Map camera, preserved across route changes. */
  const mapCenter = ref(null);
  const mapZoom = ref(null);
  /** Detail view expanded to full screen. */
  const detailExpanded = ref(false);

  return {
    layer,
    categories,
    technique,
    searchString,
    selectedRange,
    includeUndated,
    placeId,
    placeName,
    mapBbox,
    mapCenter,
    mapZoom,
    detailExpanded,
  };
});
