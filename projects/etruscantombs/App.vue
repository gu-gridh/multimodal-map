<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import Footer from './Footer.vue';
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("jubileum");

provide("config", config);
provide("diana", endpoint);
</script>

<template>
  <Footer />
  <router-view />
</template>

<style>
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color: rgb(232, 228, 217) !important;
}

.map-container {
  height: calc(100vh - 80px) !important;
}

.theme-color-text {
  color: rgb(180, 100, 100);
}

.theme-color-background {
  background-color: rgb(232, 228, 217);
}

.main-title {
  font-family: 'Teko', sans-serif;
  font-size: 100px;
  line-height: 0.7;
  font-weight: 300;
  letter-spacing: 0.05rem;
  color: rgb(180, 100, 100);
  margin-left: -10px;
}

.about {
  padding-right: 0px;
  line-height: 1.2;
  text-align: left;
  font-size: 0.95em;
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
  z-index: 100;
}

#app .left-pane-layer {
  padding: 60px 0px 130px 60px !important;
  pointer-events: auto !important;
  width: 410px !important;
}

.theme-button {
  background-color: rgb(180, 100, 100);
  border-radius: 5px;
  padding: 5px 10px;
  color: white;
}

@media screen and (max-width: 900px) {

  #app .masonry-grid {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    /* Make the grid height responsive */
    z-index: 200;
    background-color: rgb(234, 228, 219);
    padding: 0px 0px 230px 00px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-template-rows: masonry;
    grid-gap: 5px;
    overflow-y: scroll;
  }
}

</style>
