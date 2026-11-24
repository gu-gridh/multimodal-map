<script setup>
  import { computed, onMounted, ref, watch } from "vue";
  import MapComponent from "@/components/MapComponent.vue";
  import ForsvikMarkerLayer from "./ForsvikMarkerLayer.vue";
  import MapViewTitle from "./MapViewTitle.vue";
  import config from "./settings/config";
  import FilterButtons from "./FilterButtons.vue";

  const selectedLayer = ref("plan");
  const layer = computed(() => config.layers[selectedLayer.value]);
  const markers = ref([]);
  const forsvikMap = ref(null);
  const selectedType = ref([]);


  onMounted(async () => {
    fetchMarkers();
  });

  const filter = (type) => {
    selectedType.value = type;
  };


  const fetchMarkers = async (types = []) => {
    const params = new URLSearchParams();
    types.forEach(type => {
      if (type === 'pointcloud'){
        //also add textured_model as media_type
        params.append("media_type", "textured_model");
      }
        params.append("media_type", type);
    });

    let url = `https://forsviksbruk.dh.gu.se/api/articles/?${params.toString()}`;

    const results = [];

    try {
      while (url) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        results.push(
          ...data.results
            .map(article => ({
              id: article.id,
              name: article.title,
              areaName: article.area_name,
              type: article.advanced_media?.type?.toLowerCase().replace(/[\s_-]/g, ""),
              mediaTitle: article.advanced_media?.title,
              mediaUrl: article.advanced_media?.url,
              previewUrl: article.advanced_media?.preview_url || article.advanced_media?.url,
              coordinates: [
                article.location?.lng,
                article.location?.lat
              ]
            }))
            .filter(article =>
              article.coordinates.every(value => value != null)
            )
        );
        url = data.next;
      }

      markers.value = results;

    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  watch(selectedType, (types) => {
    fetchMarkers(types);
  },
    { immediate: true }
  );
</script>

<template>
  <div class="map-page">
    <div class="shadow-layer"> </div>
    <div id="version">version 1.0</div>
    <MapComponent ref="forsvikMap" class="map-canvas" :shouldAutoMove="true" :max-zoom="22" :min-zoom="17.3"
      :rotation="-170" :showOsm="false" :restrictExtent="[14.4277, 58.573, 14.449, 58.59]">
      <template #layers>
        <ol-tile-layer v-if="layer.url" :key="selectedLayer">
          <ol-source-xyz :url="layer.url" :attributions="layer.attribution" />
        </ol-tile-layer>
        <ForsvikMarkerLayer :markers="markers" :types="config.markerTypes" :projection="config.projection"
          :cluster-distance="20" :map-instance="forsvikMap?.map?.map" />
        <ol-attribution-control :collapsible="false" />
      </template>
    </MapComponent>


    <div class="gradient-blur">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <aside class="left-pane">
      <div class="left-pane-layer">
        <div class="left-pane-content">
           
          <MapViewTitle />
       

          <div class="title-actions">
            <router-link class="category-button about-button" to="/about">Om siten</router-link>
            <router-link class="category-button about-button" to="/guide">Användarguide</router-link>
            <router-link class="category-button about-button" to="/guide">Språk</router-link>
          </div>

          <div class="short-about">
            <p>{{ config.about }}</p>
          </div>

          
            <div class="filter-section">
              <FilterButtons :types="config.markerTypes" :selected-type="selectedType" @update:selectedType="filter" />
            </div>
          

        </div>
      </div>
    </aside>
    <div class="mode-position">
      <div class="ui-mode ui-overlay ui-overlay-top">
        <button v-for="(item, key) in config.layers" :key="key" class="item"
          :class="{ selected: selectedLayer === key }" :aria-pressed="selectedLayer === key"
          @click="selectedLayer = key">{{ item.title }}</button>
      </div>
    </div>
    <router-link class="guide-button" to="/guide" title="User guide">?<span class="visually-hidden"> User
        guide</span></router-link>
  </div>

</template>

<style>
  .shadow-layer {
    width: calc(100vw + 40px);
    height: calc(100vh - 80px);
    margin-left: -20px;
    box-shadow: 0px -5px 20px rgba(0, 0, 0, 0.3) inset;
    z-index: 1000;
    position: fixed;
    pointer-events: none;
  }

  @media screen and (max-width: 900px) {
    .shadow-layer {
      display: none;
    }
  }

  .left-pane-layer {
    display: flex !important;
    flex-direction: column !important;
  }


  .left-pane-layer p {
    padding-left: 20px;
  }

  .left-pane-content {
     display: flex !important;
    flex-direction: column !important;

    align-items: left;
  }

  .filter-section {
    margin-top:20px;
    padding-left: 20px;
    width: auto;
    display:flex;
   flex-direction: row;

  }

  #version {
    position: absolute;
    text-align: right;
    font-size: 0.7em;
    right: 30px;
    top: 20px;
    z-index: 1000;
    opacity: 0.7;
    backdrop-filter: blur(2px);
    background-color: rgba(250, 250, 210, 0.5);
    border-radius: 4px;
    padding: 2px 6px;
  }

  .gradient-blur {
    position: fixed;
    z-index: 1;
    inset: auto 0 0 0;
    height: calc(100% - 80px);
    pointer-events: none;
    width: 650px;
    top: 0px;
    opacity: 1.0;
  }

  @media screen and (max-width: 900px) {
    .gradient-blur {
      display: none;
    }
  }

  .gradient-blur>div,
  .gradient-blur::before,
  .gradient-blur::after {
    position: absolute;
    inset: 0;
  }

  .gradient-blur::before {
    content: "";
    z-index: 1;
    backdrop-filter: blur(0.5px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 12.5%,
        rgba(0, 0, 0, 1) 25%,
        rgba(0, 0, 0, 0) 37.5%);
  }

  .gradient-blur>div:nth-of-type(1) {
    z-index: 2;
    backdrop-filter: blur(1px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 12.5%,
        rgba(0, 0, 0, 1) 25%,
        rgba(0, 0, 0, 1) 37.5%,
        rgba(0, 0, 0, 0) 50%);
  }

  .gradient-blur>div:nth-of-type(2) {
    z-index: 3;
    backdrop-filter: blur(2px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 25%,
        rgba(0, 0, 0, 1) 37.5%,
        rgba(0, 0, 0, 1) 50%,
        rgba(0, 0, 0, 0) 62.5%);
  }

  .gradient-blur>div:nth-of-type(3) {
    z-index: 4;
    backdrop-filter: blur(4px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 37.5%,
        rgba(0, 0, 0, 1) 50%,
        rgba(0, 0, 0, 1) 62.5%,
        rgba(0, 0, 0, 0) 75%);
  }

  .gradient-blur>div:nth-of-type(4) {
    z-index: 5;
    backdrop-filter: blur(8px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 1) 62.5%,
        rgba(0, 0, 0, 1) 75%,
        rgba(0, 0, 0, 0) 87.5%);
  }

  .gradient-blur>div:nth-of-type(5) {
    z-index: 6;
    backdrop-filter: blur(16px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 62.5%,
        rgba(0, 0, 0, 1) 75%,
        rgba(0, 0, 0, 1) 87.5%,
        rgba(0, 0, 0, 0) 100%);
  }

  .gradient-blur>div:nth-of-type(6) {
    z-index: 7;
    backdrop-filter: blur(32px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 75%,
        rgba(0, 0, 0, 1) 87.5%,
        rgba(0, 0, 0, 1) 100%);
  }

  .gradient-blur::after {
    content: "";
    z-index: 8;
    backdrop-filter: blur(64px);
    mask: linear-gradient(to left,
        rgba(0, 0, 0, 0) 87.5%,
        rgba(0, 0, 0, 1) 100%);
  }

  .ol-rotate-reset {
    display: none !important;
  }

  .ui-overlay-top {
    padding: 6px 0px !important;
  }

  .filter-buttons-container {
    position: absolute;
    top: 80px;
    right: 30px;
    z-index: 1001;
  }
</style>