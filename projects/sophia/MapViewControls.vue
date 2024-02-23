<template>
  <!-- Checks if all points are loaded and only then show the controls -->
  <div :class="{ 'non-interactive': !areMapPointsLoaded }">
    <div v-if="areMapPointsLoaded">

      <!-- This creates a 2-column section with for the controls -->
      <div class="control-organisation justify-left" style="pointer-events:auto; padding-bottom:10px; padding-top:10px;">
        <div class="tag-section">
          <div class="section-title">{{ $t('language') }}</div>
          <div style="display:inline; float:left; margin-right:0px; pointer-events:auto;">
            <select title="pick what dataset you want to view data from" class="dropdown theme-color-background my-2" >
              <option title="View data from all datasets" value="All datasets">{{ $t('alllanguages') }}</option>
              <option title="View data from the San Giovenale dataset by Fredrik Tobin-Dodd" value="CTSG-2015">Church Slavic</option>
              <option title="View data from the San Giovenale dataset by Fredrik Tobin-Dodd" value="CTSG-2015">Latin</option>
              <option title="View data from the San Giovenale dataset by Fredrik Tobin-Dodd" value="CTSG-2015">Greek</option>
              <option title="View data from the San Giovenale dataset by Fredrik Tobin-Dodd" value="CTSG-2015">Polish</option>
            </select>
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
            }" :limit="1" class="my-2" title="Pick a data type" @click="handleCategoryClick" />
          </div>
        </div>
      </div>

      <div class="search-section" style="float:left;">
        <div class="section-title">{{ $t('searchpanels') }}</div>
        <input type="text"
          :placeholder="'Search Panels...'" class="search-box" autofocus />
        <div class="search-results">
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
        <p>{{ currentTombCount }}</p>
      </div>
      <div class="data-widget-item">|</div>
      <div class="data-widget-item">
        <h3>{{ $t('panelshidden') }}:</h3>
        <p>{{ hiddenTombs }}</p>
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

const config = inject<InscriptionsProject>("config");
const sophiaClient = new SophiaClient("inscriptions"); // Initialize SophiaClient
const { categories, tags, dataParams, selectedNecropolisCoordinates, enable3D, enablePlan, areMapPointsLoaded } = storeToRefs(inscriptionsStore());
// Create a ref for last clicked category
const lastClickedCategory = ref('');

//initialize variables for data section
const totalPhotographs = ref(0);
const totalPlans = ref(0);
const totalThreed = ref(0);
const hiddenTombs = ref(0);
const currentTombCount = ref(0);
const visibleAbout = ref(false);
const { selectedFeature } = storeToRefs(mapStore());
const searchResults = ref([]);
const TAGS = ref<Record<string, string>>({});
//const INSCRIPTIONTYPE = ref<Record<string, string>>({});
const currentTag = ref(null);
//const currentNecropolis = ref(null);
//const currentInscriptionType = ref(null);

const baseURL = `${apiConfig.PANEL}?page_size=500`;

onMounted(async () => {
  // await fetchDataAndPopulateRef("epoch", TAGS);
  //await fetchDataAndPopulateRef("typeofinscription", INSCRIPTIONTYPE);

  const response = await fetch(baseURL);
  const data = await response.json();
});

const NECROPOLICoordinates = ref<Record<string, [number, number]>>({});

async function fetchDataAndPopulateRef<T>(type: string, refToPopulate: any) {
  try {
    const data = await sophiaClient.listAll<T>(type);
    data.forEach((result: any) => {
      if (result.published) {
        refToPopulate.value[result.id] = result.text;

        // If the type is necropolis, store its coordinates
        if (type === "necropolis" && result.geometry && result.geometry.coordinates) {
          NECROPOLICoordinates.value[result.id] = result.geometry.coordinates;
        }
      }
    });
  } catch (error) {
    console.error(`Error fetching data for type ${type}:`, error);
  }
} 

const handleCategoryClick = (category: string) => {
  // If the clicked category is the same as the last clicked one, default to "all"
  if (lastClickedCategory.value === category) {
    categories.value = ["all"];

    // Clear the lastClickedCategory since it was unselected
    lastClickedCategory.value = '';
    if (category === 'models') {
      enable3D.value = !enable3D.value;  // Toggle between true and false
    } else {
      enable3D.value = false;
    }
    if (category === 'plans') {
      enablePlan.value = !enablePlan.value;  // Toggle between true and false
    } else {
      enablePlan.value = false;
    }
  } else {
    // Add the clicked category only if it's not the same as the last clicked one
    categories.value = [category];

    // Update last clicked category
    lastClickedCategory.value = category;
    enable3D.value = (category === 'models');
    enablePlan.value = (category === 'plans');
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
  currentTombCount.value = data.shown_tombs;
  totalPhotographs.value = data.photographs;
  totalPlans.value = data.drawing;
  hiddenTombs.value = data.hidden_tombs;
  totalThreed.value = data.objects_3d;
};

watch(
  () => dataParams.value,
  async (newTagParams, oldTagParams) => {
    const queryParams = new URLSearchParams(Object.fromEntries(Object.entries(newTagParams).map(([k, v]) => [k, String(v)])));
    const urlWithParams = `https://diana.dh.gu.se/api/etruscantombs/info/tombs/?${queryParams.toString()}`;
    await fetchData(urlWithParams);
  },
  { immediate: true }
);

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};

function handleSelectionClick(selectedValue: any, targetRef: any) {
  clearAll();
  const selectedCoordinates = NECROPOLICoordinates.value[selectedValue];
  if (selectedCoordinates) {
    const [x, y] = selectedCoordinates;

    const convertedCoordinates = transform([x, y], 'EPSG:4326', 'EPSG:3857');
    if (Array.isArray(convertedCoordinates) && convertedCoordinates.length === 2) {
      selectedNecropolisCoordinates.value = convertedCoordinates as [number, number];
    } else {
      console.error("Invalid coordinate format after transformation.");
    }

  }
}

function clearAll() {
  categories.value = ["all"];
  enablePlan.value = false;
  enable3D.value = false;
  //inscriptionType.value = ["all"];
  lastClickedCategory.value = '';
  tags.value = [];
}



</script>

<style>
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
  color: white;
}

#app .tag-section {
  margin-top: -5px;
  margin-bottom: 0px;
}


.search-result-item {
  font-weight: normal;
  /* Remove styling from anchor links */
  display: block;
  color: inherit;
  text-decoration: none;
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
  width:100%;
}

.search-box {
  width: 98%;
  height: 50px;
  padding: 8px;
  margin-top: 10px;
  border: 0px solid #ccc;
  border-radius: 4px 4px 4px 4px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  /* focus:none; */
}

.search-box:focus {
  outline: none;
}

.search-results {
  width: 100%;
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

  #app .control-organisation {
    width: 98%;
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

  .data-widget {
    display: none;
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
</style>
