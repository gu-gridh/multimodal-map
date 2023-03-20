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
