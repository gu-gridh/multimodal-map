<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import Search from "./Search.vue";
import About from "./About.vue";
import MapComponent from "@/components/MapComponent.vue";
import NpolarLayer from "./NpolarLayer.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import PlaceDetails from "./PlaceDetails.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-gold.svg";
import visibleAbout from "./About.vue";

const { categories, years } = storeToRefs(rephotographyStore());

const placeParams = computed(() =>
  clean({
    type: categories.value.filter((x) => x !== "all").join(","),
    start_date: years.value[0],
    end_date: years.value[1],
  })
);




</script>



<template>
  <About />
  <MainLayout>
    <template #search>
      <button class="item"  @click="visibleAbout = true;">
            <div
              class="p-1 px-2 clickable category-button"
              style="
                width: 90px;
                text-align: center;
                margin-top: -10px;
                cursor: pointer;
              "
            >More info</div>
          </button>
      <Search />
    </template>

  
   

    <template #background>
      <MapComponent :min-zoom="9" :max-zoom="16" :restrictExtent="[0.0, 75.0, 30.0, 81.0]" >
        <template #layers>
          <NpolarLayer
            capabilitiesUrl="https://geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Ortofoto_Svalbard_WMTS_25833/MapServer/WMTS/1.0.0/WMTSCapabilities.xml"
          />

          <DianaPlaceLayer
            path="rephotography/geojson/place/"
            :params="placeParams"
          >
            <ol-style>
              <ol-style-icon
                :src="markerIcon"
                :scale="1.8"
                :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"
              ></ol-style-icon>
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

.fullopacity{
  opacity:1.0;
  pointer-events:auto;
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
  bottom: 35px;
  left: -50px;
  min-width: 100px;
}
</style>
