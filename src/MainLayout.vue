<template>
  <div class="map-container h-full">
        <div class="left-pane">
        <slot name="title">
           <!--<div v-if="config" class="px-8 py-6 bg-white rounded-t-lg shadow-lg">-->
            <div v-if="config" class="py-1">
            <div
              class="main-title"
              v-html="config.name"
            ></div>
          </div>
        </slot>

        <slot name="about">
           <!--<div v-if="config" class="px-8 py-6 bg-white rounded-b-lg shadow-lg">-->
            <div v-if="config" class="py-6">
            <p class="" v-html="config.about"></p>
          </div>
        </slot>

        <slot name="search"></slot>
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

const config = inject<Project>("config");
</script>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
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

.left-pane{
  position:absolute;
  height:100vh;
  background-color:grey;
  background: linear-gradient(90deg, rgba(213,213,213,1) 0%, rgba(213,213,213,1) 30%, rgba(213,213,213,0.9) 50%, rgba(213,213,213,0) 99%);
  width:700px;
  z-index:100;
  padding:80px 250px 50px 60px;
  pointer-events: none;
}

.right-pane{
  position:absolute;
  height:100vh;
  right:0px;
  height:100vh;
  pointer-events: none;
  width:350px;
  z-index:100;
}

.detail-view{
  height:100vh;
  background-color:white;
  width:100%;
  padding:10px;
}
</style>
