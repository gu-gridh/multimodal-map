<template>
  <div id="gallery-container">
    <div v-show="isLoading" class="gallery-loader">
      <img :src="loaderSvg" alt="loading" />
    </div>

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

      <div v-for="item in images" :key="item.id" class="gallery__item">
        <a :href="`https://saintsophia.dh.gu.se/viewer/?q=${item.panelTitle}/${item.id}`">
          <div class="gallery__item-inner" :style="getAspectStyle(item)">
            <div class="item-info">
              <div class="item-info-meta">
                <h1>
                  {{ item.panelTitle }}:{{ item.id }}
                  <span v-if="item.subtitle">|</span>
                  <span v-if="item.subtitle">{{ item.subtitle }}</span>
                </h1>
              </div>
            </div>

            <img :src="`${item.inscription_iiif_url}/!300,/0/default.jpg`" :width="item.width" :height="item.height"
              loading="lazy" />
          </div>
        </a>
      </div>

      <div class="gallery-corner-blur"></div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, nextTick } from 'vue';
import Masonry from 'masonry-layout';
import InfiniteScroll from 'infinite-scroll';
import { inscriptionsStore } from './settings/store';
import i18n from '../../src/translations/sophia';
import loaderSvg from '../../src/assets/interface/6-dots-rotate.svg';

export default {
  setup() {
    const images = ref([]);
    const store = inscriptionsStore();
    const alignments = ref([]);
    const isLoading = ref(false);
    const conditions = ref([]);

    let msnry;
    let pageIndex = 1;
    let infScroll;
    let lastFetchedPageIndex = 0;
    let isFetching = false;

    const getAspectStyle = (item) => {
      if (!item.width || !item.height) {
        return { aspectRatio: '4 / 3' };
      }
      return {
        aspectRatio: `${item.width} / ${item.height}`,
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
      if (filterType === 'alignment') {
        store.alignmentModel =
          store.alignmentModel === selectedId ? null : selectedId;
      } else if (filterType === 'condition') {
        store.conditionModel =
          store.conditionModel === selectedId ? null : selectedId;
      }
    };

    const fetchData = async (requestedPageIndex) => {
      if (requestedPageIndex > lastFetchedPageIndex && !isFetching) {
        try {
          isFetching = true;
          const offset = (requestedPageIndex - 1) * 50;
          const baseUrl = `https://saintsophia.dh.gu.se/api/inscriptions/inscription/?depth=1&limit=50&offset=${offset}&${new URLSearchParams(
            store.imgParams
          ).toString()}`;

          const res = await fetch(baseUrl);
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const newImages = data.results
              .map((item) => ({
                inscription_iiif_url: item.inscription_iiif_url,
                panelTitle: item.panel ? item.panel.title : 'Unknown',
                subtitle: item.title,
                id: item.id,
                width: item.width,
                height: item.height,
              }))
              .filter((img) => img && img.inscription_iiif_url);

            images.value = [...images.value, ...newImages];
            lastFetchedPageIndex = requestedPageIndex;
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
          const offset = (pageIndex - 1) * 50;
          return `https://saintsophia.dh.gu.se/api/inscriptions/inscription/?depth=1&limit=50&offset=${offset}&${new URLSearchParams(
            store.imgParams
          ).toString()}`;
        },
        outlayer: msnry,
        history: false,
        scrollThreshold: 200,
        elementScroll: true,
      });

      infScroll.on('request', () => {
        isLoading.value = true;
      });

      infScroll.on('load', async () => {
        if (pageIndex >= lastFetchedPageIndex) {
          try {
            await fetchData(pageIndex);
            pageIndex++;
            await nextTick();
            reloadAndLayout();
          } catch (e) {
            console.error(e);
          }
        } else {
          isLoading.value = false;
        }
      });
    };

    const reinitInfiniteScroll = async () => {
      if (infScroll) {
        infScroll.destroy();
        infScroll = null;
      }
      if (msnry) {
        msnry.destroy();
        msnry = null;
      }
      await nextTick();
      initMasonry();
      reloadAndLayout();
    };

    watch(
      () => store.imgParams,
      async () => {
        isLoading.value = true;
        pageIndex = 1;
        lastFetchedPageIndex = 0;
        images.value = [];

        await fetchData(pageIndex);
        pageIndex = 2;
        await nextTick();
        await reinitInfiniteScroll();
      }
    );

    watch(
      () => i18n.global.locale,
      () => {
        fetchDataAndPopulateRef(
          'https://saintsophia.dh.gu.se/api/inscriptions/graffitialignment/',
          alignments
        );
        fetchDataAndPopulateRef(
          'https://saintsophia.dh.gu.se/api/inscriptions/graffiticondition/',
          conditions
        );
      }
    );

    onMounted(async () => {
      isLoading.value = true;
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/graffitialignment/',
        alignments
      );
      fetchDataAndPopulateRef(
        'https://saintsophia.dh.gu.se/api/inscriptions/graffiticondition/',
        conditions
      );

      await fetchData(1);
      pageIndex = 2;
      await nextTick();

      initMasonry();
      reloadAndLayout();
    });

    return {
      images,
      alignments,
      conditions,
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
#gallery-container {
  padding: 0px 10px 0px 0px;
  opacity: 1;
  background-color: var(--theme-1);
}

.gallery {
  float: left;
  width: 100%;
  max-height: 100%;
  min-height: 100%;
  overflow-y: auto;
  max-width: 100%;
  margin: 0 auto;
  padding: 100px 0 0 0 !important;
  pointer-events: auto;
}

.gallery::-webkit-scrollbar {
  display: none;
}

.gallery-filters {
  background: transparent !important;
  color: white !important;
}

.gallery-filters .tag-container .gallery-tag {
  background-color: rgba(100, 100, 100, 0.2);
  border-color: grey;
  border-width: 1px 0 0 0 !important;
  font-weight: 300;
  backdrop-filter: blur(5px);
}

.gallery-corner-blur {
  position: fixed;
  right: -200px;
  bottom: -350px;
  width: 100px;
  height: 0;
  box-shadow: 0 0 400px 800px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  z-index: 100;
  transform: rotate(75deg);
}

@media screen and (max-width: 900px) {
  .gallery-corner-blur {
    display: none;
  }

  #gallery-container {
    padding: 0px;
  }
}

