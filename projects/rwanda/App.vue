<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>
  </MainLayout>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import configRaw from "./project.json";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import type { Project } from "@/types/project";
import { formatNames } from "./names";
import type Feature from "ol/Feature";
import type { Place } from "@/types/map";

function getName(f: Feature): string {
  const place = f.getProperties() as Place;
  return formatNames(f.getId(), place.names);
}

const config: Project = { ...configRaw };
config.getFeatureDisplayName = getName;
provide("config", config);
</script>
