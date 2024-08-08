<template>
  <!-- Checks if all points are loaded and only then show the controls -->
  <div :class="{ 'non-interactive': !areMapPointsLoaded }">
    <div v-if="areMapPointsLoaded">

      <!-- This creates a 2-column section with for the controls -->
      <div class="control-organisation justify-left"
        style="pointer-events:auto; padding-bottom:10px; padding-top:10px;">
        <div class="tag-section">
          <div class="section-title">{{ $t('language') }}</div>
          <div title="Narrow the result to a certain language group" class="broad-controls">
            <CategoryButtonList v-model="language" :categories="LANGUAGE" :limit="1" styleType="dropdown" class="my-2"
              type="language" style="padding-right:30px;" />
          </div>
        </div>

        <div class="tag-section margin-20">
          <div class="section-title">{{ $t('typeofinscription') }}</div>
          <div class="broad-controls">
            <CategoryButton v-model="categories" :categories="{
              all: $t('categories.all'),
              plans: $t('text'),
              models: $t('figure'),
              composite: $t('composite')
            }" :limit="1" class="my-2" title="Pick an inscription type" @click="handleCategoryClick" />
          </div>
        </div>
      </div>
      <div class="section-title">{{ $t('searchtitle') }}</div>
      <div class="toggle-buttons" style="margin-top: 10px">
        <button style="float:left; border-radius:4px 0px 0px 0px" :class="{ active: searchType === 'surfaces' }"
          @click="setSearchType('surfaces')">{{ $t('panels') }}</button>
        <button style="border-radius:0px 4px 0px 0px" :class="{ active: searchType === 'inscriptionobjects' }"
          @click="setSearchType('inscriptionobjects')">{{ $t('inscriptions') }}</button>
      </div>
      <div class="search-section">
        <input ref="searchInput" type="text" v-model="searchQuery" @input="handleSearch" @focus="handleSearchBoxFocus"
          :placeholder="searchType === 'surfaces' ? $t('searchsurfacesplaceholder') : $t('searchinscriptionsplaceholder')"
          class="search-box" autofocus />
        <div class="search-results">
          <!-- Rendering for surfaces -->
          <template v-if="searchType === 'surfaces'">
            <div v-for="(surface, index) in objectToArray(searchResults)" :key="index" :class="['search-result-item']">
              {{ surface?.title }}
            </div>
          </template>
          <!-- Rendering for inscriptions -->
          <template v-else-if="searchType === 'inscriptionobjects'">
            <div v-for="feature in filteredInscription" :key="feature.properties ? feature.properties.Nr : 'no-place'"
              class="search-result-item">
              {{ feature.displayText }}
            </div>
          </template>
        </div>
      </div>

    </div>

    <!-- if the markers are not loaded show the loader -->
    <div v-else>
      <div alt="Loading..." class="loading-svg" />
    </div>
  </div>

  <!-- Data Section -->
  <div class="data-widget">
    <div class="data-widget-section">
      <div class="data-widget-item">
        <h3>{{ $t('panelsshown') }}:</h3>
        <p>{{ currentPanelCount }}</p>
      </div>
      <div class="data-widget-item">|</div>
      <div class="data-widget-item">
        <h3>{{ $t('panelshidden') }}:</h3>
        <p>{{ hiddenPanels }}</p>
      </div>
    </div>

    <div class="data-widget-divider"></div>


    <div class="data-widget-section">
      <div class="data-widget-item">
        <h3>{{ $t('texts') }}:</h3>
        <p>{{ totalPhotographs }}</p>
      </div>

      <div class="data-widget-item">
        <h3>{{ $t('figures') }}:</h3>
        <p>{{ totalPlans }}</p>
      </div>

      <div class="data-widget-item">
        <h3>{{ $t('composites') }}:</h3>
        <p>{{ totalThreed }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted, computed, defineProps, watch } from "vue";
import CategoryButtonList from "./CategoryButtonDropdown.vue";
import CategoryButton from "@/components/input/CategoryButtonList.vue";
import { storeToRefs } from "pinia";
import { inscriptionsStore } from "./store";
import { mapStore } from "@/stores/store";
import type { InscriptionsProject } from "./types";
import { SophiaClient } from "@/assets/saintsophia";
import { transform } from 'ol/proj';
import apiConfig from "./apiConfig"
import { nextTick } from 'vue';
import i18n from '../../src/translations/sophia';

const config = inject<InscriptionsProject>("config");
const sophiaClient = new SophiaClient("inscriptions"); // Initialize SophiaClient
const store = inscriptionsStore();
const { categories, tags, language, dataParams, areMapPointsLoaded } = storeToRefs(inscriptionsStore());
// Create a ref for last clicked category
const lastClickedCategory = ref('');

