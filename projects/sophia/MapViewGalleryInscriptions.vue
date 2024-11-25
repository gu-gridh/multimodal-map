<template>
  <div id="gallery-container">
    <div class="gallery-filters">
      <div class="gallery-filters-padding">
        <div class="gallery-filter-container">
          <h1>{{ $t('alignment') }}</h1>
          <div class="tag-container">
            <div v-for="alignment in alignments" :key="alignment.id" class="gallery-tag"
              :class="{ active: store.alignmentModel === alignment.id }"
              @click="updateFilter('alignment', alignment.id)">
              {{ alignment.text }}
            </div>
          </div>
        </div>

        <div class="gallery-filter-container">
          <h1>{{ $t('condition') }}</h1>
          <div class="tag-container">
            <div v-for="condition in conditions" :key="condition.id" class="gallery-tag"
              :class="{ active: store.conditionModel === condition.id }"
              @click="updateFilter('condition', condition.id)">
              {{ condition.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gallery">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.id" class="gallery__item image-unloaded">
        <a :href="`https://71807.dh.gu.se/viewer/?q=${item.panelTitle}/${item.id}`" target="_blank">
          <div class="item-info">
            <div class="item-info-meta">
              <h1>{{ item.panelTitle }}:{{ item.id }}<span v-if="item.subtitle">|</span><span v-if="item.subtitle">{{
                item.subtitle }}</span></h1>
            </div>
          </div>
          <img :src="`${item.inscription_iiif_url}/!300,/0/default.jpg`" loading="lazy" @load="imageLoaded" />
        </a>
      </div>
      <div class="gallery-corner-blur"></div>
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
    let pageIndex = 1;  //initialize pageIndex to 1
    let canIncrement = true;  //flag to control the increment
    let infScroll;
    let lastFetchedPageIndex = 0;
    let isFetching = false;

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
        canIncrement = true;
        images.value = [];

        await fetchData(pageIndex);
        pageIndex = 2;

        imagesLoaded('.gallery', () => {
          const newItems = document.querySelectorAll('.gallery__item.image-unloaded');
          newItems.forEach(item => {
            item.classList.remove('image-unloaded');
          });

          reinitInfiniteScroll();
          reloadAndLayout();
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

    const fetchData = async (requestedPageIndex) => {
      if (requestedPageIndex > lastFetchedPageIndex && !isFetching) {
        try {
          isFetching = true;
          const offset = (requestedPageIndex - 1) * 25;
          const baseUrl = `https://saintsophia.dh.gu.se/api/inscriptions/inscription/?depth=1&offset=${offset}&${new URLSearchParams(store.imgParams).toString()}`;
          const res = await fetch(baseUrl);
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const newImages = data.results.map(item => ({
              inscription_iiif_url: item.inscription_iiif_url,
              panelTitle: item.panel ? item.panel.title : 'Unknown',
              subtitle: item.title,
              id: item.id,
            })).filter(img => img && img.inscription_iiif_url);

            images.value = [...images.value, ...newImages];
            // storedApiData.value = [...storedApiData.value, ...data.results];

            lastFetchedPageIndex = requestedPageIndex;
          } else {
            console.log("No more data available.");
            infScroll && infScroll.off('load');
          }
        } catch (error) {
          console.error("Error fetching additional images:", error);
        } finally {
          isFetching = false;
        }
      }
    };

    const reloadAndLayout = () => {
      return new Promise((resolve) => {
        msnry.reloadItems();
        resolve();
      }).then(() => {
        msnry.layout();
      });
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
          canIncrement = false; //disable further increments
          const offset = (pageIndex - 1) * 25;
          const url = `https://saintsophia.dh.gu.se/api/inscriptions/inscription/?depth=1&offset=${offset}&${new URLSearchParams(store.imgParams).toString()}`;
          return url;
        },
        outlayer: msnry,
        status: '.page-load-status',
        history: false,
        scrollThreshold: 200,
        elementScroll: true,
      });

      infScroll.on('load', async function () {
        if (pageIndex >= lastFetchedPageIndex) {
          try {
            await fetchData(pageIndex);
            pageIndex++;

            imagesLoaded('.gallery', () => {
              const newItems = document.querySelectorAll('.gallery__item.image-unloaded');
              newItems.forEach(item => {
                item.classList.remove('image-unloaded');
              });

              reloadAndLayout();
            });
          } catch (e) {
            console.error("error in the load event of infinite scroll:", e);
          } finally {
            canIncrement = true;
          }
        } else {
          canIncrement = true;
        }
      });
    };

    const reinitInfiniteScroll = () => {
      if (infScroll) {
        infScroll.destroy();
      }
      if (msnry) {
        msnry.destroy();
      }
      initMasonry(); //reinitialize Masonry and InfiniteScroll
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
        pageIndex = 2;
        imagesLoaded('.gallery', () => {
          const newItems = document.querySelectorAll('.gallery__item.image-unloaded');
          newItems.forEach(item => {
            item.classList.remove('image-unloaded');
          });

          initMasonry();
          reloadAndLayout();
        });
      });
    });

    return {
      images,
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
  padding: 0px 10px 0px 0px;
  opacity: 1.0;
  background-color: var(--theme-1);
}

