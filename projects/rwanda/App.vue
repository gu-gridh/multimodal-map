<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import Footer from './Footer.vue';
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("rwanda");

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

.main-title {
  font-size: 80px;
  line-height: 0.8;
  font-weight: 600;
  color:rgb(180,100,100);
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  padding: 60px 450px 50px 60px;
  background: url("@/assets/gradient-rephotography.png");
  background-size: contain;
}

#app .detail-view {
  height: 100vh !important;
  pointer-events: auto !important;
  overflow-y: scroll !important;
  background-color: rgba(0, 0, 0, 0.85);
  width: 100%;
  color: white;
  transition: all 0.5s ease-in-out;
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
