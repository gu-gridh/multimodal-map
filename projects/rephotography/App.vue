<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import Footer from "./Footer.vue";
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("rephotography");

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
}

.theme-color {
  color: orange;
}

.main-title {
  font-size: 80px;
  line-height: 0.9;
  font-weight: 100;
  margin-bottom:15px;
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  background: url("@/assets/gradient-rephotography.png");
  background-size: contain;
  z-index:102;
}

#app .left-pane-layer {
  padding: 60px 50px 130px 60px!important;
  pointer-events: auto!important;
  width:490px!important;
}

#app .mapview-preview {
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.85);
  width: 100%;
  color: white;
  backdrop-filter: blur(7px);
}

.close-button {
  width: 40px;
  height: 40px;
  margin-left: -10px;
  margin-top: -5px;
  padding: 16px 15px 10px 9px;
  line-height: 1px;
  font-size: 50px;
  font-weight: 100;
  border-radius: 50%;
  background-color: rgb(100, 100, 100);
  color: white;
  transform: rotate(45deg);
  cursor: pointer;
  pointer-events: auto;
  margin-bottom: 30px;
}

.close-button:hover {
  background-color: rgb(140, 140, 140);
}

#app .ol-zoom-in {
  left: calc(50% + 50px) !important;
  top: calc(100vh - 140px)!important;
  position: fixed;
  border-radius: 10px 0px 0px 10px!important;
  height:35px;
  padding-bottom:3px!important;
  width:50px;
}

#app  .ol-zoom-out {
  left: calc(50% + 100px);
  top: calc(100vh - 140px);
  position: fixed;
  margin-top: 1px;
  border-radius: 0px 10px 10px 0px!important;
  height:35px;
  padding-bottom:3px!important;
  widtH:50px;
}

#app .ol-control button:active,
#app .ol-control button:hover,
#app .ol-control button:focus {
  background-color: rgba(0, 0, 0, 0.7)!important;
}


@media screen and (max-width: 900px) {

.ui-overlay {
margin-top: 25px !important;
margin-left:0px !important;
font-size:120% !important;
}

#app .ol-zoom-in {
left: calc(50% - 50px) !important;
top: calc(100vh - 320px)!important;
}

#app  .ol-zoom-out {
left: calc(50% + 0px);
top: calc(100vh - 320px);
}
}


</style>
