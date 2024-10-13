<template>
  <div id="gallery-container">

    <div class="gallery-filters">
      <div class="gallery-filters-padding" style="padding-left:30px;">
      <div class="gallery-filter-container">
        <h1>Description</h1>
        <div class="tag-container">
          <div class="gallery-tag">Cross</div>
          <div class="gallery-tag">Saint</div>
          <div class="gallery-tag">Skull</div>
        </div>
      </div>
    </div>
    </div>

    <div class="gallery">
      
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.uuid" class="gallery__item">
        
        <!-- <router-link :to="`/panel/${item.name}?depth=2`" @click="updatePanelId(item)"> -->
          <a :href="`https://71807.dh.gu.se/viewer/?q=${item.name}`" target="_blank">
        <div class="item-info">
          <div class="item-info-meta">
            <h1>{{ $t('panel') }} {{ item.name }}</h1>
          </div>
        </div>
        <img :src="`${item.attached_orthophoto}/full/250,/0/default.jpg`" loading="lazy" @load="imageLoaded" />
      </a>
      <div class="cut-off"></div>
        <!-- </router-link> -->
      </div>
    </div>

    <div class="page-load-status">
      <div class="loader-ellips infinite-scroll-request">
        <span class="loader-ellips__dot"></span>
        <span class="loader-ellips__dot"></span>
        <span class="loader-ellips__dot"></span>
        <span class="loader-ellips__dot"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import InfiniteScroll from 'infinite-scroll';
import { inscriptionsStore } from "./settings/store";
import apiConfig from "./settings/apiConfig";

export default {
  setup() {
    const images = ref([]);
    let msnry;
    const store = inscriptionsStore();
    let pageIndex = 1;  // Initialize pageIndex to 1
    let canIncrement = true;  // Flag to control the increment
    let infScroll;
    let lastFetchedPageIndex = 0;

    watch(
      () => store.imgParams,
      async (newParams, oldParams) => {
        pageIndex = 1;
        lastFetchedPageIndex = 0;

        images.value = [];

        await fetchData(1);

        // Make sure to wait until all images have loaded
        imagesLoaded(document.querySelector('.gallery'), () => {
          // msnry.reloadItems();
          // msnry.layout();
          reinitInfiniteScroll();
        });
      }
    );

    const updatePanelId = (item) => {
      store.panelId = item.featureId;
    };

    const fetchData = async (requestedPageIndex) => {
      if (requestedPageIndex > lastFetchedPageIndex) {
        try {
          const urlToFetch = `${apiConfig.IMAGE}?type_of_image=1&depth=2&${new URLSearchParams(store.imgParams).toString()}`; // type_of_image=1 only fetches Ortophotos
          const res = await fetch(urlToFetch);
          const data = await res.json();
          const newImages = data.results.map(item => ({
            attached_orthophoto: item.iiif_file,
            name: item.panel.title,
          })).filter(img => img && img.attached_orthophoto);

          images.value = [...images.value, ...newImages];

          lastFetchedPageIndex = requestedPageIndex;  // Update the lastFetchedPageIndex
        } catch (error) {
          console.error("Error fetching additional images:", error);
        }
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

  const checkFor404 = async (url) => {
    try {
      const res = await fetch(url);
      if (res.status === 404) {
        msnry.layout();
        return true; // Indicates that a 404 was found
      }
    } catch (error) {
      console.error("Error in 404 fetch:", error);
    }
    return false; // Indicates that a 404 was not found
  };

  infScroll = new InfiniteScroll(gallery, {
    path: () => {
      if (canIncrement) {
        pageIndex++;  // Increment pageIndex for the next set of data
      }
      canIncrement = false; // Disable further increments
      const offset = (pageIndex - 1) * 25;
      const url = `${apiConfig.IMAGE}?offset=${offset}&type_of_image=1&depth=2&${new URLSearchParams(store.imgParams).toString()}`;

      // Use Promise syntax to handle the asynchronous 404 check
      checkFor404(url).then(async (is404) => {
        if (is404) {
          // Here, first ensure all images are fully loaded
          await new Promise((resolve) => {
            imagesLoaded(document.querySelector('.gallery'), resolve);
          });
          msnry.reloadItems();
          msnry.layout();
        }
      });

      return url;
    },
    outlayer: msnry,
    status: '.page-load-status',
    history: false,
    scrollThreshold: 1200,
    elementScroll: true,
  });

  infScroll.on('load', async function (response) {
    if (pageIndex > lastFetchedPageIndex) {
      try {
        // Extract the body content from the HTML response
        let bodyContent = response.querySelector("body").textContent;

        // Convert the body content to JSON
        const data = JSON.parse(bodyContent);

        const newImages = data.results.map(item => ({
          attached_orthophoto: item.iiif_file,
          name: item.panel.title,
        })).filter(img => img !== null);

        images.value = [...images.value, ...newImages];

        imagesLoaded(document.querySelector('.gallery'), () => {
          msnry.reloadItems();
          msnry.layout();
        });
      }
      catch (e) {
        console.error("JSON Parsing failed or other error: ", e);
      }
    }
    canIncrement = true;
  });
};

    const reinitInfiniteScroll = () => {
      if (infScroll) {
        infScroll.destroy(); // Destroy the existing InfiniteScroll instance
      }
      initMasonry(); // Reinitialize Masonry and InfiniteScroll
    };

    onMounted(() => {
      fetchData(1).then(() => {

        imagesLoaded(document.querySelector('.gallery'), () => {
          initMasonry();

          // After the initial Masonry initialization, reload and layout again
          // to make sure the first batch of images obeys the Masonry layout.
          msnry.reloadItems();
          msnry.layout();
        });
      });
    });

    return {
      images,
      updatePanelId
    };
  },
};
</script>


<style scoped>
.gallery {
  float:left;
  width:100%;
  max-height: 100%;
  overflow-y: auto;
  max-width: 100%;
  /* Maximum width of the gallery */
  margin: 0 auto;
  padding:10px 0px 0px 0px;
  pointer-events: auto;
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
  width: calc(16.6%);
  max-height:700px;
  min-height:250px;
}

.gallery__gutter-sizer {
  width: 0px;
}


@media screen and (max-width: 1800px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(20%);
  }
}


@media screen and (max-width: 1500px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(25%);
  }
}

@media screen and (max-width: 1300px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(33%);
  }
}

@media screen and (max-width: 1100px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50%);
  }
}

@media screen and (max-width: 900px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50%);
  }

  .gallery {
  padding-top:80px;
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
  -webkit-transition-property: none!important;
  -moz-transition-property: none!important;
  -o-transition-property: none!important;
  transition-property: none!important;
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
  padding: 20px 25px;
  padding-bottom: 40px !important;
  display: none;
}

.gallery__item img {
  display: block;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
  transform: scale(0.98);
}


.gallery__item img:hover {
  display: block;
  transform: scale(1.00);
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0)30%) !important;
}

.gallery__item .cut-off {
  height:200px;
  pointer-events:none;
  width:100%;
  position:absolute;
  bottom:0px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 1.0)5px, rgba(0, 0, 0, 0)100%) !important;
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