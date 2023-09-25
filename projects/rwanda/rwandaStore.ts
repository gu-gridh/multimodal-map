import { ref } from "vue";
import { defineStore } from "pinia";
// store for filtering map
export const rwandaStore = defineStore("rwanda", () => {
    const sources = ref<Array<any>>([]);
    const placeTypes = ref<Array<string>>([]);
    const informants = ref<Array<string>>([]);
    const periods = ref<Array<string>>([]);

    const allSources = ref(true)
    const allPlaceTypes = ref(true)
    const allInformants = ref(true)
    const allPeriods = ref(true)

    const sourcesLayer = ref(false)
    const periodsLayer = ref(false)
    const placeTypeLayer = ref(false)
    return {sources, placeTypes, informants, periods, allSources, allPlaceTypes, allInformants, allPeriods, periodsLayer, placeTypeLayer, sourcesLayer}
})