<script setup>
import { computed } from "vue";
import MainLayout from "@/MainLayout.vue";
import MapViewControls from "./MapViewControls.vue";
import MapComponent from "./components/MapComponent.vue";
import MapViewMarkers from "./MapViewMarkers.vue";
import MapViewPreview from "./MapViewPreview.vue";
import { storeToRefs } from "pinia";
import { inscriptionsStore } from "./settings/store";
import { mapStore } from "@/stores/store";
import { clean } from "@/assets/utils";
import MapViewGallery from "./MapViewGallerySurfaces.vue";
import MapViewGalleryInscriptions from "./MapViewGalleryInscriptions.vue";
import { ref } from "vue";
import About from "./About.vue";
import Instructions from "./Instructions.vue";
import { onMounted, watch } from "vue";
import { nextTick } from "vue";
import Title from "./MapViewTitle.vue";

const { selectedCategory, writingModel, languageModel, pictorialModel, textualModel, alignmentModel, conditionModel, panelId, inscriptionId, mediaModel, materialModel, panelStr, showGallery, showGalleryInscriptions, showPlan } = storeToRefs(inscriptionsStore());
const store = mapStore();
const inscriptions = inscriptionsStore();  //get the instance of inscriptionsStore
const { selectedFeature } = storeToRefs(store);
const minZoom = 20;
const maxZoom = 24;
const featureZoom = 15; //value between minZoom and maxZoom when you select a point 
const visibleAbout = ref(false);
const visibleInstructions = ref(false);
const showGuideButton = computed(() => showPlan.value);
const showFirstFloor = ref(true);
const showSecondFloor = ref(false);
const searchType = ref("inscriptionobjects");
const mapviewControlsRef = ref(null);
let visited = true; //store the visited status outside of the hook

const switchToPlan = () => {
  showPlan.value = true;
  showGallery.value = false;
  showGalleryInscriptions.value = false;
};

const switchToGallery = () => {
  showPlan.value = false;
  showGallery.value = true;
  showGalleryInscriptions.value = false;
};

const switchToInscriptions = () => {
  showPlan.value = false;
  showGallery.value = false;
  showGalleryInscriptions.value = true;
};

watch( //watcher for selectedFeature changes
  selectedFeature,
  (newFeature, oldFeature) => {
    if (newFeature && newFeature.getGeometry) {
      const geometry = newFeature.getGeometry();
      if (geometry) {
        const coordinates = (geometry).getFirstCoordinate();
        store.updateCenter(coordinates);
        if (store.zoom < featureZoom) {
          store.updateZoom(featureZoom);
        }
      }
    }
  },
  { immediate: true }
);

watch( //if a dropdown has been selected, toggle to the inscriptions view
  [writingModel, languageModel, pictorialModel, textualModel],
  ([newWriting, newLanguage, newPictorial, newTextual]) => {
    if (
      newWriting[0] !== "all" ||
      newLanguage[0] !== "all" ||
      newPictorial[0] !== "all" ||
      newTextual[0] !== "all"
    ) {
      showPlan.value = false;
      showGalleryInscriptions.value = true;
      showGallery.value = false;
    }
  }
);

// if selectedCategory is not null, toggle to the inscriptions view
watch(selectedCategory, (newValue, oldValue) => {
  if (newValue !== null && newValue !== undefined) {
    showPlan.value = false;
    showGalleryInscriptions.value = true;
    showGallery.value = false;
  }
});

const handleSearchTypeChange = (type) => {
  searchType.value = type;
  if (type === "surfaces") {
    showPlan.value = false;
    showGallery.value = true;
    showGalleryInscriptions.value = false;
  } else if (type === "inscriptionobjects") {
    showPlan.value = false;
    showGallery.value = false;
    showGalleryInscriptions.value = true;
  }
};

watch(showPlan, (newValue) => {
  localStorage.setItem("showPlan", JSON.stringify(newValue));
});

watch(showGallery, (newValue) => {
  localStorage.setItem("showGallery", JSON.stringify(newValue));
});

watch(showGalleryInscriptions, (newValue) => {
  localStorage.setItem("showGalleryInscriptions", JSON.stringify(newValue));
});

watch(showFirstFloor, (newValue) => {
  localStorage.setItem("showFirstFloor", JSON.stringify(newValue));
});

watch(showSecondFloor, (newValue) => {
  localStorage.setItem("showSecondFloor", JSON.stringify(newValue));
});

