<script lang="ts" setup>
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import PlaceDetails from "./PlaceDetails.vue";
</script>

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

          <DianaPlaceLayer path="rephotography/geojson/place">
            <ol-style>
              <ol-style-circle :radius="10">
                <ol-style-fill color="rgb(232 157 59)" />
                <ol-style-stroke :width="0" />
              </ol-style-circle>
            </ol-style>
            <FeatureSelection />
          </DianaPlaceLayer>
        </template>
      </MapComponent>
    </template>

    <template #details>
      <PlaceDetails />
    </template>
  </MainLayout>
</template>
