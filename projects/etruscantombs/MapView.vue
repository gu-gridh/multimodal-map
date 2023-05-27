<script lang="ts" setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "@/components/MapComponent.vue";
import DianaPlaceLayer from "@/components/DianaPlaceLayer.vue";
import FeatureSelection from "@/components/FeatureSelection.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { rephotographyStore } from "./store";
import { clean } from "@/assets/utils";
import markerIcon from "@/assets/marker-gold.svg";
import About from "./About.vue";

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
                width: auto;
                text-align: center;
                margin-top: 0px;
                cursor: pointer;
              "
            >More info</div>
          </button>
      <MapViewControls />
    </template>

    <template #background>
      <MapComponent :min-zoom="10" :max-zoom="18" :restrictExtent="[11.9, 42.15, 12.2, 42.4]" >
        <template #layers>


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
      <MapViewPreview />
    </template>
  </MainLayout>
</template>

<style>
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
