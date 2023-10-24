<template>
  <div id="gallery-container">
    <div class="grid">
      <div class="grid__col-sizer"></div>
      <div class="grid__gutter-sizer"></div>
      <div
        v-for="item in images"
        :key="item.uuid"
        class="grid__item"
      >
      
        <router-link
          :to="`/place/${item.featureId}`"
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
import { etruscanStore } from "./store";

export default {
  setup() {
    const images = ref([]);
    let msnry;
    const store = etruscanStore();
    let pageIndex = 1;  // Initialize pageIndex to 1
    let canIncrement = true;  // Flag to control the increment

    watch(
      () => store.imgParams,
      async (newParams, oldParams) => {
        pageIndex = 1;

        images.value = [];
        
        await fetchData(1);

        // Make sure to wait until all images have loaded
        imagesLoaded(document.querySelector('.grid'), () => {
          msnry.reloadItems();
          msnry.layout();
        });
      }
    );

    const fetchData = async (pageIndex) => {
      try {
        const params = new URLSearchParams(store.imgParams).toString();
        
        // Create the URL string as a separate variable
        const urlToFetch = `https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page=${pageIndex}&${params}`;
        
        // Fetch the data
        const res = await fetch(urlToFetch);
        const data = await res.json();
        const newImages = data.features.map(feature => ({
                ...feature.properties.first_photograph_id,
                featureId: feature.id,
                default_image: feature.properties.default_image ? feature.properties.default_image.iiif_file : null,
                first_photograph_id: feature.properties.first_photograph_id ? feature.properties.first_photograph_id.iiif_file : null,
                name: feature.properties.name,
                necropolis: feature.properties.necropolis.text
              })).filter(img => img && Object.keys(img).length > 0);
        images.value = [...images.value, ...newImages];
      } catch (error) {
        console.error("Error fetching additional images:", error);
      }
    };

    const initMasonry = () => {
      const grid = document.querySelector('.grid');
      if (!grid) {
        console.error('Grid element not found.');
        return;
      }

      msnry = new Masonry(grid, {
        itemSelector: '.grid__item',
        columnWidth: '.grid__col-sizer',
        gutter: '.grid__gutter-sizer',
        percentPosition: true,
      });

   const infScroll = new InfiniteScroll(grid, {
    path: () => {
      if (canIncrement) {
        pageIndex++;  // Increment pageIndex for the next set of data
      }
      canIncrement = false; // Disable further increments
      const params = new URLSearchParams(store.imgParams).toString();
      const url = `https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page=${pageIndex}&${params}`;

      return url;
    },
    outlayer: msnry,
    status: '.page-load-status',
    history: false,
    scrollThreshold: 1200,
    elementScroll: true,
  });

  infScroll.on('load', async function(response) {    
    try {
        // Extract the body content from the HTML response
        let bodyContent = response.querySelector("body").textContent;
        
        // Convert the body content to JSON
        const data = JSON.parse(bodyContent);

        // Check if the data is empty and still refresh the Masonry layout
        if (data.next === null) {
            console.error("No more images to load");
            msnry.layout();
            return;
        }
        
        const newImages = data.features.map(feature => ({
              ...feature.properties.first_photograph_id,
              featureId: feature.id,
              default_image: feature.properties.default_image ? feature.properties.default_image.iiif_file : null,
              first_photograph_id: feature.properties.first_photograph_id ? feature.properties.first_photograph_id.iiif_file : null,
              name: feature.properties.name,
              necropolis: feature.properties.necropolis.text
            })).filter(img => img !== null);        

        images.value = [...images.value, ...newImages];

        imagesLoaded(document.querySelector('.grid'), () => {
          msnry.reloadItems();
          msnry.layout();
        });
    } catch (e) {
        console.error("JSON Parsing failed or other error: ", e);
    }
      canIncrement = true;
  });
  };

  onMounted(() => {
  fetchData(1).then(() => {
    imagesLoaded(document.querySelector('.grid'), () => {
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
    };
  },
};
</script>


<style scoped>
#gallery-container{
  position:absolute;
  width:100%;
  height:calc(100% - 80px);
  padding-left:30%;
  z-index:100!important;
  background-color: rgba(232, 228, 217, 0.5) !important;
  backdrop-filter:blur(5px);
}

@media screen and (max-width: 1500px) {
  #gallery-container{ 
    padding-left:480px;
}
  }

  @media screen and (max-width: 900px) {
  #gallery-container{ 
    padding-left:5px;
}
  }

.grid {
  max-height: 100%;
  overflow-y: auto;
  max-width: 100%; /* Maximum width of the grid */
  margin: 0 auto; /* Top and bottom margin 0, left and right margin auto */  
}

.grid::-webkit-scrollbar {
  display: none;
}

/* reveal grid after images loaded */
.grid.are-images-unloaded {
  opacity: 0;
}

.grid__item,
.grid__col-sizer {
  width: calc(25% - 10px);
}
.grid__gutter-sizer { width: 10px;}

@media screen and (max-width: 1500px) {
  .grid__item, .grid__col-sizer {
    width: calc(33% - 8px);
  }
}

@media screen and (max-width: 900px) {
  .grid__item, .grid__col-sizer {
    width: calc(50% - 8px);
}
  }



/* hide by default */
.grid.are-images-unloaded .image-grid__item {
  opacity: 0;
}

.grid__item {
  margin-bottom: 10px;
  float: left;
  overflow:hidden !important;
}

.grid__item--height1 { height: 140px; background: #EA0; }
.grid__item--height2 { height: 220px; background: #C25; }
.grid__item--height3 { height: 300px; background: #19F; }

.grid__item--width2 { width: 66%; }

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
  text-transform: capitalize;
  position:absolute;
  color:white;
  bottom:0px;
  padding:10px 15px;
  display:none;
}

.grid__item img {
  display: block;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}


.grid__item img:hover {
  display: block;
  transform:scale(1.05);
}

.grid__item:hover .item-info{
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.grid__item:hover .item-info-meta{
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