.gallery {
  float: left;
  width: 100%;
  max-height: 100%;
  min-height: 100%;
  overflow-y: auto;
  max-width: 100%;
  /* Maximum width of the gallery */
  margin: 0 auto;
  padding: 100px 0px 0px 0px !important;
  pointer-events: auto;
  /* Top and bottom margin 0, left and right margin auto */

}

.gallery::-webkit-scrollbar {
  display: none;
}

.gallery-filters {
  background: transparent !important;
  color: white !important;
}

.gallery-filters .tag-container .gallery-tag {
  background-color: rgba(40, 40, 40, 0.4);
  border-color: white;
  font-weight: 300;
  backdrop-filter: blur(5px);
}

.gallery-filters .tag-container .gallery-tag:hover {
  background-color: rgba(140, 60, 60, 1.0);
}

.gallery-filters h1 {
  color: black;
  text-shadow: rgb(235, 230, 225) 1px 0 4px;
}

.gallery-corner-blur {
  position: fixed;
  right: -250px;
  bottom: -350px;
  width: 100px;
  height: 50px;
  box-shadow: 0px 0px 100px 600px rgba(235, 230, 225, 0.4);
  border-radius: 50%;
  z-index: 100;
}

@media screen and (max-width: 900px) {
  .gallery-corner-blur {
    display: none;
  }

  #gallery-container {
    padding: 0px 00px 0px 0px;

  }
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
  width: 10px;
}

@media screen and (max-width: 2000px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(16.6 - 10.0px);
  }
}

@media screen and (max-width: 1800px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(20% - 10.0px);
  }
}

@media screen and (max-width: 1600px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(25% - 10.0px);
  }
}

@media screen and (max-width: 1400px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(33% - 10.0px);
  }
}

@media screen and (max-width: 1200px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50% - 10.0px);
  }
}

/* hide by default */
.gallery.are-images-unloaded .image-gallery__item {
  opacity: 0;
}

.gallery__item.image-unloaded {
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

@media screen and (max-width: 900px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50% - 0.0px);
  }

  .gallery {
    padding-top: 80px;
  }

  .gallery__gutter-sizer {
    width: 0px;
  }

  .gallery__item {
    margin-bottom: 0px;
  }
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
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0)30%) !important;
  /*   box-shadow: inset 0rem 0rem 5rem rgba(0, 0, 0, 0.3) !important; */
}

.item-info-meta {
  /* text-transform: capitalize; */
  position: absolute;
  width: 100%;
  color: white;
  bottom: 0px;
  padding: 10px 15px;
  font-weight: 200;
  display: block;
  border-width: 0px 0 0px 0;
  border-color: white;
  border-style: dotted;
}

h1 {
  font-weight: 400 !important;
  font-size: 14px !important;
}

h1 span {
  display: inline !important;
  margin-left: 5px;
  font-weight: 200;
}

.gallery__item img {
  display: block;
  transition: all 0.1s ease-in-out;
}


.gallery__item img:hover {
  display: block;
  transform: scale(1.03);
  border-radius: 4px;
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0px, rgba(0, 0, 0, 0)30%) !important;
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
  background-color: rgba(100, 40, 40, 1.0) !important;
}
</style>