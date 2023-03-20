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

</style>
