<script setup>
import { ref, onMounted, inject, computed, nextTick, watch } from 'vue';
import PlaceViewCard from "./PlaceViewCard.vue";
import MapComponent from "@/components/MapComponent.vue";
import i18n from '../../src/translations/etruscan';
import { etruscanStore } from "./settings/store";
import { useRoute } from 'vue-router';
import apiConfig from "./settings/apiConfig";
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { DianaClient } from "./settings/diana.js";


const msnry = ref(null);
const plansMsnry = ref(null);
const sort = ref('type');
const etruscan = etruscanStore();
const groupedByYear = ref({});
const id = computed(() => etruscan.placeId);
const dianaClient = new DianaClient("etruscantombs");
const images = ref([]);
const plans = ref([]);
const route = useRoute();
const nextPageUrl = ref(null);
const hasMoreImages = ref(true);
const isLoading = ref(false);
const selectedDataset = ref(null); 
const cloneTombOptions = ref([]);

const props = defineProps({
  name: String,
});

let observations = ref([]);
let documents = ref([]);
let pointcloud = ref([]);
let mesh = ref([]);

const datasetsMap = {
    1: "CTSG",
    2: "SIR",
};

const combined3DModels = computed(() => [
    ...mesh.value.map(m => ({ ...m, modelType: 'mesh' })),
    ...pointcloud.value.map(p => ({ ...p, modelType: 'pointcloud' }))
]);

const sortedGroupedByYear = computed(() => {
    return Object.entries(groupedByYear.value)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
});

watch(sort, (newValue, oldValue) => {
    if (newValue === 'year' && hasMoreImages.value) {
        fetchMoreImages();
    }
});

watch(() => sort.value, async () => {
    await nextTick(); // Wait for Vue to update the DOM

    // Destroy the old Masonry instance if it exists
    if (msnry.value?.destroy) {
        msnry.value.destroy();
    }

    if (plansMsnry.value?.destroy) {
        plansMsnry.value.destroy();
    }

    // Reinitialize Masonry
    initMasonry();
});

function isImage(item) {
    return 'iiif_file' in item;
}

function isObservation(item) {
    return 'observation' in item;
}

function isPointcloud(item) {
    return 'camera_position' in item;
}

function isMesh(item) {
    return 'triangles_optimized' in item;
}

function isDocument(item)  {
    return 'upload' in item;
}

function toggleLanguage() {
    if (i18n.global.locale === 'en') {
        i18n.global.locale = 'it';
    } else {
        i18n.global.locale = 'en';
    }
}

