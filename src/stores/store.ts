import { ref } from "vue";
import { defineStore } from "pinia";
import type Feature from "ol/Feature";

interface MapParams {
  bbox?: Array<number>;
  searchIds?: Array<number>;
}

export const mapStore = defineStore("map", () => {
  const extent = ref<Array<number>>();
  const center = ref<Array<number>>([0, 0]);  // Default center
  const zoom = ref<number>(1);  // Default zoom
  const selectedFeature = ref<Feature>();
  const results = ref<Array<any>>();
  const params = ref<MapParams>({});
  const mapUrls = ref<Array<string>>();
  const galleryImages = ref<[]>();

  // Define methods to update the zoom and center.
  function updateCenter(newCenter: Array<number>) {
    center.value = newCenter;
  }

  function updateZoom(newZoom: number) {
    zoom.value = newZoom;
  }

  function updateResults(newResults: Array<any>) {
    results.value = newResults
  }

  function updateGalleryImages(newImages: []) {
    galleryImages.value = newImages
  }

  return { 
    extent, 
    center, 
    zoom, 
    selectedFeature, 
    params, 
    results, 
    mapUrls, 
    galleryImages,
    updateCenter, 
    updateZoom,
    updateResults,
    updateGalleryImages
  };
});
