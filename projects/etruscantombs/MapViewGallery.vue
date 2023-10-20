<template>
  <div id="app">
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
        <img v-if="item.iiif_file" :src="`https://img.dh.gu.se/diana/static/${item.iiif_file}/full/450,/0/default.jpg`" loading="lazy" @load="imageLoaded" />
          <div class="grid__item-info">
            <div class="grid__item-info-meta">
              <h1>{{ item.title }}</h1>
            </div>
          </div>
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
import { onMounted, ref, watchEffect } from 'vue';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import InfiniteScroll from 'infinite-scroll';

export default {
  setup() {
    const images = ref([]);
    let msnry;

    const fetchData = async (pageIndex) => {
      try {
        const res = await fetch(`https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page=${pageIndex}`);
        const data = await res.json();
        const newImages = data.features.map(feature => ({
                ...feature.properties.first_photograph_id,
                featureId: feature.id,
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

    let pageIndex = 1;  // Initialize pageIndex to 1
    let canIncrement = true;  // Flag to control the increment

    const infScroll = new InfiniteScroll(grid, {
      path: () => {
      if (canIncrement) {
          pageIndex++;  // Increment pageIndex for the next set of data
        }
        canIncrement = false; // Disable further increments
        return `https://diana.dh.gu.se/api/etruscantombs/geojson/place/?page=${pageIndex}`;
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

          if (!data.features) {
              console.error("JSON object doesn't have 'features' property");
              return;
          }
          
          const newImages = data.features.map(feature => ({
                ...feature.properties.first_photograph_id,
                featureId: feature.id,
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
.grid {
  max-height: 100vh;
  overflow-y: auto;
  max-width: 90%; /* Maximum width of the grid */
  margin: 0 auto; /* Top and bottom margin 0, left and right margin auto */  
}

.grid::-webkit-scrollbar {
  display: none;
}

body {
  font-family: sans-serif;
  line-height: 1.4;
  font-size: 18px;
  padding: 20px;
  max-width: 640px;
  margin: 0 auto;
}

/* reveal grid after images loaded */
.grid.are-images-unloaded {
  opacity: 0;
}

.grid__item,
.grid__col-sizer {
  width: 32%;
}

.grid__gutter-sizer { width: 2%; }

/* hide by default */
.grid.are-images-unloaded .image-grid__item {
  opacity: 0;
}

.grid__item {
  margin-bottom: 20px;
  float: left;
}

.grid__item--height1 { height: 140px; background: #EA0; }
.grid__item--height2 { height: 220px; background: #C25; }
.grid__item--height3 { height: 300px; background: #19F; }

.grid__item--width2 { width: 66%; }

.grid__item img {
  display: block;
  max-width: 100%;
}


.page-load-status {
  display: none; /* hidden by default */
  padding-top: 20px;
  border-top: 1px solid #DDD;
  text-align: center;
  color: #777;
}

</style>