<template>
  <MainLayout />
</template>

<script lang="ts" setup>
import { provide } from "vue";
import { project as config } from "./project.json";
import MainLayout from "@/MainLayout.vue";

provide("config", config);
</script>
