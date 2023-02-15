<template>
  <MainLayout>
    <template #search>
      <Search />
    </template>

    <template #background>
      <MapComponent>
        <template #layers>
          <NpolarLayer
            capabilitiesUrl="https://geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Ortofoto_Svalbard_WMTS_25833/MapServer/WMTS/1.0.0/WMTSCapabilities.xml"
          />

          <DianaPlaceLayer path="rephotography/place" />
        </template>
      </MapComponent>
    </template>
  </MainLayout>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import config from "./project.json";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";

provide("config", config);
</script>
