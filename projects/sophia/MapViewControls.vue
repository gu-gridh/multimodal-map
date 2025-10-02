<template>
  <!-- Checks if all points are loaded and only then show the controls -->
  <div class="controls">

    <div :class="{ 'non-interactive': !areMapPointsLoaded }">
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
                  composite: $t('composite')
                }" :limit="1" class="my-2" title="Pick an inscription type" @click="handleCategoryClick"
                  style="padding-right:0px;" />
              </div>
            </div>
            <div class="row-1" style="display:flex; flex-direction: row;">
              <div class="tag-section tag-section-left" style="">
                <div class="section-title">{{ $t('textualgenre') }}</div>
                <div title="Narrow the result to a certain language group" class="broad-controls">
                  <Dropdown v-model="textualModel" :categories="TEXTUAL" :limit="1" styleType="dropdown" class="my-2"
                    type="language" @change="resetAllExcept('textualModel')" style="padding-right:30px;" />
                </div>
              </div>

              <div class="tag-section">
                <div class="section-title">{{ $t('pictorialdescription') }}</div>
                <div title="Narrow the result to a certain language group" class="broad-controls">
                  <Dropdown v-model="pictorialModel" :categories="PICTORIAL" :limit="1" styleType="dropdown"
                    class="my-2" @change="resetAllExcept('pictorialModel')" style="padding-right:30px;" />
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

        <div class="search-section" ref="searchSection">
          <div class="toggle-buttons" style="margin-top: 5px">
            <button 
              :class="{ active: searchType === 'surfaces' }" 
              @click="() => $emit('update:searchType', 'surfaces')">
              {{ $t('panels') }}
            </button>

            <button 
              :class="{ active: searchType === 'inscriptionobjects' }" 
              @click="() => $emit('update:searchType', 'inscriptionobjects')">
              {{ $t('inscriptions') }}
            </button>
          </div>

          <div class="search-box-wrapper">
            <!-- Selected item bubble -->
            <div class="selected-item-bubble" v-if="selectedInscription || selectedSurface || panelStr"
              ref="bubbleElement">
              <span @click="clearSelection">
                {{ selectedInscription ? selectedInscription.displayText : selectedSurface ? selectedSurface.title :
                panelStr }}
                <span class="remove-icon">&times;</span>
              </span>
            </div>

            <!-- Input field -->
            <input ref="searchInput" type="text" v-model="searchQuery" @input="handleSearch"
              @keydown.enter="handleEnter" @focus="handleSearchBoxFocus" @keydown="handleKeydown"
              :placeholder="searchType === 'surfaces' ? $t('searchsurfacesplaceholder') : $t('searchinscriptionsplaceholder')"
              class="search-box" :style="{ paddingLeft: bubbleWidth + 'px' }"> <div id="search-button"  @click="handleEnter"></div> </div>

            <!-- Search results -->
            <div class="search-results" v-if="showSuggestions" ref="searchResultsContainer" @scroll="handleScroll">
              <!-- Rendering for surfaces -->
              <template v-if="searchType === 'surfaces'">
                <div v-for="(surface, index) in searchResults" :key="surface.id || index"
                  :class="['search-result-item', { selected: searchId === surface?.id }]"
                  @click="handleSurfaceClick(surface)">
                  {{ surface?.title }}
                </div>
              </template>

              <!-- Rendering for inscriptions -->
              <template v-else-if="searchType === 'inscriptionobjects'">
                <div v-for="feature in filteredInscription" :key="feature.id || index"
                  :class="['search-result-item', { selected: searchId === feature.id }]"
                  @click="handleInscriptionClick(feature)">
                  {{ feature.displayText }}
                </div>
              </template>
            </div>
          </div>
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
            <p>{{ totalTextual }}</p>
          </div>

          <div class="data-widget-item">
            <h3>{{ $t('figures') }}:</h3>
            <p>{{ totalPictorial }}</p>
          </div>

          <div class="data-widget-item">
            <h3>{{ $t('composites') }}:</h3>
            <p>{{ totalComposite }}</p>
          </div>
        </div>
      </div>

         <!-- Reset button -->
      <div style="display:flex; flex-direction: row; justify-content:center; width:100%;">
        <div id="resetfilters" class="broad-controls theme-button category-button" v-if="shouldShowReset"
          style="margin-top:15px; width:auto; cursor:pointer; transition: all 0.2s ease-in-out; background-color:var(--theme-4); color:white;"
          @click="clearAll()">{{ $t('reset') }}
        </div>
      </div>
    </div>
