<script lang="ts" setup>
import { provide } from "vue";
import config from "./settings/config";
import Footer from './Footer.vue';
import { SophiaClient } from "@/assets/saintsophia";

const endpoint = new SophiaClient("inscriptions");

provide("config", config);
provide("sophia", endpoint);
</script>

<template>
  <Footer />
  <router-view />
</template>

<style>
</style>
