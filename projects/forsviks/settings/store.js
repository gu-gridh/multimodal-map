import { ref } from "vue";
import { defineStore } from "pinia";

export const forsvikStore = defineStore("forsvik", () => {
    const meditaType = ref('');

    return {
        meditaType
    };
});