import { ref } from "vue";
import { defineStore } from "pinia";

// store for filtering map
export const useSportsStore = defineStore("sportsStore", () => {
    const commune = ref('Uppsala');
    const activity = ref('');
    const travelMode = ref('sustainable');
    const travelModes = ref([
        "car", 
        "bicycle", 
        "walk", 
        "transit", 
        "sustainable",
      ])
    const travelTime = ref(15);
    const travelTimes = ref([
        15,
        30,
        60,
    ])

    const updateCommune = (value) => {
        commune.value = value;
    }

    const updateMode = (value) => {
        travelMode.value = value;
    }

    const updateTravelTime = (value) => {
        travelTime.value = value;
    }
    
    return {
        commune, 
        activity, 
        travelMode, 
        travelTime, 
        travelTimes,
        travelModes, 
        updateCommune,
        updateMode,
        updateTravelTime,
    }
})