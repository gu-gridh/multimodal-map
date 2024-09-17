<script lang="ts" setup>
import { provide } from "vue";
import config from "./settings/config";
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
</style>
