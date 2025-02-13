<template>
    <div class="map-controls">
       <!-- Buttons for communes -->
         <div class="btn-group">
             <button 
                 v-for="commune in communes" 
                 :key="commune" 
                 @click="setCommune(commune)" 
                 :class="{ active: store.commune === commune }"
             >
                 {{ commune }}
             </button>
        </div>

        <!-- Travel Type Buttons -->
        <div class="btn-group">
            Travel type
            <button 
                v-for="mode in store.travelModes" 
                :key="mode" 
                @click="setMode(mode)"
                :class="{ active: store.travelMode === mode }"
            >
                {{ mode }}
            </button>
        </div>

        <!-- Travel Time Buttons -->
        <div class="btn-group">
            Within travel time
            <span v-for="time in store.travelTimes" :key="time" @click="setTime(time)">
                <button :class="{ active: store.travelTime === time }">{{ time }}</button> min
            </span>
        </div>

        <div class="btn-group" v-if="store.travelMode === 'transit' || store.travelMode === 'sustainable'">
            Days of the week
            <select @change="setDay($event.target.value)">
                <option value="all">All</option>
                <option value="week_day">Weekdays</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
            </select>
            TODO
        </div>
        <div class="btn-group">
            Type of sports
            <button>Football</button> etc TODO
        </div>

        Amount of accessible sports facilities in {{ store.commune }} within {{ store.travelTime }} minutes by {{ store.travelMode }}
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useSportsStore } from "./settings/store";

const store = useSportsStore();
const communes = ref(["Lilla Edet", "Uppsala"]);

const setCommune = (commune) => {
    store.updateCommune(commune);
};

const setMode = (mode) => {
    if (mode === "car" || mode === "bike" || mode === "walk") {
        store.updateDayType("all");
    }
    store.updateMode(mode);
};

const setTime = (time) => {
    store.updateTravelTime(time);
};

const setDay = (day) => {
    console.log(day)
    store.updateDayType(day);
};
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
    transition: background-color 0.3s, color 0.3s;
}

/* ✅ Highlight Active Button */
button.active {
    background-color: #007bff; /* Blue */
    color: white;
    border-color: #0056b3;
}
</style>