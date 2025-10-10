<template>
  <div id="gallery-container">
    <div v-show="isLoading" class="gallery-loader">
      <img :src="loaderSvg" alt="loading" />
    </div>
    <div class="gallery-filters">
      <div class="gallery-filters-padding" style="padding-left:30px;">
        <div class="gallery-filter-container">
          <h1>{{ $t('medium') }}</h1>
          <div class="tag-container">
            <div v-for="media in medias" :key="media.id" class="gallery-tag"
              :class="{ active: store.mediaModel === media.id }" @click="updateFilter('media', media.id)">
              {{ media.text }}
            </div>
          </div>
        </div>
        <div class="gallery-filter-container">
          <h1>{{ $t('material') }}</h1>
          <div class="tag-container">
            <div v-for="material in materials" :key="material.id" class="gallery-tag"
              :class="{ active: store.materialModel === material.id }" @click="updateFilter('material', material.id)">
              {{ material.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gallery">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.uuid" class="gallery__item image-unloaded">
        <a :href="`https://saintsophia.dh.gu.se/viewer/?q=${item.name}`">
          <div class="item-info">
            <div class="item-info-meta">
              <h1>{{ $t('panel') }} {{ item.name }}</h1>
            </div>
          </div>
          <img :src="`${item.attached_orthophoto}/pct:0,0,100,70/250,/0/default.jpg`" loading="lazy"
            @load="imageLoaded" />
        </a>
        <div class="cut-off"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from 'vue';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import InfiniteScroll from 'infinite-scroll';
import { inscriptionsStore } from './settings/store';
import i18n from '../../src/translations/sophia';
import loaderSvg from '../../src/assets/interface/6-dots-rotate_white.svg';

export default {
  setup() {
    const images = ref([]);
    const store = inscriptionsStore();
    const medias = ref([]);
    const materials = ref([]);
    const isLoading = ref(false);
    let msnry;
    let pageIndex = 1;
    let canIncrement = true;
    let infScroll;
    let lastFetchedPageIndex = 0;
    let isFetching = false;

    const transformedParams = computed(() => { //change the naming of the params to get the deeper level from the api
      const params = { ...store.surfaceParams };
      if (params.medium) {
        params.panel__medium = params.medium;
        delete params.medium;
      }
      if (params.material) {
        params.panel__material = params.material;
        delete params.material;
      }
      return new URLSearchParams(params).toString();
    });

    const fetchDataAndPopulateRef = async (url, refToPopulate) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        const textKey = i18n.global.locale === 'uk' ? 'text_ukr' : 'text';
        refToPopulate.value = data.results.map((item) => ({
          id: item.id,
          text: item[textKey] || item.text,
        }));
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    const updateFilter = (filterType, selectedId) => {
      if (filterType === 'media') {
        store.mediaModel = store.mediaModel === selectedId ? null : selectedId;
      } else if (filterType === 'material') {
        store.materialModel = store.materialModel === selectedId ? null : selectedId;
      }
    };

    const reloadAndLayout = () => {
      return new Promise((resolve) => {
        msnry.reloadItems();
        isLoading.value = false;
        resolve();
      }).then(() => {
        msnry.layout();
      });
    };

    watch(
      () => store.surfaceParams,
      async () => {
        isLoading.value = true;
        pageIndex = 1;
        lastFetchedPageIndex = 0;
        images.value = [];

        await fetchData(1);
        pageIndex = 2;

        imagesLoaded('.gallery', () => {
          const newItems = document.querySelectorAll('.gallery__item.image-unloaded');
          newItems.forEach((item) => {
            item.classList.remove('image-unloaded');
          });

          reinitInfiniteScroll();
          reloadAndLayout();
        });
      }
    );

    watch(() => i18n.global.locale, () => {
      fetchDataAndPopulateRef('https://saintsophia.dh.gu.se/api/inscriptions/medium/', medias);
      fetchDataAndPopulateRef('https://saintsophia.dh.gu.se/api/inscriptions/material/', materials);
    });

    const fetchData = async (requestedPageIndex) => {
      if (requestedPageIndex > lastFetchedPageIndex && !isFetching) {
        try {
          isFetching = true;
          const offset = (requestedPageIndex - 1) * 25;
          const urlToFetch = `https://saintsophia.dh.gu.se/api/inscriptions/image/?type_of_image=1&depth=2&offset=${offset}&${transformedParams.value}`; //type_of_image=1 only fetches orthophotos
          const res = await fetch(urlToFetch);
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const newImages = data.results
              .map((item) => ({
                attached_orthophoto: item.iiif_file,
                name: item.panel.title,
              }))
              .filter((img) => img && img.attached_orthophoto);

            images.value = [...images.value, ...newImages];
            lastFetchedPageIndex = requestedPageIndex;
          } else {
            console.log('No more data available.');
            infScroll && infScroll.off('load');
          }
        } catch (error) {
          console.error('Error fetching additional images:', error);
        } finally {
          isFetching = false;
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

      infScroll = new InfiniteScroll(gallery, {
        path: () => {
          canIncrement = false;
          const offset = (pageIndex - 1) * 25;
          return `https://saintsophia.dh.gu.se/api/inscriptions/image/?type_of_image=1&depth=2&offset=${offset}&${transformedParams.value}`;
        },
        outlayer: msnry,
        status: '.page-load-status',
        history: false,
        scrollThreshold: 1200,
        elementScroll: true,
      });

      infScroll.on('request', () => {
        isLoading.value = true;
      });

      infScroll.on('load', async function () {
        if (pageIndex >= lastFetchedPageIndex) {
          try {
            await fetchData(pageIndex);
            pageIndex++;

            imagesLoaded('.gallery', () => {
              const newItems = document.querySelectorAll('.gallery__item.image-unloaded');
              newItems.forEach((item) => {
                item.classList.remove('image-unloaded');
              });

              reloadAndLayout();
            });
          } catch (e) {
            console.error('error in the load event of infinitescroll:', e);
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
        //hide the loader
        const loader = document.querySelector('.infinite-scroll-request');
        if (loader) {
          loader.style.display = 'none';
        }
      }
      if (msnry) {
        msnry.destroy();
      }
      initMasonry();
    };

    onMounted(() => {
      isLoading.value = true;
      fetchDataAndPopulateRef('https://saintsophia.dh.gu.se/api/inscriptions/medium/', medias);
      fetchDataAndPopulateRef('https://saintsophia.dh.gu.se/api/inscriptions/material/', materials);

      fetchData(1).then(() => {
        pageIndex = 2;
        imagesLoaded('.gallery', () => {
          const newItems = document.querySelectorAll('.gallery__item.image-unloaded');
          newItems.forEach((item) => {
            item.classList.remove('image-unloaded');
          });

          initMasonry();
          reloadAndLayout();
        });
      });
    });

    return {
      images,
      medias,
      materials,
      updateFilter,
      store,
      isLoading,
      loaderSvg,
    };
  },
};
</script>

<style scoped>
.gallery {
  float: left;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  max-width: 100%;
  margin: 0 auto;
  padding: 0px 0px 0px 0px;
  pointer-events: auto;
}

.gallery::-webkit-scrollbar {
  display: none;
}

.gallery-filters {
  margin-left: -20px;
}

.gallery__item,
.gallery__col-sizer {
  width: calc(16.6%);
  max-height: 550px;
  min-height: 150px;
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
    padding-top: 80px;
  }
}

.gallery__item.image-unloaded {
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

.item-info {
  pointer-events: none;
  position: absolute !important;
  height: calc(100%) !important;
  width: 100% !important;
  z-index: 1000 !important;
  bottom: 0px;
  transition: all 0.5s ease-in-out;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.0) 15px, rgba(0, 0, 0, 0) 20px) !important;
}

.item-info-meta {
  position: absolute;
  color: white;
  bottom: 0px;
  padding: 20px 25px;
  padding-bottom: 40px !important;
  display: none;
}

.gallery__item img {
  width: 100%;
  height: auto;
  display: block;
}

.gallery__item img:hover {
  display: block;
  transform: scale(1.0);
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0) 30%) !important;
}

.gallery__item .cut-off {
  height: 200px;
  pointer-events: none;
  width: 100%;
  position: absolute;
  bottom: 0px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 1.0) 5px, rgba(0, 0, 0, 0) 100%) !important;
}

.gallery__item:hover .item-info-meta {
  display: block;
}

.gallery-tag.active {
  background-color: rgba(100, 40, 40, 1.0) !important;
}

.infinite-scroll-request {
  filter: invert(1);
  background-color: transparent !important;
}

</style>
