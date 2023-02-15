<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>

    <template #background>
      <MapComponent>
        <template #layers>
          <ol-tile-layer>
            <ol-source-xyz
              url="https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png"
            />
          </ol-tile-layer>
        </template>
      </MapComponent>
    </template>
  </MainLayout>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import { project as config } from "./project.json";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import MapComponent from "@/components/MapComponent.vue";

provide("config", config);
</script>
