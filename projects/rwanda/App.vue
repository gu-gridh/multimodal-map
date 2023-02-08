<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>
  </MainLayout>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import config from "./project.json";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";

provide("config", config);
</script>
