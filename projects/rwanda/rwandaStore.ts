import { ref } from "vue";
import { defineStore } from "pinia";
// store for filtering map
export const rwandaStore = defineStore("rwanda", () => {
    const sources = ref<Array<any>>([]);
    const placeTypes = ref<Array<string>>([]);
    const informants = ref<Array<string>>([]);
    const periods = ref<Array<string>>([]);
    const languages = ref<Array<string>>([]);

    const sourcesLayer = ref(false)
    const periodsLayer = ref(false)
    const placeTypeLayer = ref(false)
    const informantsLayer = ref(false)
    const allLayer = ref(true)
    const languagesLayer = ref(false)

    const coordinate = ref()

    return {languages, sources, placeTypes, informants, periods, /* allSources, allPlaceTypes, allInformants, allPeriods,  */periodsLayer, placeTypeLayer, sourcesLayer, allLayer, informantsLayer, coordinate, languagesLayer}
})