/**
 * Data sources derived from the filter store.
 *
 * A "source" is one backend resource with ready-to-use query params. With
 * layer "all" there are two sources (object + ir_motive) and the UI browses
 * them merged — museum objects first, then registry cards — exactly like
 * the original Gallery.vue did.
 */
import { computed } from "vue";
import { storeToRefs } from "pinia";
import config from "./config";
import { iconographiaStore } from "./store";

const [YEAR_MIN, YEAR_MAX] = config.timeRange;

/** The category chip value maps onto different cdh_category values
    per resource ("Övrigt" is "interiör" in the museum data). */
function categoryParam(type, cat) {
  if (!cat || cat === "all") return undefined;
  if (cat === "övrigt") return type === "object" ? "interiör" : "övrigt";
  return cat;
}

export function useSources() {
  const store = iconographiaStore();
  const {
    layer,
    categories,
    technique,
    searchString,
    selectedRange,
    includeUndated,
    placeId,
    mapBbox,
  } = storeToRefs(store);

  function filterParamsFor(type) {
    const p = {};
    if (searchString.value) p.search = searchString.value;
    const cat = categoryParam(type, categories.value[0]);
    if (cat) p.cdh_category = cat;
    if (type === "ir_motive" && technique.value !== "all") {
      p.technique = technique.value;
    }
    const [minYear, maxYear] = selectedRange.value;
    if (minYear > YEAR_MIN || maxYear < YEAR_MAX) {
      p.min_year = minYear;
      p.max_year = maxYear;
      if (!includeUndated.value) p.undated = "false";
    }
    return p;
  }

  function listParamsFor(type) {
    const p = filterParamsFor(type);
    if (placeId.value) {
      p[type === "object" ? "place" : "place_ref"] = placeId.value;
    } else if (mapBbox.value) {
      p.bbox = mapBbox.value;
    }
    return p;
  }

  /** Active sources, in browse order. mapParams excludes place/bbox so the
      pins stay visible while the gallery narrows. */
  const sources = computed(() => {
    const types =
      layer.value === "all" ? ["object", "ir_motive"] : [layer.value];
    return types.map((type) => ({
      type,
      mapParams: filterParamsFor(type),
      listParams: listParamsFor(type),
    }));
  });

  return { sources };
}
