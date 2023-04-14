<template>
  <div class="map-container h-full">
    <div class="left-pane">
      <div class="left-pane-layer">
        <div class="left-pane-content">
          <slot name="title">
            <!--<div v-if="config" class="px-8 py-6 bg-white rounded-t-lg shadow-lg">-->
            <div v-if="config" class="py-1">
              <div class="main-title" v-html="config.title"></div>
              <div class="sub-title" v-html="config.subtitle"></div>
            </div>
          </slot>

          <slot name="about">
            <!--<div v-if="config" class="px-8 py-6 bg-white rounded-b-lg shadow-lg">-->
            <div class="py-5">
              <p class="" v-html="config.about"></p>
            </div>
            <div
              v-if="config.moreinfo"
              class="p-1 px-2 clickable category-button"
              style="
                width: 90px;
                text-align: center;
                margin-top: -10px;
                cursor: pointer;
              "
              v-html="config.moreinfo"
            ></div>
          </slot>

          <slot name="search"></slot>
        </div>
      </div>
    </div>

    <div class="right-pane">
      <slot name="details">
        <div class="col-start-6 col-span-2 detail">
          <div class="bg-black rounded-lg shadow-lg mb-4 mx-12 detail">
            <div class="px-8 py-6">
              <div>
                Here you'll find more information and media on the selected
                location.
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>

    <slot name="background">
      <MapComponent />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import MapComponent from "./components/MapComponent.vue";
import type { Project } from "./types/project";

const config = inject("config") as Project;
</script>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
  overflow: hidden !important;
}

#app {
  height: inherit;
  width: inherit;
  /* display: flex !important; */
}

.map-container {
  height: inherit;
  width: inherit;
}

.left-pane {
  position: absolute;
  height: 100vh;
  z-index: 100;
  pointer-events: none;
}

.right-pane {
  position: absolute;
  height: 100vh;
  width: 350px;
  right: 0px;
  pointer-events: none;
  z-index: 200;
  transition: all 0.5s ease-in-out;
  overflow: hidden !important;
}

.detail-view {
  width: 100%;
  transition: all 0.5s ease-in-out;
}

@media screen and (max-width: 1200px) {
  .right-pane {
    width: 250px;
    z-index: 100;
  }
  .detail-view {
    padding: 0px;
  }
}
</style>
