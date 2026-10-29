<script setup>
import { computed, ref } from "vue";
import MapComponent from "@/components/MapComponent.vue";
import IdentityCircle from "./IdentityCircle.vue";
import config from "./settings/config";

const selectedLayer = ref("plan");
const layer = computed(() => config.layers[selectedLayer.value]);
</script>

<template>
  <div class="map-page">
    <MapComponent class="map-canvas" :max-zoom="22">
      <template #layers>
        <ol-tile-layer v-if="layer.url" :key="selectedLayer">
          <ol-source-xyz :url="layer.url" :attributions="layer.attribution" />
        </ol-tile-layer>
        <ol-attribution-control :collapsible="false" />
      </template>
    </MapComponent>
    <aside class="left-pane">
      <div class="left-pane-layer">
        <div class="left-pane-content">
          <IdentityCircle />
          <div class="title-actions">
            <router-link class="category-button about-button" to="/about">About</router-link>
            <router-link class="category-button about-button" to="/guide">User guide</router-link>
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
    <router-link class="guide-button" to="/guide" title="User guide">?<span class="visually-hidden"> User guide</span></router-link>
  </div>
</template>
