import { ref } from "vue";
import { defineStore } from "pinia";
// store for filtering map
export const rwandaStore = defineStore("rwanda", () => {
    
    const sources = ref<Array<any>>(['']);
    const placeTypes = ref<Array<any>>(['']);
    const informants = ref<Array<any>>(['']);
    const periods = ref<Array<any>>(['']);
    const languages = ref<Array<any>>(['']);

    const showAdvancedLayer = ref(false)

    const sourcesLayer = ref(false)
    const periodsLayer = ref(false)
    const placeTypeLayer = ref(false)
    const informantsLayer = ref(false)
    const allLayer = ref(true)
    const languagesLayer = ref(false)

    const coordinate = ref()

    return {languages, sources, placeTypes, informants, periods, showAdvancedLayer, periodsLayer, placeTypeLayer, sourcesLayer, allLayer, informantsLayer, coordinate, languagesLayer}
})