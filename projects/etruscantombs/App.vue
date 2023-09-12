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
  background-color:rgb(232,228,217)!important;
}

.map-container {
  height: calc(100vh - 80px) !important;

}

.theme-color {
  color:rgb(180,100,100);
}

.main-title {
  font-family: 'Geo', sans-serif;
  font-size: 90px;
  line-height: 0.7;
  font-weight: 600;
  letter-spacing:-4.5px;
  color:rgb(180,100,100)
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
}

#app .right-pane {
  width: 450px;
}

#app .mapview-preview {
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.85);
  width: 100%;
  color: white;
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
  padding:0px!important;
  widtH:50px;
}

#app  .ol-zoom-out {
  left: calc(50% + 100px);
  top: calc(100vh - 140px);
  position: fixed;
  margin-top: 1px;
  border-radius: 0px 10px 10px 0px!important;
  height:35px;
  padding:0px!important;
  widtH:50px;
}

#app .ol-control button:active,
#app .ol-control button:hover,
#app .ol-control button:focus {
  background-color: rgba(0, 0, 0, 0.7)!important;
}
</style>
