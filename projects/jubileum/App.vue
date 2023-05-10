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
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
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
  padding-right: 25px;
  line-height: 1.2;
  text-align: justify;
  font-size:0.95em;
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  padding: 60px 500px 50px 60px;
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
  z-index:500;
}

#app .right-pane {
  position: absolute;
  height: 100vh;
  width: 340px;
  pointer-events: none;
  z-index: 100;
  transition: all 0.5s ease-in-out;
}

#app .detail-view {
  color: white;
  transition: all 0.5s ease-in-out;
  padding-top: 20px;
  padding-bottom: 0px;
  width: auto;
  pointer-events: none;
}




</style>