</template>

<script setup>
import { inject, ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import Dropdown from "./components/DropdownComponent.vue";
import CategoryButton from "@/components/input/CategoryButtonList.vue";
import { storeToRefs } from "pinia";
import { inscriptionsStore } from "./settings/store";
import { SophiaClient } from "@/assets/saintsophia";
import i18n from '../../src/translations/sophia';
import { mapStore } from "@/stores/store";

const { selectedFeature } = storeToRefs(mapStore());
const searchId = ref(null); //id of the selected item in the search
const sophiaClient = new SophiaClient("inscriptions"); // Initialize SophiaClient
const store = inscriptionsStore();
const { categories, languageModel, writingModel, pictorialModel, selectedCategory, textualModel, areMapPointsLoaded, alignmentModel, conditionModel, panelId,
  inscriptionId, surfaceParams, imgParams, panelStr, showGallery, showGalleryInscriptions, showPlan, mediaModel, materialModel } = storeToRefs(inscriptionsStore());
const lastClickedCategory = ref('');

//initialize variables for data section
const emit = defineEmits(["update:searchType"]);
const searchType = ref('inscriptionobjects'); //default to 'surfaces' 
const selectedInscription = ref(null); //from search results
const selectedSurface = ref(null); //from search results
const bubbleElement = ref(null);
const bubbleWidth = ref(0);
const firstSearchBoxClick = ref(true);
const searchQuery = ref('');
const searchResults = ref([]);
const currentOffset = ref(0);
const limit = 25;
const hasMoreResults = ref(true);
const isLoadingMore = ref(false);
const searchResultsContainer = ref(null);
const showSuggestions = ref(false);
const searchSection = ref(null);
const TEXTUAL = ref([]);
const WRITING = ref([]);
const PICTORIAL = ref([]);
const LANGUAGE = ref([]);
const searchInput = ref(null);

//data section
const currentPanelCount = ref(0);
const hiddenPanels = ref(0);
const totalTextual = ref(0);
const totalPictorial = ref(0);
const totalComposite = ref(0);

const filteredInscription = computed(() => {
  if (searchType.value !== 'inscriptionobjects') {
    return [];
  }
  if (Array.isArray(searchResults.value)) {
    return searchResults.value.map(result => {
      if (result && typeof result === 'object') {
        const panelTitle = result.panel?.title || '';
        const inscriptionId = result.id || '';
        const inscriptionTitle = result.title ? ` | ${result.title}` : '';
        return {
          ...result,
          displayText: `${panelTitle}:${inscriptionId} ${inscriptionTitle}`
        };
      } else {
        return { displayText: 'No data available' };
      }
    });
  }
  return [];
});

watch(
  () => [selectedInscription.value, selectedSurface.value, panelStr.value],
  () => {
    nextTick(() => {
      const bubbleEl = bubbleElement.value;
      if (bubbleEl) {
        bubbleWidth.value = bubbleEl.offsetWidth + 10;
      } else {
        bubbleWidth.value = 0;
      }
    });
  }
);

const shouldShowReset = computed(() => { //check if any of the model values have changed
  const categoryCondition = selectedCategory.value !== null;
  const alignmentCondition = alignmentModel.value !== null;
  const conditionCondition = conditionModel.value !== null;
  const mediaCondition = mediaModel.value !== null;
  const materialCondition = materialModel.value !== null;
  const languageCondition = JSON.stringify(languageModel.value) !== JSON.stringify(["all"]);
  const pictorialCondition = JSON.stringify(pictorialModel.value) !== JSON.stringify(["all"]);
  const textualCondition = JSON.stringify(textualModel.value) !== JSON.stringify(["all"]);
  const writingCondition = JSON.stringify(writingModel.value) !== JSON.stringify(["all"]);

  //condition for the bubble
  const bubbleCondition = selectedInscription.value !== null || selectedSurface.value !== null || panelStr.value !== null;

  return (
    categoryCondition ||
    languageCondition ||
    pictorialCondition ||
    textualCondition ||
    writingCondition ||
    mediaCondition ||
    materialCondition ||
    alignmentCondition ||
    conditionCondition ||
    bubbleCondition 
  );
});

const handleScroll = () => { //infinite scroll for search results
  if (!hasMoreResults.value || isLoadingMore.value) return;
  const container = searchResultsContainer.value;
  if (container) {
    const scrollThreshold = 50; //pixels from the bottom
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight <= scrollThreshold) {
      isLoadingMore.value = true;
      if (searchType.value === 'surfaces') {
        fetchSurfaces(currentOffset.value);
      } else if (searchType.value === 'inscriptionobjects') {
        fetchInscriptions(searchQuery.value, currentOffset.value);
      }
    }
  }
};

