<!-- Component for previewing content -->
<script setup>
import { watchEffect, ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

//when a place on map is clicked
const { selectedFeature } = storeToRefs(mapStore())

watchEffect(async () => {
  if (selectedFeature.value) {
    const place_of_interest = selectedFeature.value.getId();
  }
});

function deselectPlace() {
  selectedFeature.value = undefined;
}
const store = mapStore();
const {center, zoom} = storeToRefs(store);

</script>

<template>
    <div v-if="selectedFeature" class="mapview-preview">
 
        <div class="px-2 py-6">
        </div>
    </div>
</template>

<style>
    .mapview-preview-container{
    height:calc(100vh - 80px);
    }
</style>