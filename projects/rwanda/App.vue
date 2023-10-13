<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import Footer from './Footer.vue';
import { DianaClient } from "@/assets/diana";
import Grid from "./Grid.vue";

const endpoint = new DianaClient("rwanda");

provide("config", config);
provide("diana", endpoint);
</script>

<template>
     <Footer />
     <RouterView/>
</template>
<style>

/* Project theme in regards to colour and fonts */
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color:rgb(45,45,45)!important;
}

.main-title {
  font-size:5vw;
  line-height: 0.8;
  font-weight: 600;
  color:rgb(180,100,100);
}

.about {
  padding-right: 25px;
  line-height: 1.3;
  text-align: left;
  margin-top:15px;
}

#app .left-pane {
  font-size:1.2vw;
  background: url("@/assets/gradient-rephotography.png");
  background-size: contain;
}

#app .mapview-preview {
  height: 100vh !important;
  pointer-events: auto !important;
  overflow-y: scroll !important;
  background-color: rgba(0, 0, 0, 0.75);
  width: 100%;
  color: white;
  transition: all 0.5s ease-in-out;
  backdrop-filter: blur(7px);
}

.close-button {
  width: 40px;
  height: 40px;
  margin-left: 0px;
  margin-top: -5px;
  padding: 16px 15px 10px 9px;
  line-height: 1px;
  font-size: 50px;
  font-weight: 100;
  border-radius: 50%;
  background-color: rgb(180, 100, 100);
  color: white;
  transform: rotate(45deg);
  cursor: pointer;
  pointer-events: auto;
  margin-bottom: 30px;
}

#app .ol-zoom-in {
  left: calc(50% + 0px) !important;


}

#app .ol-zoom-out {
  left: calc(50% + 50px);


}

.close-button:hover {
  background-color: rgb(140, 100, 100);
}

@media screen and (max-width: 900px) {

#app .main-title {
  font-weight: 600 !important;
}
}

</style>
