<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import Footer from './Footer.vue';
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("etruscantombs");

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

.theme-color-text {
  color: rgb(180, 100, 100);
}

.theme-color-background {
  background-color: rgb(180, 100, 100);
}

.main-title {
  font-family: 'Teko', sans-serif;
  color: rgb(180, 100, 100);
}

.about {
  display:none;
}


#app .left-pane {
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
}

.theme-button {
  background-color: rgb(180, 100, 100);
  border-radius: 5px;
  padding: 5px 10px;
  color: white;
}

@media screen and (max-width: 900px) {
  .atlas-gradient {
    background: linear-gradient(180deg, rgba(232, 228, 217, 0) 0px, rgba(232, 228, 217, 1) 300px) !important;
}

#app .right-pane {
/* z-index: 0 !important; */
}
}

</style>
