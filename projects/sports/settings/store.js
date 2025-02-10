import { ref } from "vue";
import { defineStore } from "pinia";

// store for filtering map
export const store = defineStore("store", () => {
    const commune = ref('');
    const activity = ref('');
    const travelMode = ref('');
    const travelTime = ref('');
    
    return {commune, activity, travelMode, travelTime}
})