<script setup lang="ts">
import MapViewPreview from './MapViewPreview.vue'
import { storeToRefs } from "pinia";
import { mapStore } from "@/stores/store";
import { watchEffect, watch, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PlaceView from './PlaceView.vue'

const props = defineProps({
    placeId: {
        type: String,
    }
});

const { selectedFeature } = storeToRefs(mapStore());
const featureId = ref()

const route = useRoute();
const router = useRouter();

//if slected feature
watchEffect(async () => {
  if (selectedFeature.value) {
    featureId.value = selectedFeature.value.getId();
    console.log('featureId', featureId.value)
    //change url
    router.push(`/place/${featureId.value}`)
  }
})
</script>

<template>
<router-view>
    <div v-if="selectedFeature" class="right-panel">
        <PlaceView :id="featureId"/>
    </div>
    <div v-if="route.params.placeId" class="right-panel">
        <PlaceView :id="props.placeId || ''" />
    </div>
    <div v-else class="right-panel-initial"></div>
</router-view>
</template>

<style>
.right-panel {
    height:100%;
}
.right-panel-inititial {
    height:calc(100vh - 80px);
    display: flex;
    color: white !important;
    background-color: #222;
}
</style>