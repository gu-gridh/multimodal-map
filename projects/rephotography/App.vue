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
  width:700px;
  padding:60px 250px 50px 60px;
  background: linear-gradient(90deg, rgba(213,213,213,1) 0%, rgba(213,213,213,1) 30%, rgba(213,213,213,0.8) 50%,  rgba(213,213,213,0) 100%);
}

#app .detail-view{
  height:100vh;
  background-color:rgba(255,255,255,0.9);
  width:100%;

  transition: all 0.5s ease-in-out;
  backdrop-filter: blur(7px);
}

</style>
