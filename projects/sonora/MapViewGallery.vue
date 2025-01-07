<template>
  <div id="gallery-container">
    <div class="gallery">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.uuid" class="gallery__item">
        <router-link :to="`/place/${item.Id}`">
          <div class="item-info">
            <div class="item-info-meta">
              <h1> {{ item.Place }}</h1>
            </div>
          </div>
          <img :src="item.Photo" loading="lazy" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from "vue";
import Masonry from 'masonry-layout';
import InfiniteScroll from 'infinite-scroll';
import imagesLoaded from 'imagesloaded';
import { sonoraStore } from "./settings/store";
import { storeToRefs } from "pinia";

const { dataParams, selectedBuilderId } = storeToRefs(sonoraStore());
let msnry;
let pageIndex = 1;  //Initialize pageIndex to 1
let canIncrement = true;  //Flag to control the increment
let infScroll;

const images = ref([]);

const fetchData = async (requestedPageIndex) => {
  try {
    const urlToFetch = `https://orgeldatabas.gu.se/webgoart/goart/gallery.php?btype=${dataParams.value.buildingTypeId}&year1=${dataParams.value.year1}&year2=${dataParams.value.year2}&id=${selectedBuilderId.value}&page=${requestedPageIndex}&group=100`;
    const res = await fetch(urlToFetch);
    const data = await res.json();
    const newImages = data.map(item => ({
      Id: item.Id,
      Place: item.Place,
      Photo: item.Photo
    })).filter(img => img.Photo !== "");

    images.value = [...images.value, ...newImages];

  } catch (error) {
    console.error("Error fetching additional images:", error);
  }
};

const initMasonry = () => {
  const gallery = document.querySelector('.gallery');
  if (!gallery) {
    console.error('gallery element not found.');
    return;
  }

  msnry = new Masonry(gallery, {
    itemSelector: '.gallery__item',
    columnWidth: '.gallery__col-sizer',
    gutter: '.gallery__gutter-sizer',
    percentPosition: true,
  });

  infScroll = new InfiniteScroll(gallery, {
    path: () => {
      if (canIncrement) {
        pageIndex++;  // Increment pageIndex for the next set of data
      }
      canIncrement = false; // Disable further increments
      const url = `https://orgeldatabas.gu.se/webgoart/goart/gallery.php?btype=${dataParams.value.buildingTypeId}&year1=${dataParams.value.year1}&year2=${dataParams.value.year2}&id=${selectedBuilderId.value}&page=${pageIndex}&group=100`;
      return url;
    },
    outlayer: msnry,
    status: '.page-load-status',
    history: false,
    scrollThreshold: 1200,
    elementScroll: true,
  });

  infScroll.on('load', async function (response) {
    try {
      // Extract the body content from the HTML response
      let bodyContent = response.querySelector("body").textContent;

      // Convert the body content to JSON
      const data = JSON.parse(bodyContent);

      const newImages = data.map(item => ({
        Id: item.Id,
        Place: item.Place,
        Photo: item.Photo
      })).filter(img => img.Photo !== "");

      images.value = [...images.value, ...newImages];

      imagesLoaded(document.querySelector('.gallery'), () => {
        msnry.reloadItems();
        msnry.layout();
      });
    }
    catch (e) {
      console.error("JSON Parsing failed or other error: ", e);
    }

    canIncrement = true;
  });
};

onMounted(() => {
  fetchData(1).then(() => {
    imagesLoaded(document.querySelector('.gallery'), () => {
      initMasonry();
    });
  });
});

//watcher for dataParams changes to refetch data
watch(dataParams, async () => {
  images.value = [];
  pageIndex = 1;
  canIncrement = true;

  if (infScroll) {
    infScroll.destroy();
  }

  await fetchData(pageIndex);

  imagesLoaded(document.querySelector('.gallery'), () => {
    initMasonry();
  });
});

watch(selectedBuilderId, async () => {
  images.value = [];
  pageIndex = 1;
  canIncrement = true;

  if (infScroll) {
    infScroll.destroy();
  }

  await fetchData(pageIndex);

  imagesLoaded(document.querySelector('.gallery'), () => {
    initMasonry();
  });
});
</script>

<style>
#gallery-container {
  position: absolute;
  width: 100%;
  height: calc(100% - 80px);
  padding-left: 29%;
  z-index: 100 !important;
  background-color: rgba(232, 228, 217, 0.9) !important;
  backdrop-filter: blur(5px);
}

@media screen and (min-width: 1900px) {
  #gallery-container {
    padding-left: 600px;
  }
}

@media screen and (max-width: 1500px) {
  #gallery-container {
    padding-left: 500px;
  }
}

@media screen and (max-width: 900px) {
  #gallery-container {
    padding-left: 5px;
  }
}

.gallery {
  max-height: 100%;
  overflow-y: auto;
  max-width: 100%;
  /* Maximum width of the gallery */
  margin: 0 auto;
  /* Top and bottom margin 0, left and right margin auto */
}

.gallery::-webkit-scrollbar {
  display: none;
}

/* reveal gallery after images loaded */
.gallery.are-images-unloaded {
  opacity: 0;
}

.gallery__item,
.gallery__col-sizer {
  width: calc(16.6% - 10px);
}

.gallery__gutter-sizer {
  width: 10px;
}

@media screen and (max-width: 2000px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc(20% - 8px);
  }
}

@media screen and (max-width: 1800px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc(25% - 8px);
  }
}

@media screen and (max-width: 1500px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc(33% - 8px);
  }
}

@media screen and (max-width: 900px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc(50% - 8px);
  }
}

/* hide by default */
.gallery.are-images-unloaded .image-gallery__item {
  opacity: 0;
}

.gallery__item {
  margin-bottom: 10px;
  float: left;
  overflow: hidden !important;
  -webkit-transition-property: none !important;
  -moz-transition-property: none !important;
  -o-transition-property: none !important;
  transition-property: none !important;
}

.gallery__item--height1 {
  height: 140px;
  background: #EA0;
}

.gallery__item--height2 {
  height: 220px;
  background: #C25;
}

.gallery__item--height3 {
  height: 300px;
  background: #19F;
}

.gallery__item--width2 {
  width: 66%;
}

.item-info {
  pointer-events: none;
  position: absolute !important;
  height: 100% !important;
  width: 100% !important;
  z-index: 1000 !important;
  bottom: 0px;
  transition: all 0.5s ease-in-out;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.0) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.item-info-meta {
  /* text-transform: capitalize; */
  position: absolute;
  color: white;
  bottom: 0px;
  padding: 10px 15px;
  display: none;
}

.gallery__item img {
  display: block;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}


.gallery__item img:hover {
  display: block;
  transform: scale(1.05);
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.gallery__item:hover .item-info-meta {
  display: block;
}

.page-load-status {
  display: none;
  /* hidden by default */
  padding-top: 20px;
  border-top: 1px solid #DDD;
  text-align: center;
  color: #777;
}
</style>