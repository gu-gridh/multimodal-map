<script setup>
import { provide } from "vue";
import config from "./config";
import Footer from './Footer.vue';
import { MaritimeEncountersClient } from "@/assets/maritimeencounters";

const endpoint = new MaritimeEncountersClient("resources");

provide("config", config);
provide("maritimeencounters", endpoint);
</script>

<template>
  <Footer />
  <router-view />
</template>

<style>
</style>
