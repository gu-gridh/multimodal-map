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
}

.main-title {
  font-family: 'Josefin Sans', sans-serif !important;
  font-size: 85px;
  line-height: 0.85;
  font-weight: 200;
  text-align: center;
  margin-left: -25px;
  color: rgb(180, 100, 100);
}

.sub-title {
  font-family: 'Josefin Sans', sans-serif !important;
  font-size: 75px;
  line-height: 0.8;
  font-weight: 200;
  text-align: center;
  margin-left: -25px;
  color: rgb(180, 100, 100);
  margin-top: 10px;
  margin-bottom: 15px;
}

.about{
  padding-right:25px;
  line-height:1.3;
  text-align:justify;
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  padding: 60px 500px 50px 60px;
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
}



#app .right-pane {
  position: absolute;
  height: 100vh;
  width: auto;
  pointer-events: none;
  z-index: 100;
  transition: all 0.5s ease-in-out;
 
 
}

#app .detail-view {
  color: white;
  transition: all 0.5s ease-in-out;
  padding-top: 67px;
  width: 320px;
  pointer-events: none;
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
