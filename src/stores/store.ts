import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Item } from "../types/map";
import type { Ref } from "vue";

interface MapParams {
  bbox?: Array<number>;
  searchIds?: Array<number>;
  selectedId?: Array<number>;
}

export const mapStore = defineStore("map", () => {
  const item = ref<any | undefined>(undefined);
  const extent = ref<Array<number>>();
  const results = ref<Array<any>>();
  const params = ref<MapParams>({});
  const mapUrls = ref<Array<string>>();

  return { item, extent, params, results, mapUrls };
});
