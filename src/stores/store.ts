import { ref } from "vue";
import { defineStore } from "pinia";
import type Feature from "ol/Feature";

interface MapParams {
  bbox?: Array<number>;
  searchIds?: Array<number>;
}

export const mapStore = defineStore("map", () => {
  const extent = ref<Array<number>>();
  const selectedFeature = ref<Feature>();
  const results = ref<Array<any>>();
  const params = ref<MapParams>({});
  const mapUrls = ref<Array<string>>();

  return { extent, selectedFeature, params, results, mapUrls };
});
