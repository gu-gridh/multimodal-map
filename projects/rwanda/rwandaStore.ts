import { ref } from "vue";
import { defineStore } from "pinia";

export const rwandaStore = defineStore("rwanda", () => {
    const sources = ref<Array<any>>([]);
    const placeTypes = ref<Array<string>>([]);
    const informants = ref<Array<string>>([]);
    const periods = ref<Array<string>>([]);
    return {sources, placeTypes, informants, periods}
})