const setSearchType = (type) => { //change search type
  searchType.value = type;
  searchResults.value = []; //reset search results
  searchQuery.value = ''; //reset the search query
};

const handleSearchBoxFocus = () => {
  if (firstSearchBoxClick.value && searchType.value === 'surfaces') {
    fetchSurfaces();
    firstSearchBoxClick.value = false; //set to false after first fetch
  }
  showSuggestions.value = true;
};

const handleSearch = () => {
  showSuggestions.value = true;
  currentOffset.value = 0;
  hasMoreResults.value = true;
  isLoadingMore.value = false;
  if (searchType.value === 'surfaces') {
    fetchSurfaces();
  } else if (searchType.value === 'inscriptionobjects') {
    fetchInscriptions(searchQuery.value);
  }
};

const handleKeydown = (event) => {
  if (event.key === 'Backspace' && (selectedInscription.value || selectedSurface.value || panelStr.value)) {
    clearSelection(); 
    event.preventDefault(); 
  }
};

function handleEnter() {
  const enteredValue = searchQuery.value.trim();
  if (enteredValue) {
    if (searchType.value === 'surfaces') {
      panelStr.value = enteredValue;
      selectedInscription.value = { displayText: enteredValue };
    } else if (searchType.value === 'inscriptionobjects') {
      panelStr.value = enteredValue;
      selectedInscription.value = { displayText: enteredValue };
    }
    // searchQuery.value = '';
    // showSuggestions.value = false;
    // clickedPanel.value = null;
    emit('update:searchType', searchType.value);
  }
}

const handleCategoryClick = (category) => {
  alignmentModel.value = null;
  conditionModel.value = null;
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

const handleClickOutside = (event) => { //hide suggestions when clicking outside
  if (searchSection.value && !searchSection.value.contains(event.target)) {
    showSuggestions.value = false;
  }
};

//fetch data section when parameters change
async function fetchDataSection() {
  let params = {
    ...surfaceParams.value,
    ...imgParams.value,
  };

  //replace the key 'panel__title__startswith' with 'panel_title_str'
  params = Object.fromEntries(
    Object.entries(params).map(([key, value]) =>
      key === 'panel__title__startswith' ? ['panel_title_str', value] : [key, value]
    )
  );

  const queryString = new URLSearchParams(params).toString();

  const url = `https://saintsophia.dh.gu.se/api/inscriptions/inscriptions-info/?${queryString}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    currentPanelCount.value = data.shown_inscriptions;
    hiddenPanels.value = data.hidden_inscriptions;
    totalTextual.value = data.textual_inscriptions;
    totalPictorial.value = data.pictorial_inscriptions;
    totalComposite.value = data.composites_inscriptions;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

//fetch inscriptions
const fetchInscriptions = async (query, offset = 0) => {
  if (searchType.value === 'inscriptionobjects') {
    const apiUrl = `https://saintsophia.dh.gu.se/api/inscriptions/inscription-string/?str=${encodeURIComponent(query)}&offset=${offset}&depth=1`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (searchType.value === 'inscriptionobjects') {
        if (offset === 0) {
          searchResults.value = data.results || [];
        } else {
          searchResults.value = [...searchResults.value, ...(data.results || [])];
        }

        currentOffset.value = offset + limit;
        hasMoreResults.value = !!data.next; //check if there's a next page
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      searchResults.value = [];
    } finally {
      isLoadingMore.value = false;
    }
  }
};

