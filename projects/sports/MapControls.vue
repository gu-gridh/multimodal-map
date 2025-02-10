<template>
    <div class="map-controls">
       <!--buttons for communes--> 
         <div class="btn-group">
             <button v-for="commune in communes" :key="commune" @click="setCommune(commune)">{{commune}}</button>
        </div>
        <div class="btn-group">
            <button v-for="mode in store.travelModes" :key="mode" @click="setMode(mode)">{{mode}}</button>
        </div>
        <div class="btn-group">
            <button v-for="time in store.travelTimes" :key="time" @click="setTime(time)">{{time}}</button>
        </div>

    </div>
</template>

<script setup>
import { ref } from "vue";
import { mapStore } from "@/stores/store";
import { useSportsStore } from "./settings/store";

const store = useSportsStore();
const communes = ref(["Lilla Edet", "Uppsala"]);

const setCommune = (commune) => {
    console.log("Setting commune to", commune);
    store.updateCommune(commune);
}

const setMode = (mode) => {
    console.log("Setting mode to", mode);
    store.updateMode(mode);
}

const setTime = (time) => {
    console.log("Setting time to", time);
    store.updateTravelTime(time);
}

</script>

<style scoped>
.map-controls {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
}  

.btn-group {
    display: flex;
    gap: 10px;
}


</style>