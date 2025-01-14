import { ref } from "vue";
import { defineStore } from "pinia";

// interface MapParams {
//   bbox?: Array<number>;
//   searchIds?: Array<number>;
// }

export const mapStore = defineStore("map", () => {
  const extent = ref();
  const center = ref([0, 0]);  //default center
  const zoom = ref(1);  //default zoom
  const selectedFeature = ref();
  const results = ref();
  const params = ref({});
  const mapUrls = ref();
  const galleryImages = ref();

  function updateCenter(newCenter) {
    center.value = newCenter;
  }

  function updateZoom(newZoom) {
    zoom.value = newZoom;
  }

  function updateResults(newResults) {
    results.value = newResults
  }

  function updateGalleryImages(newImages) {
    galleryImages.value = newImages
  }

  function updateBounds(bbox) {
    extent.value = [
      bbox[0][0], //min latitude
      bbox[0][1], //min longitude
      bbox[1][0], //max latitude
      bbox[1][1]  //max longitude
    ];
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
    updateGalleryImages,
    updateBounds
  };
});