const panelParams = computed(() => {
  const panelIdValue = panelId.value;
  const medium = mediaModel.value;
  const material = materialModel.value;
  const panelString = panelStr.value;
  const params = { medium, material };

  if (panelIdValue !== null && panelIdValue !== undefined) {
    params['panel'] = panelIdValue;
  }

  if (medium !== null) {
    (params)['medium'] = medium; 
  } else {
    delete (params)['medium']; 
  }

  if (material !== null) {
    (params)['material'] = material; 
  } else {
    delete (params)['material']; 
  }

  if (panelString !== null && panelString !== undefined) {
    (params)['panel__title__startswith'] = panelString;
  }

  return params;
});

/* Response for generating the URL for filtering map points down */
const tagParams = computed(() => {
  const genre = textualModel.value[0];
  const tags = pictorialModel.value[0];
  const writing_system = writingModel.value[0];
  const language = languageModel.value[0];
  const alignment = alignmentModel.value;
  const condition = conditionModel.value;
  const selectedCategoryValue = selectedCategory.value;
  const id = inscriptionId.value;
  const panelString = panelStr.value;

  const initialParams = { genre, tags, writing_system, language};

  // Remove parameters that are set to "all"
  const cleanedParams = Object.keys(initialParams)
    .filter((key) => initialParams[key] !== "all")
    .reduce((obj, key) => {
      obj[key] = initialParams[key];
      return obj;
    }, {});

  // Further clean to remove null or undefined values
  const params = clean(cleanedParams);

  if (selectedCategoryValue) {
    (params)['type_of_inscription'] = selectedCategoryValue;
  }

  if (alignment !== null) {
    (params)['alignment'] = alignment; 
  } else {
    delete (params)['alignment']; 
  }

  if (condition !== null) {
    (params)['condition'] = condition; 
  } else {
    delete (params)['condition']; 
  }

  if (id !== null) {
    (params)['id'] = id; 
  } else {
    delete (params)['id']; 
  }

  if (panelString !== null && panelString !== undefined) {
    (params)['panel__title__startswith'] = panelString;
  }

  return params;
});

watch(
  tagParams,
  (newParams) => {
    inscriptions.imgParams = newParams;
  },
  { immediate: true }
);

watch(
  panelParams,
  (newParams) => {
    inscriptions.surfaceParams = newParams;
  },
  { immediate: true }
);

onMounted(() => {
  // Check if the "visited" key exists in session storage
  visited = localStorage.getItem("visited") === "true"; // Retrieve the visited status from session storage
  const storedShowPlan = localStorage.getItem("showPlan");
  const storedShowGallery = localStorage.getItem("showGallery");
  const storedShowGalleryInscriptions = localStorage.getItem("showGalleryInscriptions");

  if (!visited) {
    //hide the about component
    visibleAbout.value = true;
    localStorage.setItem("visited", "true");
  }

  if (storedShowPlan) {
    showPlan.value = JSON.parse(storedShowPlan);
  }

  if (storedShowGallery) {
    showGallery.value = JSON.parse(storedShowGallery);
  }

  if (storedShowGalleryInscriptions) {
    showGalleryInscriptions.value = JSON.parse(storedShowGalleryInscriptions);
  }
})

const toggleAboutVisibility = async () => {
  await nextTick();
  visibleAbout.value = !visibleAbout.value;
};
const toggleInstructionsVisibility = async () => {
  await nextTick();
  visibleInstructions.value = !visibleInstructions.value;
};

function handleDeselectSurface() {
  if (mapviewControlsRef.value) {
    mapviewControlsRef.value.clearSelection();
  }
}
</script>

