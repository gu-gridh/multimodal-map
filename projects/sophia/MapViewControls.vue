<template>
  <!-- Checks if all points are loaded and only then show the controls -->
  <div class="filtercontrolwidgets">

    <div :class="{ 'non-interactive': !areMapPointsLoaded }">
      <div v-if="areMapPointsLoaded">

        <div class="filtercontrolwidgets">
          <!-- This organises the three top dropdown columns -->
          <div class="control-organisation">
            <div class="column-1" style="width:auto;">
              <div class="tag-section">
                <div class="section-title">{{ $t('typeofinscription') }}</div>
                <div class="broad-controls">
                  <CategoryButton v-model="categories" :categories="{
                    textualgraffiti: $t('textualgraffiti'),
                    pictorialgraffiti: $t('pictorialgraffiti'),
                    composite: $t('composite')}" :limit="1" class="my-2" title="Pick an inscription type"
                    @click="handleCategoryClick" style="padding-right:0px;" />
                </div>
              </div>
              <div class="row-1" style="display:flex; flex-direction: row;">
                <div class="tag-section" style="margin-right:10px;">
                  <div class="section-title">{{ $t('textualgenre') }}</div>
                  <div title="Narrow the result to a certain language group" class="broad-controls">
                    <Dropdown v-model="textualModel" :categories="TEXTUAL" :limit="1" styleType="dropdown" class="my-2"
                      type="language" @change="resetAllExcept('textualModel')" style="padding-right:30px;" />
                  </div>
                </div>

                <div class="tag-section">
                  <div class="section-title">{{ $t('pictorialdescription') }}</div>
                  <div title="Narrow the result to a certain language group" class="broad-controls">
                    <Dropdown v-model="pictorialModel" :categories="PICTORIAL" :limit="1" styleType="dropdown" class="my-2"
                    @change="resetAllExcept('pictorialModel')" style="padding-right:30px;" />
                  </div>
                </div>
              </div>
            </div>

            <div class="column-2 vertical-divider"
              style="width:1px; height:110px; margin-top:7px; border-width:0 1px 0 0; border-style:dotted; border-color:var(--theme-3);">
            </div>

            <div class="column-3">
              <div class="control-group">
                <div class="tag-section">
                  <div class="section-title">{{ $t('writingsystem') }}</div>
                  <div title="Narrow the result to a certain language group" class="broad-controls">
                    <Dropdown v-model="writingModel" :categories="WRITING" :limit="1" styleType="dropdown" class="my-2"
                    @change="resetAllExcept('writingModel')" style="padding-right:30px;" />
                  </div>
                </div>
                <div class="tag-section">
                  <div class="section-title">{{ $t('language') }}</div>
                  <div title="Narrow the result to a certain language group" class="broad-controls">
                    <Dropdown v-model="languageModel" :categories="LANGUAGE" :limit="1" styleType="dropdown" class="my-2"
                      type="language" @change="resetAllExcept('languageModel')" style="padding-right:30px;" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="section-title">{{ $t('searchtitle') }}</div> -->
          <div class="search-section">
            <div class="toggle-buttons" style="margin-top: 10px">
              <button style="" :class="{ active: searchType === 'inscriptionobjects' }"
                @click="setSearchType('inscriptionobjects')">{{ $t('inscriptions') }}</button>
              <button style="" :class="{ active: searchType === 'surfaces' }" @click="setSearchType('surfaces')">{{
                $t('panels') }}</button>
            </div>
            <input ref="searchInput" type="text" v-model="searchQuery" @input="handleSearch"
              @focus="handleSearchBoxFocus"
              :placeholder="searchType === 'surfaces' ? $t('searchsurfacesplaceholder') : $t('searchinscriptionsplaceholder')"
              class="search-box" />
            <div class="search-results">
              <!-- Rendering for surfaces -->
              <template v-if="searchType === 'surfaces'">
                <div v-for="(surface, index) in objectToArray(searchResults)" :key="index"
                  :class="['search-result-item']">
                  {{ surface?.title }}
                </div>
              </template>
              <!-- Rendering for inscriptions -->
              <template v-else-if="searchType === 'inscriptionobjects'">
                <div v-for="feature in filteredInscription"
                  :key="feature.properties ? feature.properties.Nr : 'no-place'" class="search-result-item">
                  {{ feature.displayText }}
                </div>
              </template>
            </div>
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
          <h3>{{ $t('annotationsshown') }}:</h3>
          <p>{{ currentPanelCount }}</p>
        </div>
        <div class="data-widget-item">|</div>
        <div class="data-widget-item">
          <h3>{{ $t('annotationshidden') }}:</h3>
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

    <div style="display:flex; flex-direction: row; justify-content:center; width:100%;">
      <div id="resetfilters" class="broad-controls theme-button category-button"
        style="display:none; margin-top:15px; width:auto; cursor:pointer;  transition: all 0.2s ease-in-out; background-color:var(--theme-4); color:white;"
        @click="clearAll()">{{ $t('reset') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref, onMounted, computed, watch } from "vue";
  import Dropdown from "./components/DropdownComponent.vue";
  import CategoryButton from "@/components/input/CategoryButtonList.vue";
  import { storeToRefs } from "pinia";
  import { inscriptionsStore } from "./settings/store";
  // import { mapStore } from "@/stores/store";
  import type { InscriptionsProject } from "./types";
  import { SophiaClient } from "@/assets/saintsophia";
  import apiConfig from "./settings/apiConfig"
  import i18n from '../../src/translations/sophia';

  const config = inject < InscriptionsProject > ("config");
  const sophiaClient = new SophiaClient("inscriptions"); // Initialize SophiaClient
  const store = inscriptionsStore();
  const { categories, tags, languageModel, pictorialModel, textualModel, dataParams, areMapPointsLoaded, writingModel } = storeToRefs(inscriptionsStore());
  // Create a ref for last clicked category
  const lastClickedCategory = ref('');

  //initialize variables for data section
  const totalPhotographs = ref(0);
  const totalPlans = ref(0);
  const totalThreed = ref(0);
  const hiddenPanels = ref(0);
  const currentPanelCount = ref(0);
  // const visibleAbout = ref(false);
  // const { selectedFeature } = storeToRefs(mapStore());
  const searchType = ref('inscriptionobjects'); // Default to 'surfaces' 
  const firstSearchBoxClick = ref(true);
  const searchQuery = ref('');
  const searchResults = ref([]);
  // const TAGS = ref < Record < string, string>> ({});
  const LANGUAGE = ref < Record < string, string>> ({});
  const WRITING = ref < Record < string, string>> ({});
  const PICTORIAL = ref < Record < string, string>> ({});
  const TEXTUAL = ref < Record < string, string>> ({});
  //const INSCRIPTIONTYPE = ref<Record<string, string>>({});
  // const currentTag = ref(null);
  import _debounce from 'lodash/debounce';
  const searchInput = ref(null);

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

  function resetAllExcept(exceptModel) { //reset the other dropdowns to all when a selection is made
    if (exceptModel !== "languageModel") languageModel.value = ["all"];
    if (exceptModel !== "pictorialModel") pictorialModel.value = ["all"];
    if (exceptModel !== "textualModel") textualModel.value = ["all"];
    if (exceptModel !== "writingModel") writingModel.value = ["all"];
  }

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
    await fetchDataAndPopulateRef("writingsystem", WRITING);
    await fetchDataAndPopulateRef("tag", PICTORIAL);
    await fetchDataAndPopulateRef("genre", TEXTUAL);

    // const response = await fetch(baseURL);
    // const data = await response.json();
  });

  async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any) {
    try {
      const data = await sophiaClient.listAll < T > (type);
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
    showReset();
    //mapping categories to their respective numbers
    const categoryMapping = {
      textualgraffiti: 1,
      pictorialgraffiti: 2,
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
    showReset();
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
    fetchDataAndPopulateRef("language", LANGUAGE);
    fetchDataAndPopulateRef("writingsystem", WRITING);
    fetchDataAndPopulateRef("tag", PICTORIAL);
    fetchDataAndPopulateRef("genre", TEXTUAL);
  });


  function clearAll() {
    const resetbutton = document.getElementById('resetfilters');
    resetbutton.style.display = "none";
    categories.value = ["all"];
    language.value = ["all"];
    lastClickedCategory.value = '';
    tags.value = [];
  }

  function showReset() {
    const resetbutton = document.getElementById('resetfilters');
    resetbutton.style.display = "block";
  }
</script>

<style>
  #app .left-pane {
    background: url("images/gradient.png");
    background-size: contain;
    min-width: 960px;
    max-width: 960px;
    font-size: 95%;
  }

  .filtercontrolwidgets {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
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

  .control-group {
    width: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-right: 0px;
  }

  #app .section-title {
    margin-top: 6px;
    margin-bottom: -5px;
    font-weight: 300;
    color: black;
    font-size: 0.95em;
    width:100px;
  }

  #app .tag-section {
    margin-top: -5px;
    margin-bottom: 0px;
    margin-right: 0px;
    width:auto;

  }

  #app .tag-section .broad-controls {
    font-size: 0.9em;
  }

  .dropdown {
    font-family: "Oswald", sans-serif;
    appearance: none !important;
    padding: 3px 10px 3px 10px;
    max-width:125px;
  }

  .search-section {
    width: 96%;
    height: auto;
    padding: 0px 8px 12px 12px;
    margin-top: 0px;
    border: 0px solid #ccc;
    border-radius: 8px;
    overflow: none;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(5px);
    z-index: 200000;
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
  }

  .search-result-item:hover {
    background-color: rgba(240, 240, 240, 1.0) !important;
  }

  .toggle-buttons button {
    font-weight: 400;
    cursor: pointer;
    margin-bottom: 5px;
    margin-right: 15px;
    color: rgb(80, 80, 80);
  }

  .toggle-buttons button.active {
    color: rgb(180, 100, 100);
    text-decoration: dashed;
    text-decoration-style: dashed;
    text-decoration-thickness: 2px;
    text-decoration-line: underline;
  }

  .search-box {
    font-size: 1.2em;
    background-color: transparent;
    /* focus:none; */
  }

  .search-box:focus {
    outline: none;
  }

  .search-results {
    z-index: 200000;
    width: 100%;
    background-color: rgba(255, 255, 255, 1.0);
    border: 0px solid #ccc;
    border-top: none;
    border-radius: 0px 0px 8px 8px;
    margin-top: 6px;
    margin-left: -12px;
    max-height: 140px;
    overflow-y: auto;
    transition: all 0.4s;
    position: absolute;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
  }

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
    width: 96%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    pointer-events: auto;
    padding-bottom: 10px;
    padding-top: 10px;
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
    width: 96%;
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

    #app .left-pane {
    background: url("images/gradient.png");
    background-size: contain;
    min-width: 100%;
    max-width: 100%;
    font-size: 95%;
  }

    #app .broad-controls {
      width: 100%;

    }

    #app .section-title {
    width:150px;
  }

  .vertical-divider{
    display:none;
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


 .search-section {
    width: 100%;

  }

    #app .control-group {
  
      display: flex;
      flex-direction: row;
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