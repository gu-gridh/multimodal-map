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

      <div v-for="item in images" :key="item.uuid" class="gallery__item">
        <a :href="`https://saintsophia.dh.gu.se/viewer/?q=${item.name}`">
          <div class="gallery__item-inner" :style="getAspectStyle(item)">
            <div class="item-info">
              <div class="item-info-meta">
                <h1>{{ $t('panel') }} {{ item.name }}</h1>
              </div>
            </div>

            <img :src="`${item.attached_orthophoto}/pct:0,0,100,70/250,/0/default.jpg`" :width="item.width"
              :height="item.height" loading="lazy" />
          </div>
        </a>
        <div class="cut-off"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed, nextTick } from 'vue';
import Masonry from 'masonry-layout';
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

    const getAspectStyle = (item) => {
      if (!item.width || !item.height) {
        return { aspectRatio: '4 / 3' };
      }

      //thumbnail is /pct:0,0,100,70/
      const effectiveHeight = item.height * 0.7;
      return {
        aspectRatio: `${item.width} / ${effectiveHeight}`,
      };
    };

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
        console.error(error);
      }
    };

    const updateFilter = (filterType, selectedId) => {
      if (filterType === 'media') {
        store.mediaModel =
          store.mediaModel === selectedId ? null : selectedId;
      } else if (filterType === 'material') {
        store.materialModel =
          store.materialModel === selectedId ? null : selectedId;
      }
    };

    const fetchData = async (requestedPageIndex) => {
      if (requestedPageIndex > lastFetchedPageIndex && !isFetching) {
        try {
          isFetching = true;
          const offset = (requestedPageIndex - 1) * 25;
          const urlToFetch = `https://saintsophia.dh.gu.se/api/inscriptions/image/?type_of_image=1&depth=2&offset=${offset}&${transformedParams.value}`;
          const res = await fetch(urlToFetch);
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const newImages = data.results
              .map((item) => ({
                uuid: item.uuid,
                attached_orthophoto: item.iiif_file,
                name: item.panel.title,
                width: item.width,
                height: item.height,
              }))
              .filter((img) => img && img.attached_orthophoto);

            images.value = [...images.value, ...newImages];
            lastFetchedPageIndex = requestedPageIndex;
          } else {
            //console.log('No more data available.');
            infScroll && infScroll.off('load');
          }
        } catch (error) {
          console.error(error);
        } finally {
          isFetching = false;
        }
      }
    };

    const reloadAndLayout = () => {
      if (msnry) {
        msnry.reloadItems();
        msnry.layout();
      }
      isLoading.value = false;
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
          const offset = (pageIndex - 1) * 25;
          return `https://saintsophia.dh.gu.se/api/inscriptions/image/?type_of_image=1&depth=2&offset=${offset}&${transformedParams.value}`;
        },
        outlayer: msnry,
        history: false,
        scrollThreshold: 1200,
        elementScroll: true,
      });

      infScroll.on('request', () => {
        isLoading.value = true;
      });

      infScroll.on('load', async () => {
        if (pageIndex >= lastFetchedPageIndex) {
          try {
            await fetchData(pageIndex);
            pageIndex += 1;
            await nextTick();
            reloadAndLayout();
          } catch (e) {
            console.error(e);
          }
        }
      });
    };

    const reinitInfiniteScroll = async () => {
      if (infScroll) {
        infScroll.destroy();
      }
      if (msnry) {
        msnry.destroy();
      }
      await nextTick();
      initMasonry();
      reloadAndLayout();
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
        await nextTick();
        await reinitInfiniteScroll();
      }
    );

    watch(
      () => i18n.global.locale,
      () => {
        fetchDataAndPopulateRef(
          'https://saintsophia.dh.gu.se/api/inscriptions/medium/',
          medias
        );
        fetchDataAndPopulateRef(
          'https://saintsophia.dh.gu.se/api/inscriptions/material/',
          materials
        );
      }
    );

    onMounted(async () => {
      isLoading.value = true;
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/medium/',
        medias
      );
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/material/',
        materials
      );

      await fetchData(1);
      pageIndex = 2;
      await nextTick();

      initMasonry();
      reloadAndLayout();
    });

    return {
      images,
      medias,
      materials,
      updateFilter,
      store,
      isLoading,
      loaderSvg,
      getAspectStyle,
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
  padding: 0 0 0 0;
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
  width: calc((100% - 5 * 10px) / 6);
}

.gallery__gutter-sizer {
  width: 10px;
}

@media (max-width: 1800px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc((100% - 4 * 10px) / 5);
  }
}

@media (max-width: 1500px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc((100% - 3 * 10px) / 4);
  }
}

@media (max-width: 1300px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc((100% - 2 * 10px) / 3);
  }
}

@media (max-width: 1100px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc((100% - 1 * 10px) / 2);
  }
}

@media (max-width: 900px) {
  .gallery__item,
  .gallery__col-sizer {
    width: calc((100% - 1 * 10px) / 2);
  }

  .gallery {
    padding-top: 80px;
  }
}

.gallery__item {
  background-color: rgba(255, 255, 255, 0);
  margin-bottom: 10px;
  float: left;
  overflow: hidden !important;
  -webkit-transition-property: none !important;
  -moz-transition-property: none !important;
  -o-transition-property: none !important;
  transition-property: none !important;
}

.gallery__item-inner {
  position: relative;
  width: 100%;
}

.gallery__item-inner img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  pointer-events: none;
  position: absolute !important;
  height: 100% !important;
  width: 100% !important;
  z-index: 1000 !important;
  bottom: 0;
  transition: all 0.5s ease-in-out;
  background: linear-gradient(0deg,
      rgba(0, 0, 0, 0) 15px,
      rgba(0, 0, 0, 0) 20px) !important;
}

.item-info-meta {
  position: absolute;
  color: white;
  bottom: 0;
  padding: 20px 25px 40px;
  display: none;
}

.gallery__item img {
  display: block;
  transition: all 0.1s ease-in-out;
}

.gallery__item img:hover {
  transform: scale(1.0);
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg,
      rgba(0, 0, 0, 0.7) 0px,
      rgba(0, 0, 0, 0) 30%) !important;
}

.gallery__item .cut-off {
  height: 200px;
  pointer-events: none;
  width: 100%;
  position: absolute;
  bottom: 0;
  background: linear-gradient(0deg,
      rgba(0, 0, 0, 1) 5px,
      rgba(0, 0, 0, 0) 100%) !important;
}

.gallery__item:hover .item-info-meta {
  display: block;
}

.gallery-tag.active {
  background-color: rgba(100, 40, 40, 1) !important;
}
</style>