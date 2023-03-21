<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import PlaceDetails from "./PlaceDetails.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";
import { clean } from "@/assets/utils";
import markerIcon from '@/assets/marker-gold.svg'

const { categories, years } = storeToRefs(rephotographyStore());

const placeParams = computed(() =>
  clean({
    type: categories.value.join(","),
    start_date: years.value[0],
    end_date: years.value[1],
  })
);
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

          <DianaPlaceLayer
            path="rephotography/geojson/place"
            :params="placeParams"
          >
            <ol-style>
              

              <ol-style-stroke color="red" :width="2"></ol-style-stroke>
            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
            <ol-style-icon :src="markerIcon" :scale="2.0"></ol-style-icon>
             
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

<style>

#app .ol-style-icon{
margin-top:-200px !important;
}
#app .ol-popup {
  font-size: 1.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center;
  position: absolute;
  background-color: white;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px;
  border-radius: 5px;
  border: 0px solid #cccccc;
  bottom: 25px;
  left: -50px;
  min-width: 100px;
  }

  #app .ol-style-circle {
  font-size: 1.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: center;
  position: absolute;
  background-color: white;
  box-shadow: 2 2px 8px rgba(0, 0, 0, 0.5);
  padding: 3px;
  border-radius: 5px;
  border: 0px solid #cccccc;
  bottom: 25px;
  left: -50px;
  min-width: 100px;
  }

  </style>