//fetch surfaces
async function fetchSurfaces(offset = 0) {
  const apiUrl = `https://saintsophia.dh.gu.se/api/inscriptions/panel-string/?str=${encodeURIComponent(searchQuery.value)}&offset=${offset}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (searchType.value === 'surfaces') {
      if (offset === 0) {
        searchResults.value = data.results || [];
      } else {
        searchResults.value = [...searchResults.value, ...(data.results || [])];
      }

      currentOffset.value = offset + limit;
      hasMoreResults.value = !!data.next; //check if there's a next page
    }
  } catch (error) {
    console.error('Error fetching:', error);
    searchResults.value = [];
  } finally {
    isLoadingMore.value = false;
  }
}

function clearSelection() {
  panelId.value = null;
  inscriptionId.value = null;
  panelStr.value = null;
  searchId.value = null;
  selectedInscription.value = null;
  selectedFeature.value = undefined;
  selectedSurface.value = null;
}

function resetAllExcept(exceptModel) { //reset the other dropdowns to all when a selection is made
  categories.value = ["all"];
  lastClickedCategory.value = '';
  selectedCategory.value = null;
  alignmentModel.value = null;
  conditionModel.value = null;
  if (exceptModel !== "languageModel") languageModel.value = ["all"];
  if (exceptModel !== "pictorialModel") pictorialModel.value = ["all"];
  if (exceptModel !== "textualModel") textualModel.value = ["all"];
  if (exceptModel !== "writingModel") writingModel.value = ["all"];
}

async function fetchDataAndPopulateRef(type, refToPopulate) {
  try {
    const data = await sophiaClient.listAll(type);
    refToPopulate.value = data
      .filter((result) => result.published)
      .map((result) => ({
        id: result.id,
        text: i18n.global.locale === 'uk' ? result.text_ukr : result.text
      }));
  } catch (error) {
    console.error(`Error fetching data for type ${type}:`, error);
  }
}

function handleSurfaceClick(surface) {
  selectedSurface.value = surface;
  selectedInscription.value = null;
  searchId.value = surface.id;
  panelId.value = surface.id; //set the store value
  inscriptionId.value = null;
  showSuggestions.value = false;
  searchQuery.value = '';
  panelStr.value = surface.title;
  emit('update:searchType', searchType.value);
}

function handleInscriptionClick(feature) {
  selectedInscription.value = feature;
  selectedSurface.value = null;
  searchId.value = feature.id;
  inscriptionId.value = feature.id; //set the store value
  panelId.value = null;
  showSuggestions.value = false;
  searchQuery.value = '';
  panelStr.value = null;
  emit('update:searchType', searchType.value);
}

function clearAll() {
  categories.value = ["all"];
  writingModel.value = ["all"];
  textualModel.value = ["all"];
  pictorialModel.value = ["all"];
  languageModel.value = ["all"];
  lastClickedCategory.value = '';
  selectedCategory.value = null;
  alignmentModel.value = null;
  conditionModel.value = null;
  materialModel.value = null;
  mediaModel.value = null;

  //clear the bubble selection
  clearSelection();
}

watch( //watch for changes in the panelStr
  () => panelStr.value,
  (newPanelStr, oldPanelStr) => {
    if (newPanelStr) { //if newPanelStr is not null or empty
      searchResults.value = [];
      searchQuery.value = '';
      panelId.value = null;
      inscriptionId.value = null;
      currentOffset.value = 0;
      hasMoreResults.value = true;
      showSuggestions.value = false;

      //only set if newPanelStr is not null or empty
      selectedInscription.value = { displayText: newPanelStr };
    }
  }
);

watch(
  showGallery,
  (newValue) => {
    if (newValue) {
      setSearchType('surfaces');
    }
  },
  { immediate: true }
);

watch(
  showGalleryInscriptions,
  (newValue) => {
    if (newValue) {
      setSearchType('inscriptionobjects');
    }
  },
  { immediate: true }
);

watch(
  showPlan,
  (newValue) => {
    if (newValue) {
      setSearchType('surfaces');
    }
  },
  { immediate: true }
);

watch(() => i18n.global.locale, (newLocale) => {
  fetchDataAndPopulateRef("language-with-data", LANGUAGE);
  fetchDataAndPopulateRef("writing-system-with-data", WRITING);
  fetchDataAndPopulateRef("tags-with-data", PICTORIAL);
  fetchDataAndPopulateRef("genre-with-data", TEXTUAL);
});

watch(
  () => surfaceParams.value,
  async (newParams, oldParams) => {
    await fetchDataSection();
  },
  { immediate: true }
);

watch(
  () => imgParams.value,
  async (newParams, oldParams) => {
    await fetchDataSection();
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchDataAndPopulateRef("language-with-data", LANGUAGE);
  await fetchDataAndPopulateRef("writing-system-with-data", WRITING);
  await fetchDataAndPopulateRef("tags-with-data", PICTORIAL);
  await fetchDataAndPopulateRef("genre-with-data", TEXTUAL);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineExpose({ clearSelection });
</script>

<style>
.controls {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}

.filtercontrolwidgets {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  float:left;
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
  width: 100px;
}

#app .tag-section {
  margin-top: -5px;
  margin-bottom: 0px;
  margin-right: 0px;
  width: auto;
}

#app .tag-section-left {
  margin-right: 10px;
}

#app .tag-section .broad-controls {
  font-size: 0.9em;
}

.dropdown {
  font-family: "Oswald", sans-serif;
  appearance: none !important;
  padding: 3px 10px 3px 10px;
  min-width: 125px;
  max-width: 125px;
}

.search-section {
  width: 96%;
  height: auto;
  padding: 0px 8px 12px 12px;
  margin-top: 0px;
  border: 0px solid #ccc;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  z-index: 200000;
}

.search-result-item {
  /* Remove styling from anchor links */
  display: block;
  color: inherit;
  text-decoration: none;
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
  max-height: 200px;
  overflow-y: auto;
  transition: all 0.4s;
  position: absolute;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 900px) {
.search-results {
  max-height: 180px;
}
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
  #app .broad-controls {
    width: 100%;
  }

  #app .section-title {
    width: 150px;
  }

  .vertical-divider {
    display: none;
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

  #app .tag-section-left {
    margin-right: 0px;
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

.selected-item-bubble {
  position: absolute;
  top: 50%;
  transform: translateY(-45%);
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 2;
}

.search-box-wrapper {
  position: relative;
  width: 100%;
}

.search-box {
  width: calc(100% - 50px);
  box-sizing: border-box;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0);
  font-size: 1.2em;
  min-height: 35px;
}

.selected-item-bubble .remove-icon {
  margin-left: 5px;
  font-weight: bold;
}

#search-button{
  cursor:pointer;
  width:30px;
  height:30px;
  background-color:var(--theme-3);
  background-color:rgb(180,180,180);
  background-image:url(https://data.dh.gu.se/ui-icons/search_white.png);
  background-size:contain;
  border-radius:50%;
  float:right;
}

#search-button:hover{
  background-color:rgb(130,130,130);
}
</style>