<script lang="ts" setup>
import { provide } from "vue";
import config from "./project.json";

provide("config", config);
</script>

<template>
  <router-view />
</template>