async function fetchMoreImages() {
    if (!hasMoreImages.value || !nextPageUrl.value) {
        return;
    }
    isLoading.value = true;

    try {
        const newImages = [];
        while (nextPageUrl.value) {
            const response = await fetch(nextPageUrl.value);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            nextPageUrl.value = data.next && data.next.startsWith('http://')
                ? data.next.replace('http://', 'https://')
                : data.next;

            hasMoreImages.value = !!data.next;

            newImages.push(...data.results.filter((image) => image.published));
        }
        images.value = [...images.value, ...newImages];

        groupAndSortByYear([...images.value, ...plans.value, ...observations.value, ...documents.value, ...pointcloud.value, ...mesh.value]);

        await nextTick(); 

        const photoGallery = document.querySelector('.placeview-masonry-gallery');
        if (photoGallery) {
            await new Promise(resolve => imagesLoaded(photoGallery, resolve));
            msnry.value?.reloadItems();
            msnry.value?.layout();
        }
    } catch (error) {
        console.error("Failed to fetch more images:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    let urlId = route.params.name;

    if (Array.isArray(urlId)) {
        urlId = urlId[0];
    }

    urlId = urlId.split('/').pop().split('_').slice(1).join('_'); //get everything after the first _ in the URL
    urlId = urlId.replace(/_/g, '%20'); //replace _ with spaces

    // Check if placeId is undefined or null and fetch for the id based on the name
    const response = await fetch(`https://diana.dh.gu.se/api/etruscantombs/geojson/place/?name=${urlId}&depth=1`);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
        const mainFeature = data.features[0];
        etruscan.placeId = mainFeature.id;
        const mainDatasetId = mainFeature.properties.dataset.id;
        selectedDataset.value = datasetsMap[mainDatasetId] || "Unknown Dataset";

        //check clone_tombs for different dataset IDs
        mainFeature.properties.clone_tombs.forEach(cloneTomb => {
            if (cloneTomb.dataset !== mainDatasetId) {
                //determine the id based on the name
                const id = isNaN(parseInt(cloneTomb.name)) ? cloneTomb.name : parseInt(cloneTomb.name);

                cloneTombOptions.value.push({
                    id: id,
                    datasetId: cloneTomb.dataset,
                    datasetName: datasetsMap[cloneTomb.dataset] || "Unknown Dataset"
                });
            }
        });
    }
    
    if (id) {
        const [fetchedImages, fetchedObservations, fetchedDocuments, fetchedPointclouds, fetchedMeshes, fetchedPlans] = await Promise.all
            ([
                fetch(`${apiConfig.IMAGE}?tomb=${id.value}&limit=8&type_of_image=2&depth=2`).then(res => res.json()),
                dianaClient.listAll("observation", { place: id.value }),
                dianaClient.listAll("document", { place: id.value }),
                dianaClient.listAll("objectpointcloud", { tomb: id.value, depth: 2 }),
                dianaClient.listAll("object3dhop", { tomb: id.value, depth: 2 }),
                fetch(`${apiConfig.IMAGE}?tomb=${id.value}&type_of_image=1&type_of_image=5&depth=2`).then(res => res.json())
            ]);

        images.value = fetchedImages.results.filter((image) => image.published);
        nextPageUrl.value = fetchedImages.next && fetchedImages.next.startsWith('http://')
            ? fetchedImages.next.replace('http://', 'https://')
            : fetchedImages.next;
        hasMoreImages.value = !!fetchedImages.next;
        observations.value = fetchedObservations;
        documents.value = fetchedDocuments;
        pointcloud.value = fetchedPointclouds;
        mesh.value = fetchedMeshes;
        plans.value = fetchedPlans.results;

        /* For sorting by year */
        groupAndSortByYear([...images.value, ...plans.value, ...observations.value, ...documents.value, ...pointcloud.value, ...mesh.value]);
    }

    nextTick(() => {
        initMasonry();
    });
});

function groupAndSortByYear(allItems) {
    // Reset groupedByYear
    groupedByYear.value = {};

    // Group items by year
    allItems.forEach((item) => {
        const fullDate = new Date(item.date);
        const year = fullDate.getFullYear().toString();

        if (!groupedByYear.value[year]) {
            groupedByYear.value[year] = [];
        }
        groupedByYear.value[year].push(item);
    });
}

function createPlaceURL() {
    const url = `${apiConfig.ADMIN_PLACE}${id.value}`;
    window.open(url, "_blank");
}

function handleCloneTombChange(event) {
    const selectedValue = (event.target).value;
    const selectedOption = cloneTombOptions.value.find(option => option.id.toString() === selectedValue);
    if (selectedOption) {
        selectedDataset.value = selectedOption.datasetName;        
        const formattedId = selectedOption.id.toString().replace(/\s+/g, '_');
        window.location.href = `/${selectedDataset.value}_${formattedId}`;
    }
}

