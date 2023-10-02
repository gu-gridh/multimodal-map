<script setup lang="ts">
import MapViewPreview from './MapViewPreview.vue'
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";

const { selectedFeature } = storeToRefs(mapStore());
</script>

<template>
<div v-if="selectedFeature" class="right-panel">
    <MapViewPreview/>
</div>
<div v-else class="right-panel-initial">
</div>
</template>

<style>
.right-panel {
    height:calc(100vh - 80px);
}
.right-panel-inititial {
    height:calc(100vh - 80px);
    display: flex;
    color: white !important;
    background-color: #222;
}
</style>