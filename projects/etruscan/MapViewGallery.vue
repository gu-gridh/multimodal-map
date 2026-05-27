<template>
  <div id="gallery-container">
    <div class="gallery">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.featureId" class="gallery__item">

        <router-link :to="`/${item.datasetShortName}_${item.name.replace(/\s+/g, '_')}`" @click="updatePlaceId(item)">
          <div class="gallery__item-inner" :style="getAspectStyle(item)">
            <div class="item-info">
              <div class="item-info-meta">
                <h1>{{ $t('tomb') }} {{ item.name }}</h1>
                <h1> {{ item.necropolis }}</h1>
              </div>
            </div>
            <img v-if="item.published && (item.first_photograph_id || item.default_image)"
              :src="item.default_image ? `${item.default_image}/full/450,/0/default.jpg` : `https://img.dh.gu.se/diana/static/${item.first_photograph_id}/full/450,/0/default.jpg`"
              :width="item.width" :height="item.height" loading="lazy" />
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
import { ref, watch, nextTick } from 'vue'
import Masonry from 'masonry-layout'
import InfiniteScroll from 'infinite-scroll'
import { etruscanStore } from './settings/store'
import apiConfig from './settings/apiConfig'

export default {
  setup() {
    const images = ref([])
    const seenIds = new Set()

    let msnry, infScroll
    let pageIndex = 1
    let lastFetched = 0
    let isFetching = false

    const store = etruscanStore()

    const getAspectStyle = (item) => {
      if (!item.width || !item.height) {
        return { aspectRatio: '4 / 3' }
      }

      return { aspectRatio: `${item.width} / ${item.height}` }
    }

    const fetchData = async (page) => {
      if (page <= lastFetched || isFetching) return
      isFetching = true
      try {
        const url = `${apiConfig.PLACE}?depth=1&page=${page}&${new URLSearchParams(store.imgParams)}`
        const res = await fetch(url)
        const { features = [] } = await res.json()

        const newImages = features
          .filter(f => !seenIds.has(f.id))
          .map(f => {
            seenIds.add(f.id)
            const image = f.properties.default_image || f.properties.first_photograph_id
            return {
              featureId: f.id,
              name: f.properties.name,
              necropolis: f.properties.necropolis.text,
              datasetShortName: f.properties.dataset.short_name,
              default_image: f.properties.default_image?.iiif_file ?? null,
              first_photograph_id: f.properties.first_photograph_id?.iiif_file ?? null,
              width: image?.width ?? null,
              height: image?.height ?? null,
              published: !!f.properties.published
            }
          })
          .filter(img => img.default_image || img.first_photograph_id)

        if (newImages.length) {
          images.value.push(...newImages)
          lastFetched = page
        } else {
          infScroll && infScroll.off('load')
        }
      } catch (err) {
        console.error(err)
      } finally {
        isFetching = false
      }
    }

    const initGrid = () => {
      const gallery = document.querySelector('.gallery')
      msnry = new Masonry(gallery, {
        itemSelector: '.gallery__item',
        columnWidth: '.gallery__col-sizer',
        gutter: '.gallery__gutter-sizer',
        percentPosition: true
      })

      infScroll = new InfiniteScroll(gallery, {
        path() {
          return `${apiConfig.PLACE}?depth=1&page=${pageIndex}&${new URLSearchParams(store.imgParams)}`
        },
        outlayer: msnry,
        status: '.page-load-status',
        history: false,
        scrollThreshold: 1200,
        elementScroll: true
      })

      infScroll.on('load', async () => {
        await fetchData(pageIndex)
        pageIndex += 1
        await nextTick()
        layoutMasonry()
      })
    }

    const reinitInfiniteScroll = () => {
      infScroll && infScroll.destroy()
      msnry && msnry.destroy()
      initGrid()
    }

    watch(() => store.imgParams, async () => {
      images.value.length = 0
      seenIds.clear()
      pageIndex = 1
      lastFetched = 0

      await fetchData(1)
      pageIndex = 2

      await nextTick()
      reinitInfiniteScroll()
    }, { immediate: true })

    const updatePlaceId = (item) => { store.placeId = item.featureId }

    const layoutMasonry = () => {
      msnry?.reloadItems()
      msnry?.layout()
    }

    return { images, updatePlaceId, getAspectStyle }
  }
}
</script>

<style scoped>
#gallery-container {
  position: absolute;
  width: 100%;
  height: calc(100% - 80px);
  padding-left: 31%;
  z-index: 100 !important;
  background-color: rgba(232, 228, 217, 0.5) !important;
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
  margin: 0 auto;
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
  width: calc(16.66% - 10px);
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

@media screen and (max-width: 1500px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(25% - 8px);
  }
}

@media screen and (max-width: 1200px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(33% - 8px);
  }
}

@media screen and (max-width: 900px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(33% - 8px);
  }
}

/* hide by default */
.gallery.are-images-unloaded .image-gallery__item {
  opacity: 0;
}

.gallery__item {
  background-color: rgba(232, 228, 217, 0.6);
  margin-bottom: 10px;
  float: left;
  overflow: hidden !important;
}

.gallery__item a {
  display: block;
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
