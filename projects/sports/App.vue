<script setup>
import { provide } from "vue";
import config from "./config";
import Footer from './Footer.vue';

provide("config", config);
</script>

<template>
  <Footer />
  <router-view />
</template>

<style>
</style>