<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("rephotography");

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

.main-title{
  font-size:80px;
  line-height:0.9;
  font-weight:100;
}

#app .left-pane{
  background-color:grey;
  width:900px;
  padding:60px 450px 50px 60px;
  background:url("@/assets/gradientRephotography.png");
  background-size:contain;
}

#app .detail-view{
  height:100vh;
  background-color:rgba(255,255,255,0.9);
  width:100%;

  transition: all 0.5s ease-in-out;
  backdrop-filter: blur(7px);
}

</style>