//initialize variables for data section
const totalPhotographs = ref(0);
const totalPlans = ref(0);
const totalThreed = ref(0);
const hiddenPanels = ref(0);
const currentPanelCount = ref(0);
const visibleAbout = ref(false);
const { selectedFeature } = storeToRefs(mapStore());
const searchType = ref('surfaces'); // Default to 'surfaces' 
const firstSearchBoxClick = ref(true);
const searchQuery = ref('');
const searchResults = ref([]);
const TAGS = ref<Record<string, string>>({});
const LANGUAGE = ref<Record<string, string>>({});
//const INSCRIPTIONTYPE = ref<Record<string, string>>({});
const currentTag = ref(null);
import _debounce from 'lodash/debounce';
const searchInput = ref(null);
//const currentNecropolis = ref(null);
//const currentInscriptionType = ref(null);

const baseURL = `${apiConfig.PANEL}?page_size=500`;

const setSearchType = (type: string) => {
  searchType.value = type;
  handleSearch();
};

const handleSearchBoxFocus = () => {
  if (firstSearchBoxClick.value && searchType.value === 'surfaces') {
    fetchSurfaces();
    firstSearchBoxClick.value = false; // Set to false after first fetch
  }
};

const filteredInscription = computed(() => {
  if (searchResults.value && Array.isArray(searchResults.value.results)) {
    return searchResults.value.results.map(result => {
      if (result && typeof result === 'object') {
        const formattedTitle = result.title ? ` (${result.title})` : '';
        return {
          ...result,
          displayText: `${result.panel}:${result.id}${formattedTitle}`
        };
      } else {
        return { displayText: 'No data available' };
      }
    });
  }
  return [];
});

const objectToArray = (obj) => {
  return obj ? Object.keys(obj).map(key => obj[key]) : [];
};

onMounted(async () => {
  await fetchDataAndPopulateRef("language", LANGUAGE);

  const response = await fetch(baseURL);
  const data = await response.json();
});

async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any) {
  try {
    const data = await sophiaClient.listAll<T>(type);
    data.forEach((result: any) => {
      if (result.published) {
        const textKey = i18n.global.locale === 'uk' ? 'text_ukr' : 'text';
        refToPopulate.value[result.id] = result[textKey];
      }
    });
  } catch (error) {
    console.error(`Error fetching data for type ${type}:`, error);
  }
}

const handleCategoryClick = (category: string) => {
  //mapping categories to their respective numbers
  const categoryMapping = {
    plans: 1,
    models: 2,
    composite: 3
  };

  if (lastClickedCategory.value === category) {
    categories.value = ["all"];

    // Clear the lastClickedCategory since it was unselected
    lastClickedCategory.value = '';

    // Reset selected category in the store
    store.setSelectedCategory(null);
  } else {
    categories.value = [category];

    lastClickedCategory.value = category;
    //store the corresponding category number in the store
    store.setSelectedCategory(categoryMapping[category]);
  }
};

//Fetch to return count of each type based on the tagParams
const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch data: ${response.status}`);
    return;
  }
  const data = await response.json();
  currentPanelCount.value = data.shown_panels;
  // totalPhotographs.value = data.photographs;
  // totalPlans.value = data.drawing;
  hiddenPanels.value = data.hidden_panels;
  // totalThreed.value = data.objects_3d;
};

//fetch inscriptions
const fetchInscriptions = _debounce(async (query) => {
  let apiUrl;
  if (searchType.value === 'inscriptionobjects') {
    apiUrl = `https://saintsophia.dh.gu.se/api/inscriptions/inscription-string/?str=${encodeURIComponent(query)}`
  }
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    searchResults.value = data ? data : [];
  } catch (error) {
    console.error('Error fetching search results:', error);
    searchResults.value = [];
  }
}, 500);

//fetch surfaces
async function fetchSurfaces() {
  const apiUrl = `https://saintsophia.dh.gu.se/api/inscriptions/panel-string/?str=${encodeURIComponent(searchQuery.value)}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    searchResults.value = data.results;
  } catch (error) {
    console.error('Error fetching:', error);
    searchResults.value = [];
  }
}

const handleSearch = () => {
  if (searchType.value === 'surfaces') {
    fetchSurfaces();
  } else if (searchType.value === 'inscriptionobjects') {
    fetchInscriptions(searchQuery.value);
  }
};

watch(
  () => dataParams.value,
  async (newTagParams, oldTagParams) => {
    const queryParams = new URLSearchParams(Object.fromEntries(Object.entries(newTagParams).map(([k, v]) => [k, String(v)])));
    const urlWithParams = `https://saintsophia.dh.gu.se/api/inscriptions/info/panels/?${queryParams.toString()}`;
    await fetchData(urlWithParams);
  },
  { immediate: true }
);