async function initMasonry() {
    // Initialize Photograph Masonry
    const photoGallery = document.querySelector('.placeview-masonry-gallery');
    if (photoGallery) {
        await new Promise(resolve => {
            imagesLoaded(photoGallery, resolve);
        });
        msnry.value = new Masonry(photoGallery, {
            itemSelector: '.gallery__item',
            columnWidth: 100,
            gutter: 8,
            percentPosition: true,
        });
    }

    // Initialize Plans Masonry
    const plansGallery = document.querySelector('.plans-masonry-gallery');
    if (plansGallery) {
        await new Promise(resolve => {
            imagesLoaded(plansGallery, resolve);
        });
        plansMsnry.value = new Masonry(plansGallery, {
            itemSelector: '.plan-gallery__item',
            columnWidth: 100,
            gutter: 8,
            percentPosition: true,
        });
    }
}
</script>
    
<template>
    <div class="main-container">
        <div class="place-card-container">
            <div class="placeview-topbutton-container">
                <button @click="toggleLanguage">
                    <div class="p-1 px-2 clickable category-button about-button placeview-topbutton" style="float:left;">
                        {{ $t('languagebutton') }}</div>
                </button>
                <button @click="createPlaceURL()">
                    <div class="p-1 px-2 clickable category-button about-button placeview-topbutton" style="float:left;">
                        {{ $t('editplace') }}</div>
                </button>
            </div>
            <div v-if="id">
                <PlaceViewCard :id="id" />
            </div>
        </div>
        <!-- Here we will show info of the place -->
        <div class="place-view">
            <div class="place-gallery-container">
                <!-- Gallery of objects will show here with the ability to sort by TYPE of object -->
                <!-- <p>ID: {{ id }}</p> -->
                <!-- <p>PLACE: {{ place.id }}</p> -->
                <div>
                    <select v-model="sort" class="dropdown theme-color-background sort">
                        <option active value="type">{{ $t('sortbytype') }}</option>
                        <option value="year">{{ $t('sortbyyear') }}</option>
                    </select>
                </div>

                <div>
                    <select class="dropdown theme-color-background" @change="handleCloneTombChange">
                        <option :value="null">{{ selectedDataset }}</option>
                        <option 
                            v-for="option in cloneTombOptions" 
                            :key="option.id" 
                            :value="option.id">
                            {{ option.datasetName}}
                        </option>
                    </select>
                </div>

                <!-- Sort by TYPE table-->
                <table class="content-table" v-if="sort == 'type'">
                    <tr v-if="documents.length > 0">
                        <td>{{ $t('documents') }}</td>
                        <td>
                            <a v-for="(document, index) in documents" :key="index" :href="document.upload" target="_blank"
                                download>
                                <div class="image-placeholder document-placeholder">
                                    <div class="document-title">{{ document.title }}</div>
                                    <p class="documentlabel">{{ $t('type') }}:</p>
                                    <p class="documentdata theme-color-text">{{ document.type_names[0] }}</p>
                                    <p class="documentlabel">{{ $t('size') }}:</p>
                                    <p class="documentdata theme-color-text">{{ document.size }} MB</p>
                                    <p class="documentlabel">{{ $t('published') }}:</p>
                                    <p class="documentdata theme-color-text">{{ document.date }}</p>
                                </div>
                            </a>
                        </td>
                    </tr>

                    <tr v-if="combined3DModels.length > 0">
                        <td>{{ $t('threedmodels') }}</td>
                        <td><div v-for="(model, index) in combined3DModels" :key="index" class="image-placeholder square"> 
                            <a v-if="model.modelType === 'mesh'" :href="`https://etruscan.dh.gu.se/viewer/?q=${model.id}/pointcloud`"
                                target="_blank">
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ model.title }}</div>
                                    <div class="meta-data-overlay-text">{{ model.technique ? model.technique.text : 'N/A' }}
                                    </div>
                                </div>
                                <img :src="`${model.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="model.title"
                                    class="image-square" />
                            </a>
                            <a v-else-if="model.modelType === 'pointcloud'"
                                :href="`https://etruscan.dh.gu.se/viewer/?q=${model.id}/pointcloud`" target="_blank">
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ model.title }}</div>
                                    <div class="meta-data-overlay-text">{{ model.technique ? model.technique.text : 'N/A' }}
                                    </div>
                                </div>
                                <img :src="`${model.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="model.title"
                                    class="image-square" />
                            </a>
                        </div></td>
                    </tr>

                    <tr v-if="plans.length > 0">
                        <td>{{ $t('drawings') }}</td>
                        <td><div class="plans-masonry-gallery">
                            <div v-for="(image, index) in plans" :key="index" class="plan-gallery__item">
                                <div class="masonry-image" v-if="'iiif_file' in image">
                                    <a :href="`https://etruscan.dh.gu.se/viewer/?q=${image.id}/image`" target="_blank">
                                        <div class="meta-data-overlay">
                                            <div class="meta-data-overlay-text">{{ image.title }}</div>
                                            <div class="meta-data-overlay-text"> {{ image.type_of_image[0].text }}</div>
                                        </div>
                                        <img :src="`${image.iiif_file}/full/400,/0/default.jpg`" :alt="image.title"
                                            class="image-square-plan" />
                                    </a>
                                </div>
                            </div>
                        </div></td>
                    </tr>
                    <tr v-if="images.length > 0">
                        <td>
                            <div style="display: flex; flex-direction: column; align-items: flex-start;">
                                <a :href="`${apiConfig.ADMIN_IMAGE}?q=${route.params.name}`">
                                    {{ $t('photographs') }}
                                </a>
                                <button class="show-button theme-color-background" v-if="nextPageUrl" 
                                    @click="fetchMoreImages" :disabled="isLoading">
                                    {{ $t('showall') }}
                                </button>
                            </div>
                        </td>
                        <td><div class="placeview-masonry-gallery">
                            <div v-for="(image, index) in images" :key="index" class="gallery__item">
                                <div class="masonry-image" v-if="'iiif_file' in image">
                                    <a :href="`https://etruscan.dh.gu.se/viewer/?q=${image.id}/image`" target="_blank">
                                        <div class="meta-data-overlay">
                                            <div class="meta-data-overlay-text">{{ image.title }}</div>
                                            <div class="meta-data-overlay-text">{{ image.type_of_image[0].text }}</div>
                                        </div>
                                        <img :src="`${image.iiif_file}/full/400,/0/default.jpg`" :alt="image.title"
                                            class="image-square-inner" />
                                    </a>
                                </div>
                            </div>
                        </div></td>
                    </tr>

                    <tr v-if="observations.length > 0">
                        <td>Observations</td>
                        <td><div v-for="(observation, index) in observations" :key="index"
                            class="image-placeholder observation-placeholder">
                            <div class="observation-title">
                                {{ observation.title }}
                            </div>
                            <div class="observation-date">
                                {{ observation.date }}
                            </div>
                            <div class="observation-body" v-html="observation.observation">
                            </div>
                        </div></td>
                    </tr>
                </table>

                <table class="content-table-date" v-else-if="sort == 'year'">
                    <tr v-for="[year, items] in sortedGroupedByYear" :key="year">
                        <td style="font-size:1.5em; font-weight:200; text-align:right;">{{ year }}</td>
                        <td><div v-for="(item, index) in items" :key="index"
                            :class="(isImage(item) || isPointcloud(item) || isMesh(item)) ? 'image-placeholder square' : ''">
                            <!-- If the item is an image -->
                            <div class="image-square" v-if="'iiif_file' in item">
                                <a v-if="item.iiif_file" :href="`https://etruscan.dh.gu.se/viewer/?q=${item.id}/image`" target="_blank">
                                    <div class="meta-data-overlay">
                                        <div class="meta-data-overlay-text">{{ item.title }}</div>
                                        <div class="meta-data-overlay-text">{{ item.type_of_image[0].text }}</div>
                                    </div>
                                    <img :src="`${item.iiif_file}/full/400,/0/default.jpg`" :alt="item.title"
                                    class="image-square-inner" />
                                </a>
                            </div>

                            <!-- If the item is an observation -->
                            <div v-else-if="isObservation(item)" class="image-placeholder observation-placeholder">
                                <div class="observation-title">
                                    {{ item.title }}
                                </div>
                                <div class="observation-date">
                                    {{ item.date }}
                                </div>
                                <div class="observation-body" v-html="item.observation">
                                </div>
                            </div>

                            <!-- If the item is a pointcloud -->
                            <a v-else-if="isPointcloud(item)"
                                :href="` https://etruscan.dh.gu.se/viewer/?q=${item.id}/pointcloud`" target="_blank">
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ item.title }}</div>
                                    <div class="meta-data-overlay-text">{{ item.technique ? item.technique.text : 'N/A' }}
                                    </div>
                                </div>
                                <img :src="`${item.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="item.title"
                                    class="image-square" />
                            </a>

                            <!-- If the item is a mesh -->
                            <a v-else-if="isMesh(item)" :href="`https://etruscan.dh.gu.se/viewer/?q=${item.id}/pointcloud`"
                                target="_blank">
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ item.title }}</div>
                                    <div class="meta-data-overlay-text">{{ item.technique ? item.technique.text : 'N/A' }}
                                    </div>
                                </div>
                                <img :src="`${item.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="item.title"
                                    class="image-square" />
                            </a>

                            <!-- If the item is an document -->
                            <a v-else-if="isDocument(item)" :href="item.upload" target="_blank" download>
                                <div class="image-placeholder document-placeholder">
                                    <div class="document-title">{{ item.title }}</div>
                                    <p class="documentlabel">{{ $t('type') }}:</p>
                                    <p class="documentdata theme-color-text">{{ item.type[0].text }}</p>
                                    <p class="documentlabel">{{ $t('size') }}:</p>
                                    <p class="documentdata theme-color-text">{{ item.size }} MB</p>
                                    <p class="documentlabel">{{ $t('published') }}:</p>
                                    <p class="documentdata theme-color-text">{{ item.date }}</p>
                                </div>
                            </a>
                        </div></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <MapComponent />
