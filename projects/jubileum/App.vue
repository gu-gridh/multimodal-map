<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import Footer from "./Footer.vue";
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

/* Project theme in regards to colour and fonts */
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color: rgb(234, 228, 219) !important;
}

.map-container {
  height: calc(100vh - 80px) !important;
}

.main-title {
  font-family: "Josefin Sans", sans-serif !important;
  font-size: 85px;
  line-height: 0.85;
  font-weight: 100;
  letter-spacing: -0.2rem;
  text-align: center;
  margin-left: -25px;
  color: rgb(180, 100, 100);
  transition: all 0.2s ease-in-out;
}

.sub-title {
  font-family: "Josefin Sans", sans-serif !important;
  font-size: 75px;
  line-height: 0.8;
  font-weight: 100;
  letter-spacing: -0.2rem;
  text-align: center;
  margin-left: -25px;
  color: rgb(180, 100, 100);
  margin-top: 10px;
  margin-bottom: 15px;
}

.about {
  padding-right: 0px;
  line-height: 1.2;
  text-align: left;
  font-size:0.95em;
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
  z-index:500;
}

#app .right-pane {
  position: absolute;
  height: 100vh;
  width: 360px;
  pointer-events: none;
  z-index: 100;
  transition: all 0.5s ease-in-out;
}

#app .mapview-preview {
  color: white;
  transition: all 0.5s ease-in-out;
  padding-top: 20px;
  padding-bottom: 0px;
  width: auto;
  pointer-events: none;
}


@media screen and (max-width: 1250px) {

.ui-overlay {
margin-left:200px !important;

}
}


@media screen and (max-width: 900px) {

  #app .mapview-preview {
 padding-top:70px !important;
}

.ui-overlay {
margin-top: 25px !important;
margin-left:0px !important;
font-size:120% !important;
}

#app .masonry-grid {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%; /* Make the grid height responsive */
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