<template>
  <div id="version"> {{ $t('versionnumb') }}</div>
  <div style="display:flex; align-items: center; justify-content: center; pointer-events: none;">
    <div class="ui-mode ui-overlay ui-overlay-top">
      <button class="item" :class="{ selected: showPlan }" @click="switchToPlan">
        {{ $t('plans') }}
      </button>
      <button class="item" :class="{ selected: showGallery }" @click="switchToGallery">
        {{ $t('panels') }}
      </button>
      <button class="item" :class="{ selected: showGalleryInscriptions }" @click="switchToInscriptions">
        {{ $t('inscriptions') }}
      </button>
    </div>

    <div class="ui-mode ui-overlay tile-switcher" style="" v-if="showPlan">
      <button class="item" v-bind:class="{ selected: !showSecondFloor }" v-on:click="showSecondFloor = false;">
        {{ $t('groundfloor') }}
      </button>
      <button class="item" v-bind:class="{ selected: showSecondFloor }" v-on:click="showSecondFloor = true;">
        {{ $t('secondfloor') }}
      </button>
    </div>

    <div class="guide-button compact" title="User Guide" @click="toggleInstructionsVisibility" v-if="showGuideButton">?</div>

  </div>
  <MapViewGallery v-if="showGallery" />
  <MapViewGalleryInscriptions v-if="showGalleryInscriptions" />
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />
  <Instructions :visibleInstructions="visibleInstructions" @close="visibleInstructions = false" />
  <div class="gradient-blur">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  <MainLayout>
   
    <template #search>
      <Title @toggle-about="toggleAboutVisibility" @toggle-instructions="toggleInstructionsVisibility"/>

      <MapViewControls @update:searchType="handleSearchTypeChange" ref="mapviewControlsRef"/>
    </template>

    <template #background>
      <div class="map-container">
       
        <MapComponent :shouldAutoMove="true" :min-zoom=minZoom :max-zoom=maxZoom v-if="showPlan">
          <template #layers>
            <MapViewMarkers :zIndex=3 :showSecondFloor="showSecondFloor" @deselect-surface="handleDeselectSurface"/>
          <div >
            <ol-tile-layer className="floor-plans" v-if="!showSecondFloor">
              <ol-source-xyz url="https://data.dh.gu.se/tiles/saint_sophia_ground_floor/{z}/{x}/{y}.png" />
              
            </ol-tile-layer>

            <ol-tile-layer className="floor-plans" v-if="showSecondFloor">
              <ol-source-xyz  url="https://data.dh.gu.se/tiles/saint_sophia_second_floor/{z}/{x}/{y}.png" />
            </ol-tile-layer>
          </div>   
        </template>
        </MapComponent>
        
      </div>
    </template>

    <template #details>
      <MapViewPreview v-if="showPlan" @deselect-surface="handleDeselectSurface"/>
    </template>

  </MainLayout>
</template>

<style>
#version{
  position:absolute;
  text-align:right;
  font-size:0.7em;
  right:30px;
  top:15px;
  z-index:1000;
  opacity:0.7;
}
@media screen and (max-width: 900px) {
  #version{
  display:none;
}
}


.map-container {
  height: calc(100% - 80px) !important;
  position: relative;
  width: 100%;
}

.gradient-blur {
  position: fixed;
  z-index: 1;
  inset: auto 0 0 0;
  height: calc(100% - 80px);
  pointer-events: none;
  width: 750px;
  top:0px;
  opacity:1.0;
}

.filter-gradient-blur {
  position: fixed;
  z-index: 1;
  inset: auto 0 0 0;
  height: 140px;
  pointer-events: none;
  width:100%;
  bottom:80px;
  opacity:1.0;
  margin-left:510px;
}

.floor-plans{
  opacity:0.7;
}

@media screen and (max-width: 900px) {
  .gradient-blur {
    display:none;
  }
}

.gradient-blur>div,
.gradient-blur::before,
.gradient-blur::after {
  position: absolute;
  inset: 0;
}

.gradient-blur::before {
  content: "";
  z-index: 1;
  backdrop-filter: blur(0.5px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 0) 37.5%);
}

.gradient-blur>div:nth-of-type(1) {
  z-index: 2;
  backdrop-filter: blur(1px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 0) 50%);
}

.gradient-blur>div:nth-of-type(2) {
  z-index: 3;
  backdrop-filter: blur(2px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 62.5%);
}

.gradient-blur>div:nth-of-type(3) {
  z-index: 4;
  backdrop-filter: blur(4px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 0) 75%);
}

.gradient-blur>div:nth-of-type(4) {
  z-index: 5;
  backdrop-filter: blur(8px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 87.5%);
}

.gradient-blur>div:nth-of-type(5) {
  z-index: 6;
  backdrop-filter: blur(16px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 0) 100%);
}

.gradient-blur>div:nth-of-type(6) {
  z-index: 7;
  backdrop-filter: blur(32px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 1) 100%);
}

.gradient-blur::after {
  content: "";
  z-index: 8;
  backdrop-filter: blur(64px);
  mask: linear-gradient(to left,
      rgba(0, 0, 0, 0) 87.5%,
      rgba(0, 0, 0, 1) 100%);
}

#app .tile-layer {
  filter: grayscale(0%);
  filter: opacity(0.0);
}

/* Overides the settings in ui_modules.css */
#app .ol-popup {
  left: -55px;
  width: 110px;
  min-width: 90px;
  bottom: 55px;
}

#app .ol-popup:before {
  left: 30px;
}

#app .ol-zoom-in {
  top: calc(100vh - 190px) ;
  background-color:rgba(0,0,0,0.9)!important;
  border-radius:8px 0px 0px 8px!important;
}

#app .ol-zoom-out {
  top: calc(100vh - 190px) ;
  background-color:rgba(0,0,0,0.9)!important;
  border-radius:0px 8px 8px 0px!important;
}

