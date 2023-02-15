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

          <ol-vector-layer z-index="1">
            <ol-source-vector
              url="https://diana.dh.gu.se/api/rephotography/place/"
              :format="geoJsonFormat"
              ref="source"
            />
            <ol-style>
              <ol-style-circle :radius="10">
                <ol-style-fill color="rgb(232 157 59)"></ol-style-fill>
              </ol-style-circle>
            </ol-style>
          </ol-vector-layer>
        </template>
      </MapComponent>
    </template>
  </MainLayout>
</template>

<script lang="ts" setup>
import { provide, inject } from "vue";
import { project as config } from "./project.json";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";

provide("config", config);

const format = inject("ol-format");
const geoJsonFormat = new format.GeoJSON();
</script>
