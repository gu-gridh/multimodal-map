<template>
  <div id="gallery-container">
    <div class="gallery-filters">
      <div class="gallery-filters-padding">
        <div class="gallery-filter-container">
          <h1>{{ $t('alignment') }}</h1>
          <div class="tag-container">
            <div v-for="alignment in alignments" :key="alignment.id" class="gallery-tag" :class="{ active: store.alignmentModel === alignment.id }" @click="updateFilter('alignment', alignment.id)">
              {{ alignment.text }}
            </div>
          </div>
        </div>

        <div class="gallery-filter-container">
          <h1>{{ $t('condition') }}</h1>
          <div class="tag-container">
            <div v-for="condition in conditions" :key="condition.id" class="gallery-tag" :class="{ active: store.conditionModel === condition.id }" @click="updateFilter('condition', condition.id)">
              {{ condition.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gallery">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.id" class="gallery__item">
        <a :href="`https://71807.dh.gu.se/viewer/?q=${item.panelTitle}/${item.id}`" target="_blank">
          <div class="item-info">
            <div class="item-info-meta">
              <h1>{{ item.panelTitle }}:{{ item.id }}</h1>
              <h2 v-if="item.subtitle" style="font-size: 12px;">{{ item.subtitle }}</h2>
            </div>
          </div>
          <img :src="`${item.inscription_iiif_url}/!300,/0/default.jpg`" loading="lazy" @load="imageLoaded" />
        </a>
        <div class="cut-off"></div>
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
import i18n from '../../src/translations/sophia';

export default {
  setup() {
    const images = ref([]);
    const store = inscriptionsStore();
    const alignments = ref([]);
    const conditions = ref([]);
    let msnry;
    let pageIndex = 1;  // Initialize pageIndex to 1
    let canIncrement = true;  // Flag to control the increment
    let infScroll;
    let lastFetchedPageIndex = 0;

    const fetchDataAndPopulateRef = async (url, refToPopulate) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        const textKey = i18n.global.locale === 'uk' ? 'text_ukr' : 'text';
        refToPopulate.value = data.results.map(item => ({
          id: item.id,
          text: item[textKey] || item.text,
        }));
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    const updateFilter = (filterType, selectedId) => {
      if (filterType === 'alignment') {
        if (store.alignmentModel === selectedId) {
          store.alignmentModel = null;  //deselect
        } else {
          store.alignmentModel = selectedId;
        }
      } else if (filterType === 'condition') {
        if (store.conditionModel === selectedId) {
          store.conditionModel = null;  //deselect
        } else {
          store.conditionModel = selectedId; 
        }      
      }
    };

    watch(
      () => store.imgParams,
      async (newCategory, oldCategory) => {
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

    watch(() => i18n.global.locale, (newLocale) => {
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/graffitialignment/',
        alignments
      );
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/graffiticondition/',
        conditions
      );
    });

    const updatePanelId = (item) => {
      store.panelId = item.featureId;
    };

    const fetchData = async (requestedPageIndex) => {
      if (requestedPageIndex > lastFetchedPageIndex) {
        try {
          const baseUrl = `https://saintsophia.dh.gu.se/api/inscriptions/inscription/?depth=1&${new URLSearchParams(store.imgParams).toString()}`;
          const res = await fetch(baseUrl);
          const data = await res.json();

          const newImages = data.results.map(item => ({
            inscription_iiif_url: item.inscription_iiif_url,
            panelTitle: item.panel ? item.panel.title : 'Unknown',
            subtitle: item.title,
            id: item.id,
          })).filter(img => img && img.inscription_iiif_url);

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
          const url = `https://saintsophia.dh.gu.se/api/inscriptions/inscription/?depth=1&offset=${offset}&${new URLSearchParams(store.imgParams).toString()}`;
          
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
              inscription_iiif_url: item.inscription_iiif_url,
              panelTitle: item.panel ? item.panel.title : 'Unknown',
              title: item.title,
              id: item.id,
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
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/graffitialignment/',
        alignments
      );
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/graffiticondition/',
        conditions
      );

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
      updatePanelId,
      alignments,
      conditions,
      updateFilter,
      store
    };
  },
};
</script>


<style scoped>
#gallery-container {
  padding: 0px 0px 0px 0px;
  opacity: 1.0;
}


.gallery {
  float: left;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  max-width: 100%;
  /* Maximum width of the gallery */
  margin: 0 auto;
  padding: 0px 0px 0px 0px;
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
  width: calc(14.28% - 1px);
}

.gallery__gutter-sizer {
  width: 0.5px;
}


@media screen and (max-width: 2000px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(16.6 - 0.5px);
  }
}


@media screen and (max-width: 1800px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(20% - 0.5px);
  }
}

@media screen and (max-width: 1600px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(25% - 0.5px);
  }
}

@media screen and (max-width: 1400px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(33% - 0.5px);
  }
}

@media screen and (max-width: 1200px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50% - 0.5px);
  }
}

@media screen and (max-width: 900px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50% - 0.5px);
  }

  .gallery {
    padding-top: 80px;
  }
}



/* hide by default */
.gallery.are-images-unloaded .image-gallery__item {
  opacity: 0;
}

.gallery__item {
  margin-bottom: 0.5px;
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
  transition: all 0.2s ease-in-out;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.0) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.item-info-meta {
  /* text-transform: capitalize; */
  position: absolute;
  color: white;
  bottom: 0px;
  padding: 20px 25px;
  padding-bottom: 10px !important;
  font-weight: 200;
  display: none;
}

.gallery__item img {
  display: block;
  transition: all 0.2s ease-in-out;
}


.gallery__item img:hover {
  display: block;
  transform: scale(1.03);
  border-radius: 4px;
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0)30%) !important;
}

.gallery__item .cut-off {
  height: 0px;
  pointer-events: none;
  width: 100%;
  position: absolute;
  bottom: 0px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 1.0)5px, rgba(0, 0, 0, 0)100%) !important;
}

.gallery__item:hover .item-info-meta {
  display: block;
}

/* .page-load-status {
  display: none;
  padding-top: 20px;
  border-top: 1px solid #DDD;
  text-align: center;
  color: #777;
} */

.gallery-tag.active {
  background-color:rgba(100,40,40,1.0) !important;
}
</style>