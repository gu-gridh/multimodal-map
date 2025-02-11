<template>
    <div class="map-controls">
       <!--buttons for communes--> 
         <div class="btn-group">
             <button v-for="commune in communes" :key="commune" @click="setCommune(commune)">{{commune}}</button>
        </div>
        <div class="btn-group">
            Travel type
            <button v-for="mode in store.travelModes" :key="mode" @click="setMode(mode)">{{mode}}</button>
        </div>
        <div class="btn-group">
            Within travel time
            <span v-for="time in store.travelTimes" :key="time" @click="setTime(time)"><button>{{time}}</button> min</span>
        </div>
        <div class="btn-group">
            Days of the week
            <button>Weekdays</button>
            <button>Weekends</button>
            TODO
        </div>
        <div class="btn-group">
            Type of sports
            <button>Football</button> etc TODO
        </div>
        Ammount of accessible sports facilities in {{ store.commune }} within {{ store.travelTime }} minutes by {{ store.travelMode }}
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useSportsStore } from "./settings/store";

const store = useSportsStore();
const communes = ref(["Lilla Edet", "Uppsala"]);

const setCommune = (commune) => {
    store.updateCommune(commune);
}

const setMode = (mode) => {
    store.updateMode(mode);
}

const setTime = (time) => {
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
    padding-bottom: 10px;
}

button {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>