.tile-switcher {
    position: absolute; 
    margin-top: calc(0%)!important;
    top: calc(100% - 190px) !important; 
    z-index:1 !important;
}

@media screen and (max-width: 900px) {
    .tile-switcher {
        margin-top: calc(0%)!important;
        top: calc(72%)!important;
        bottom:auto;
        height:auto!important; 
    }
    .guide-button
    {
      display: none;
    }
}
/* 
@media screen and (max-height: 1000px) and (max-width: 900px) {
    .tile-switcher {
        top: 47% !important;
    }
    .guide-button
    {
      display: none;
    }
}

@media screen and (max-height: 900px) and (max-width: 900px) {
    .tile-switcher {
        top: 4% !important;
    }
    .guide-button
    {
      display: none;
    }
}

@media screen and (max-height: 800px) and (max-width: 900px) {
    .tile-switcher {
        top: 43% !important;
    }
    .guide-button
    {
      display: none;
    }
}

@media screen and (max-height: 700px) and (max-width: 900px) {
    .tile-switcher {
        top: 40% !important;
    }
    .guide-button
    {
      display: none;
    }
} 

@media screen and (max-height: 600px) and (max-width: 900px) {
    .tile-switcher {
        top: 35% !important;
    }
    .guide-button
    {
      display: none;
    }
}

*/



/* Gallery */
#gallery-container {
    position: absolute;
    margin-left: 510px;
    width: calc(100% - 510px);
    height: calc(100% - 80px);
    padding:0px 10px 0px 20px;
    z-index: 100 !important;
    background-color: black;
    opacity: 0.9;
  }

  @media screen and (min-width: 1900px) {
    #gallery-container {
      margin-left: 510px;
      width: calc(100% - 510px);
    }
  }

  @media screen and (max-width: 1600px) {
    #gallery-container {
      margin-left: 510px;
      width: calc(100% - 510px);
    }
  }

@media screen and (max-width: 900px) {
  #gallery-container {
    margin-left: 0px;
    width: 100%;
    height:100%;
    padding-top:0px;
  }
}

.gallery-filter-container{
  z-index:1000;
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
}

/* Gallery filters */
.gallery-filters{
  height:auto;
  display:flex;
flex-direction: row;
justify-content:right;
flex-wrap:wrap;
z-index:10000;
color:white;
position:absolute;
bottom:0px;
padding-top:300px;
pointer-events: none;
/* padding-right:22%; */
/* border-width:1px 0px 0px 0px;
border-style:dotted;
border-color:rgb(220, 215, 210); */
width:100%;
background: linear-gradient(0deg, rgba(0, 0, 0, 0.8)0%, rgba(0, 0, 0, 0.2)30%, rgba(0, 0, 0, 0)50%) !important;
}

.gallery-filters-padding{
  display:flex;
  flex-direction: column;
justify-content:right;
flex-wrap:wrap;
padding-bottom:10px;
padding-right:40px;
}

@media screen and (max-width: 1500px) {
  .gallery-filters{
padding-right:0%;
}
}

@media screen and (max-width: 1300px) {
  .gallery-filters{
padding-right:0%;
}
}

@media screen and (max-width: 900px) {
  .gallery-filters{
display:none;
}
}

.gallery-filters h1{
font-size:0.9em;
font-weight:200;
margin-right:10px;
}

.gallery-filters .tag-container{
width:100%;
display:flex;
flex-direction: row;
align-items: flex-end;
width:auto;
}

.gallery-filters .tag-container .gallery-tag{
  pointer-events: auto;
font-size:0.75em;
letter-spacing: 0.5px;
border-radius:4px;
padding:3px 8px;
background-color:rgba(255,255,255,0.1);
margin-left:5px;
margin-bottom:10px;
cursor:pointer;
border-width:0.5px 0 0 0;
border-color:grey;
}

.gallery-filters .tag-container .gallery-tag:hover{
background-color:rgba(100,40,40,1.0);
}

.guide-button {
  pointer-events: auto;
  width: 40px;
  height: 40px;
  cursor: pointer;
  overflow: hidden;
  position: absolute;
  bottom: 100px;
  right: 30px;
  background-color: rgb(0, 0, 0, 0.8) !important;
  border-radius: 50%;
  color: white;
  text-align: center;
  line-height: 1.9;
  font-size: 1.4em;
  font-weight: 100;
  font-family: "Oswald", sans-serif !important;
  user-select: none;
  -webkit-user-select: none;
  z-index: 1000;
}

.guide-button:hover {
    background-color: rgb(0, 0, 0, 1.0) !important;
    cursor: pointer;
    transform: scale(1.07);
}
</style>
