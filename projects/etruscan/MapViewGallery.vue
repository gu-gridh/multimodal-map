<template>
  <div id="gallery-container">
    <div class="gallery">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div
        v-for="item in images"
        :key="item.uuid"
        class="gallery__item"
      >
      
        <router-link
           :to="`/${item.datasetShortName}_${item.name.replace(/\s+/g, '_')}`"
          @click="updatePlaceId(item)"
        >
        <div class="item-info">
            <div class="item-info-meta">
              <h1>{{ $t('tomb') }} {{ item.name }}</h1>
              <h1> {{ item.necropolis }}</h1>
            </div>
        </div>
        <img 
          v-if="item.published && (item.first_photograph_id || item.default_image)" 
          :src="item.default_image ? `${item.default_image}/full/450,/0/default.jpg` : `https://img.dh.gu.se/diana/static/${item.first_photograph_id}/full/450,/0/default.jpg`" 
          loading="lazy" 
          @load="imageLoaded"
        />
        </router-link>
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
import { etruscanStore } from "./settings/store";
import apiConfig from "./settings/apiConfig";

export default {
  setup() {
    const images = ref([]);
    let msnry;
    const store = etruscanStore();
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

const updatePlaceId = (item) => {
      store.placeId = item.featureId;
};

const fetchData = async (requestedPageIndex) => {
  if (requestedPageIndex > lastFetchedPageIndex) {
    try {
      const urlToFetch = `${apiConfig.PLACE}?depth=1&page=${requestedPageIndex}&${new URLSearchParams(store.imgParams).toString()}`;
      const res = await fetch(urlToFetch);
      const data = await res.json();
      const newImages = data.features.map(feature => ({
          ...feature.properties.first_photograph_id,
          featureId: feature.id,
          default_image: feature.properties.default_image ? feature.properties.default_image.iiif_file : null,
          first_photograph_id: feature.properties.first_photograph_id ? feature.properties.first_photograph_id.iiif_file : null,
          name: feature.properties.name,
          necropolis: feature.properties.necropolis.text,
          datasetShortName: feature.properties.dataset.short_name
        })).filter(img => img && (img.default_image || img.first_photograph_id));
      
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
      const url = `${apiConfig.PLACE}?depth=1&page=${pageIndex}&${new URLSearchParams(store.imgParams).toString()}`;

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

  infScroll.on('load', async function(response)   {
    if (pageIndex > lastFetchedPageIndex) {
      try {
          // Extract the body content from the HTML response
          let bodyContent = response.querySelector("body").textContent;
          
          // Convert the body content to JSON
          const data = JSON.parse(bodyContent);
          
          const newImages = data.features.map(feature => ({
                ...feature.properties.first_photograph_id,
                featureId: feature.id,
                default_image: feature.properties.default_image ? feature.properties.default_image.iiif_file : null,
                first_photograph_id: feature.properties.first_photograph_id ? feature.properties.first_photograph_id.iiif_file : null,
                name: feature.properties.name,
                necropolis: feature.properties.necropolis.text,
                datasetShortName: feature.properties.dataset.short_name
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
      updatePlaceId
    };
  },
};
</script>


<style scoped>
#gallery-container{
  position:absolute;
  width:100%;
  height:calc(100% - 80px);
  padding-left:31%;
  z-index:100!important;
  background-color: rgba(232, 228, 217, 0.5) !important;
  backdrop-filter:blur(5px);
}

@media screen and (min-width: 1900px) {
  #gallery-container{ 
    padding-left:600px;
}
  }

@media screen and (max-width: 1500px) {
  #gallery-container{ 
    padding-left:500px;
}
  }

  @media screen and (max-width: 900px) {
  #gallery-container{ 
    padding-left:5px;
}
  }

.gallery {
  max-height: 100%;
  overflow-y: auto;
  max-width: 100%; /* Maximum width of the gallery */
  margin: 0 auto; /* Top and bottom margin 0, left and right margin auto */  
}

.gallery::-webkit-scrollbar {
  display: none;
}

/* reveal gallery after images loaded */
.gallery.are-images-unloaded {
  opacity: 0;
}

.gallery__item {
  opacity: 1;
  min-height: 30px; 
  margin-bottom: 10px;
  float: left;
  overflow: hidden !important;
  -webkit-transition-property: none !important;
  -moz-transition-property: none !important;
  -o-transition-property: none !important;
  transition-property: none !important;
}

.gallery__item,
.gallery__col-sizer {
  width: calc(25% - 10px);
}
.gallery__gutter-sizer { width: 10px;}

@media screen and (max-width: 1500px) {
  .gallery__item, .gallery__col-sizer {
    width: calc(33% - 8px);
  }
}

@media screen and (max-width: 900px) {
  .gallery__item, .gallery__col-sizer {
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
  overflow:hidden !important;
}

.gallery__item--height1 { height: 140px; background: #EA0; }
.gallery__item--height2 { height: 220px; background: #C25; }
.gallery__item--height3 { height: 300px; background: #19F; }

.gallery__item--width2 { width: 66%; }

.item-info{
  pointer-events:none;
  position:absolute!important;
  height:100%!important;
  width:100%!important;
  z-index:1000!important;
  bottom:0px;
  transition: all 0.5s ease-in-out;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.0) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.item-info-meta{
  /* text-transform: capitalize; */
  position:absolute;
  color:white;
  bottom:0px;
  padding:10px 15px;
  display:none;
}

.gallery__item img {
  display: block;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}


.gallery__item img:hover {
  display: block;
  transform:scale(1.05);
}

.gallery__item:hover .item-info{
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.gallery__item:hover .item-info-meta{
 display:block;
}

.page-load-status {
  display: none; /* hidden by default */
  padding-top: 20px;
  border-top: 1px solid #DDD;
  text-align: center;
  color: #777;
}

</style>