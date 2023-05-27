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

#app .mapview-preview {
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
  background-color: rgb(180, 100, 100);
}
</style>
