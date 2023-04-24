<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("jubileum");

provide("config", config);
provide("diana", endpoint);
</script>

<template>
  <router-view />
</template>

<style>
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
}

.main-title {
  font-family: "Cormorant Garamond", serif !important;
  font-size: 70px;
  line-height: 0.85;
  font-weight: 100;
  text-align: center;
  margin-left: -25px;
  color: rgb(180, 100, 100);
}

.sub-title {
  font-family: "Cormorant Garamond", serif !important;
  font-size: 85px;
  line-height: 0.8;
  font-weight: 100;
  text-align: center;
  margin-left: -25px;
  color: rgb(180, 100, 100);
  margin-top: -15px;
  margin-bottom: 15px;
}

#app .left-pane {
  width: 500px;
  background: linear-gradient(
    90deg,
    rgb(254, 255, 233) 30%,
    rgba(228, 225, 214) 100%
  );
  transform: rotate(0.03turn);
  margin-left: -130px;
  margin-top: -70px;
  height: 115vh;
  box-shadow: 0 4px 128px 0 rgba(0, 0, 0, 0.2),
    0 66px 100px 0 rgba(0, 0, 0, 0.19);
}

#app .left-pane-layer {
  width: inherit;
  height: inherit;
  padding: 120px 50px 50px 150px;
  background-image: url(@/assets/border-jubileum.png);
  background-repeat: repeat-y;
  background-size: 37px 700px;
  background-position: right 0px;
}

#app .left-pane-content {
  transform: rotate(-0.03turn);
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
  padding-top: 20px;
  width: 260px;
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