watch(() => i18n.global.locale, (newLocale) => {
  fetchDataAndPopulateRef('language', LANGUAGE);
});

</script>

<style>
#app .left-pane {
  background: url("images/gradient.png");
  background-size: contain;
  width: 54% !important;
  min-width: 990px;
  max-width: 1000px;
  font-size: 95%;
}

.loading-svg {
  width: 100%;
  height: 200px;
  background: url("/90-ring-with-bg.svg");
  background-size: 60px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  display: block;
  margin: auto;
  transition: all 0.4s;

}

.loading-svg:hover {
  height: 240px;
  transform: scale(1.5);
}

.justify {
  display: flex;
  flex-direction: row;
  justify-content: left;
}

#app .section-title {
  margin-top: 6px;
  margin-bottom: -3px;
  font-weight: 200;
  color: black;
}

#app .tag-section {
  margin-top: -5px;
  margin-bottom: 0px;
}

.dropdown {
  font-family: "Oswald", sans-serif;
  appearance: none !important;
  padding: 3px 10px 3px 10px;
}


.search-result-item {
  /* Remove styling from anchor links */
  display: block;
  color: inherit;
  text-decoration: none;
}

.search-result-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 1.0) !important;
}

.search-result-item:hover {
  background-color: rgba(240, 240, 240, 1.0) !important;
}

.toggle-buttons button {
  padding: 2px 12px;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  margin-bottom: 0px;
  color: rgb(80, 80, 80);
}

.toggle-buttons button.active {
  background-color: rgba(255, 255, 255, 0.6);
}

.search-section {
  position: relative;
  width: 100%;
}

.search-box {
  width: 98%;
  height: 50px;
  padding: 8px;
  margin-top: 0px;
  border: 0px solid #ccc;
  border-radius: 0px 4px 4px 4px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  /* focus:none; */
}

.search-box:focus {
  outline: none;
}

.search-results {
  width: 98%;
  background-color: rgba(255, 255, 255, 1.0);
  border: 0px solid #ccc;
  border-top: none;
  border-radius: 0px 0px 8px 8px;
  margin-top: -4px;
  z-index: 1000;
  max-height: 120px;
  overflow-y: auto;
  transition: all 0.4s;
}

/* #app .range-slider-container {
  display: flex;
  width: 100%;
  height: 90px;
  align-items: bottom;
  padding: 25px 0 0 0;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
} */

/* #app .range-slider-wrapper {
  padding-left: 5px;
  padding-right: 5px;
} */

#app .start-end-box {
  width: 15%;
  font-size: 20px;
  text-align: center;
  padding-top: 0rem;
  padding-bottom: 0.5rem;
}

#app .rounded {
  border-radius: 10px;
}

#app .broad-controls {
  width: 100%;

}

#app .control-organisation {
  width: 98%;
  float: left;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.justify-left {
  justify-content: left;
}

.justify-space {
  justify-content: space-between;
}

.margin-20 {
  margin-left: 20px;
}

.margin-5 {
  margin-left: 5px;
}

.data-widget {
  font-size: 110%;
  float: left;
  pointer-events: none;
  width: 98%;
  margin-top: 30px;
  padding: 15px 25px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  min-height: 50px;
  backdrop-filter: blur(5px);
}

.data-widget-section {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.data-widget-divider {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: -25px;
  width: calc(100% + 50px);
  border-style: dotted;
  border-color: var(--theme-3);
  border-width: 1px 0px 0px 0px;
  height: 1px;
}


.data-widget-item {}

.data-widget-item h3 {
  display: inline;
}

.data-widget-item p {
  display: inline;
  color: var(--theme-3);
  margin-left: 3px;
  font-weight: 500;
}

@media screen and (max-width: 900px) {
  #app .broad-controls {
    width: 100%;

  }

  .data-widget {
    width: 100%;
  }

  #app .control-organisation {
    width: 100%;
    float: none;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  .justify-space {
    justify-content: left;
  }

  #app .tag-section {
    font-size: 100%;
  }

  .margin-20 {
    margin-left: 0px;
  }

  .margin-5 {
    margin-left: 0px;
  }


}

.slide-leave-active {
  transition: all 0.4s;
  opacity: 1.0;
}

.slide-leave-to {
  opacity: 0.5;
}

.slideinactive {
  opacity: 0.4;
  pointer-events: none !important;
  transition: all 0.4s;
}

.slideactive {
  transition: all 0.4s;
  opacity: 1.0;
}

@media screen and (max-width: 600px) {

  .data-widget {
    font-size: 80%;
  }
}
</style>