</template>
    
<style scoped>
.main-container {
    background-color: rgba(232, 228, 217, 0.5) !important;
    backdrop-filter: blur(10px) saturate(50%) brightness(100%);
}

.sort{
margin-left:130px;
}
.show-button {
    color: white;
    height: auto;
    border-radius: 4px;
    padding: 2px 8px;
    background-color: transparent;
    float: right;
    font-size: 0.9em;
    margin-top: 5px;
    transition: all 0.2s ease-in-out;
    min-width:60px;
}

.show-button:hover {
    background-color: var(--theme-4) !important;
    transform: scale(1.05);
}

/* unvisited link */
a:link {
    font-weight: normal !important;
}

/* visited link */
a:visited {
    font-weight: normal !important;
}

/* mouse over link */
a:hover {}

/* selected link */
a:active {}

.content-table td {
    color: black;
}

/* hides the zoom controls for the background map*/
#app .ol-zoom-in {
    display: none !important;
}

#app .ol-zoom-out {
    display: none !important;
}

.gallery__item {
    width: 200px;
    margin-bottom: 10px;
}

.plan-gallery__item {
    width: 200px;
    margin-bottom: 10px;
}


@media screen and (max-width: 900px) {

    #app .maijn-container{
    padding:0px!important;
}
#app .place-gallery-container{
    padding:0px!important;
    margin-left:0px;
}
#app .place-view{
    width:100%!important;
    padding-top:20px!important;
    margin-left:0px!important;
    padding-bottom:100px;
}

.sort{
margin-left:20px;
}

.square
{
  width:120px;  
  height:120px;  
}

.placeview-masonry-gallery
{
  width:100%;  
}
.document-placeholder
{
max-width:90%;
}
.documentlabel{
    display:none;
}
.documentdata{
    display:none;
}

.observation-placeholder{
    max-width:90%;
}
}
</style>
    