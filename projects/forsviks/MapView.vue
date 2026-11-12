<script setup>
import { computed, onMounted, ref } from "vue";
import MapComponent from "@/components/MapComponent.vue";
import ForsvikMapMarkers from "./ForsvikMapMarkers.vue";
/* import IdentityCircle from "./IdentityCircle.vue"; */
import MapViewTitle from "./MapViewTitle.vue";
import config from "./settings/config";

const selectedLayer = ref("plan");
const layer = computed(() => config.layers[selectedLayer.value]);
const markers = ref([]);

onMounted(async () => {
  let url = "https://forsviksbruk.dh.gu.se/api/articles/";

  try {
    while (url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.status);

      const data = await response.json();
      markers.value.push(...data.results
        .map((article) => ({
          id: article.id,
          name: article.title,
          areaName: article.area_name,
          type: article.advanced_media?.type?.toLowerCase().replace(/[\s_-]/g, ""),
          mediaTitle: article.advanced_media?.title,
          mediaUrl: article.advanced_media?.url,
          previewUrl: article.advanced_media?.preview_url || article.advanced_media?.url,
          coordinates: [article.location?.lng, article.location?.lat],
        }))
        .filter((article) => article.coordinates[0] != null && article.coordinates[1] != null));
      url = data.next;
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>

  <div class="map-page">
    <div id="version">version 1.0</div>
    <MapComponent class="map-canvas" :shouldAutoMove="true" :max-zoom="22" :min-zoom="17.3" :rotation="-190"
      :showOsm="false" :restrictExtent="[14.4277, 58.573, 14.449, 58.59]">
      <template #layers>
        <ol-tile-layer v-if="layer.url" :key="selectedLayer">
          <ol-source-xyz :url="layer.url" :attributions="layer.attribution" />
        </ol-tile-layer>
        <ForsvikMapMarkers :markers="markers" :types="config.markerTypes" :projection="config.projection" />
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
          <!--   <IdentityCircle /> -->
          <MapViewTitle />
          <div class="title-actions">
            <router-link class="category-button about-button" to="/about">Om siten</router-link>
            <router-link class="category-button about-button" to="/guide">Användarguide</router-link>
            <router-link class="category-button about-button" to="/guide">Språk</router-link>
          </div>
          <p>{{ config.about }}</p>
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
.left-pane-layer p {
  padding-left: 20px;
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
</style>