.gallery__item,
.gallery__col-sizer {
  width: calc(13.8% - 1px);
}

.gallery__gutter-sizer {
  width: 10px;
}

.gallery__item a {
  display: block;
}

.gallery__item img {
  width: 100%;
  height: auto;
  display: block;
}

@media screen and (max-width: 2000px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(16.6% - 8px);
  }
}

@media screen and (max-width: 1800px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(20% - 9px);
  }
}

@media screen and (max-width: 1600px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(25% - 9px);
  }
}

@media screen and (max-width: 1400px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(33% - 5px);
  }
}

@media screen and (max-width: 1200px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50% - 0px);
  }
}

.gallery__item {
  background-color: rgba(0, 0, 0, 0.04);
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

@media screen and (max-width: 900px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(50% - 0);
  }

  .gallery {
    padding-top: 80px;
  }

  .gallery__gutter-sizer {
    width: 0;
  }

  .gallery__item {
    margin-bottom: 0;
  }
}

.item-info {
  pointer-events: none;
  position: absolute !important;
  height: 100% !important;
  width: 100% !important;
  z-index: 1000 !important;
  bottom: 0;
  transition: all 0.2s ease-in-out;
  background: linear-gradient(0deg,
      rgba(0, 0, 0, 0.2) 0px,
      rgba(0, 0, 0, 0) 30%) !important;
}

.item-info-meta {
  position: absolute;
  width: 100%;
  color: white;
  bottom: 0;
  padding: 10px 15px;
  font-weight: 200;
  display: block;
  border-width: 0;
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
  transform: scale(1.03);
  border-radius: 4px;
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg,
      rgba(0, 0, 0, 0.3) 0px,
      rgba(0, 0, 0, 0) 30%) !important;
}

.gallery__item:hover .item-info-meta {
  display: block;
}

.gallery-tag.active {
  background-color: rgba(100, 40, 40, 1) !important;
}
</style>