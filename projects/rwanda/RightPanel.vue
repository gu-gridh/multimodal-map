<script setup lang="ts">
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

//if selected feature
watchEffect(async () => {
  if (selectedFeature.value) {
    featureId.value = selectedFeature.value.getId();
    //change url
    router.push(`/place/${featureId.value}`)
  }
})

</script>

<template>
    <div v-if="route.params.placeId || selectedFeature" class="right-panel">
        <PlaceView :id="props.placeId || ''"/>
    </div>
    <div v-else class="right-panel-initial">
        <div class="container">
            <div class="image-container">
                <img src="./images/streetsigns.jpg" alt="streetsigns"/>
            </div>
            <div class="info-text">
                <p> Welcome to this map showing names of places of interest in Kiyovu, Kigali. The map is a free and collaborative OpenStreet map. You can search names of streets , buildings, and areas. You also find photos of signs and buildings, in addition to texts about names and places in Kigali. </p>
                <p>The map visualizes some of the data of the project <em>Reading the signs - Renaming and transformative processes in urban Rwanda.</em> The project is run by University of Gothenburg, Sweden, and University of Kigali, Rwanda, in collaboration with University of Rwanda, and financed by Vetenskapsrådet (VR). The map is under development in collaboration with Gothenburg Research Infrastructure in Digital Humanities (GRIDH) at the University of Gothenburg, Sweden.</p>
                <p>Murakaza neza! Iyi karita ikwereka amazina y’imihanda y’i Kigali mu Kiyovu. Ushobora gukoresha iyi kariya ushaka kumenya amazina y’imihanda, inyubako zamamaye, n’ahantu hazwi cyane mu kuyobora abantu mu mujyi wa Kigali. Kubigeraho ni ubuntu. Iyi karita ikwereka kandi amafoto, inyandiko z’amazina y’imihanda, inyubako, n’abantu hazwi cyane. Ibi byose byakusanyijwe mu bushakashatsi bwakorewe i Kigali. Uyu mushinga w’ubushakashatsi witwa <em>“Dusome ibyapa: Kwiza izina bijyana n’impinduka z’umurwa w’u Rwanda”.</em> </p>
                <p>Ubu bushakashatsi bwakozwe mu bufatanye buri hagati ya Kaminuza ya Gothnberg (Suwede) na Kaminuza zo mu Rwanda ari zo Kaminuza ya Kigali (UoK) na Kaminuza y’u Rwanda (UR). Bwatewe inkunga n’ikigo cy’ubushakashatsi giherereye muri Suwede cyitwa “Vetenskapsrådet (VR)”. Iyi karita iri gukorwa mu bufatanye bw’abashakashatsi n’ikigo cy’ikoranabuhanga cyo muri Kaminuza ya Gothenburg. </p>
            </div>
        </div>
        
    </div>
</template>

<style>
#app .right-panel {
    height:calc(100vh - 80px);
    background-color:transparent!important;
    overflow-y: auto;
}
.right-panel-initial {
    height:calc(100vh - 80px);
    display: flex;
    color: white !important;
    overflow-y: auto;
}
.container {
    width: 100%;
    height: auto;
    margin: 0;
    padding: 20px;
    
}

.info-text {
    padding-top: 20px;
    font-size: 17px;
}

em {
    color: #ca8888;
}

.image-container {
    text-align: center;
}
</style>