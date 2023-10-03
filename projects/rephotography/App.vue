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
  line-height: 0.9;
  font-weight: 100;
  margin-bottom:15px;
}


@media screen and (max-width: 1500px) {


.main-title {
  font-size: 80px !important;
  width: 75%;
}
}

.about {
  display:none;
}


#app .left-pane {
  background: url("@/assets/gradient-rephotography.png");
  background-size: contain;
}

.left-pane-layer {
  padding: 0px 450px 0px 0px !important;
}

.left-pane-content {
  overflow:visible!important;
}


.theme-button {

  border-radius: 5px;
  padding: 5px 10px;
  color: white;
}


#app .mapview-preview {
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.85);
  width: 75%;
  margin-left:25%;
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





</style>
