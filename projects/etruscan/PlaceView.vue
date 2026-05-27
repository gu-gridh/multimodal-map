<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import PlaceViewCard from "./PlaceViewCard.vue";
import MapComponent from "@/components/MapComponent.vue";
import i18n from '../../src/translations/etruscan';
import { etruscanStore } from "./settings/store";
import { useRoute } from 'vue-router';
import apiConfig from "./settings/apiConfig";
import Masonry from 'masonry-layout';
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
const selectedDatasetId = ref("");
const datasets = ref([]);

let observations = ref([]);
let documents = ref([]);
let pointcloud = ref([]);
let object3jsModels = ref([]);

const combined3DModels = computed(() => [
    ...pointcloud.value.map(p => ({ ...p, modelType: 'pointcloud' })),
    ...object3jsModels.value
]);

const sortedGroupedByYear = computed(() => {
    return Object.entries(groupedByYear.value)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
});

watch(() => sort.value, async () => {
    await loadContent();
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

function isObject3jsModel(item) {
    return item.modelType === 'object3js';
}

function isDocument(item) {
    return 'upload' in item;
}

function previewImageUrl(previewImage) {
    return previewImage ? `${previewImage}/full/250,/0/default.jpg` : null;
}

function getAspectStyle(image) {
    if (!image.width || !image.height) {
        return { aspectRatio: '1 / 1' };
    }

    return { aspectRatio: `${image.width} / ${image.height}` };
}

async function fetchDatasets() {
    try {
        const response = await fetch(apiConfig.DATASET);
        const data = await response.json();
        datasets.value = data.results?.filter(dataset => dataset.published) || [];
    } catch (error) {
        console.error(error);
    }
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

        groupAndSortByYear([...images.value, ...plans.value, ...observations.value, ...documents.value, ...pointcloud.value, ...object3jsModels.value]);

        await nextTick();
        await nextFrame();

        layoutMasonry(msnry.value);
    } catch (error) {
        console.error("Failed to fetch more images:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    await fetchDatasets();

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
    }

    await loadContent();
});

async function loadContent() {
    if (!id.value) return;

    const datasetParam = selectedDatasetId.value ? { dataset: selectedDatasetId.value } : {};
    const datasetQuery = selectedDatasetId.value ? `&dataset=${selectedDatasetId.value}` : "";
    const imageLimit = sort.value === 'year' ? 500 : 8;

    const [fetchedImages, fetchedObservations, fetchedDocuments, fetchedPointclouds, fetchedObject3jsModels, fetchedPlans] = await Promise.all
        ([
            fetch(`${apiConfig.IMAGE}?tomb=${id.value}&limit=${imageLimit}&type_of_image=2&depth=2${datasetQuery}`).then(res => res.json()),
            dianaClient.listAll("observation", { place: id.value, ...datasetParam }),
            dianaClient.listAll("document", { place: id.value, ...datasetParam }),
            dianaClient.listAll("objectpointcloud", { tomb: id.value, depth: 2, ...datasetParam }),
            fetch(`https://diana.dh.gu.se/api/etruscantombs/objecttexturedmesh/?tomb=${id.value}&depth=1${datasetQuery}`).then(res => res.json()),
            fetch(`${apiConfig.IMAGE}?tomb=${id.value}&type_of_image=1&type_of_image=5&depth=2${datasetQuery}`).then(res => res.json())
        ]);

    images.value = fetchedImages.results.filter((image) => image.published);
    nextPageUrl.value = fetchedImages.next && fetchedImages.next.startsWith('http://')
        ? fetchedImages.next.replace('http://', 'https://')
        : fetchedImages.next;
    hasMoreImages.value = !!fetchedImages.next;
    observations.value = fetchedObservations;
    documents.value = fetchedDocuments;
    pointcloud.value = fetchedPointclouds;
    object3jsModels.value = fetchedObject3jsModels.results
        .filter((model) => model.published)
        .map((model) => ({ ...model, modelType: 'object3js' }));
    plans.value = fetchedPlans.results;

    groupAndSortByYear([...images.value, ...plans.value, ...observations.value, ...documents.value, ...pointcloud.value, ...object3jsModels.value]);

    await nextTick();
    await initMasonry();
}

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
    window.open(url, "_top");
}

async function initMasonry() {
    await nextTick();
    await nextFrame();

    msnry.value?.destroy?.();
    plansMsnry.value?.destroy?.();
    msnry.value = null;
    plansMsnry.value = null;

    // Initialize Photograph Masonry
    const photoGallery = document.querySelector('.placeview-masonry-gallery');
    if (photoGallery) {
        msnry.value = new Masonry(photoGallery, {
            itemSelector: '.gallery__item',
            columnWidth: 87,
            gutter: 8,
            percentPosition: true,
        });
        layoutMasonry(msnry.value);
    }

    // Initialize Plans Masonry
    const plansGallery = document.querySelector('.plans-masonry-gallery');
    if (plansGallery) {
        plansMsnry.value = new Masonry(plansGallery, {
            itemSelector: '.plan-gallery__item',
            columnWidth: 87,
            gutter: 8,
            percentPosition: true,
        });
        layoutMasonry(plansMsnry.value);
    }
}

function layoutMasonry(instance) {
    instance?.reloadItems();
    instance?.layout();
}

function nextFrame() {
    return new Promise(resolve => {
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(resolve);
        } else {
            resolve();
        }
    });
}
</script>

<template>
    <div class="main-container">
        <div id="version"> {{ $t('versionnumb') }}</div>
        <div class="place-card-container">
            <div class="placeview-topbutton-container">
                <button @click="toggleLanguage">
                    <div class="p-1 px-2 clickable category-button about-button placeview-topbutton"
                        style="float:left;">
                        {{ $t('languagebutton') }}</div>
                </button>
                <button @click="createPlaceURL()">
                    <div class="p-1 px-2 clickable category-button about-button placeview-topbutton"
                        style="float:left;">
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
                <div>
                    <select v-model="sort" class="dropdown theme-color-background sort">
                        <option active value="type">{{ $t('sortbytype') }}</option>
                        <option value="year">{{ $t('sortbyyear') }}</option>
                    </select>
                </div>

                <div>
                    <select v-model="selectedDatasetId" class="dropdown theme-color-background" @change="loadContent">
                        <option value="">All datasets</option>
                        <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id.toString()">
                            {{ dataset.short_name }}
                        </option>
                    </select>
                </div>

                <!-- Sort by TYPE table-->
                <table class="content-table" v-if="sort == 'type'">
                    <tr v-if="documents.length > 0">
                        <td>
                            <div class="gallery-label">{{ $t('documents') }}</div>
                        </td>
                        <td>
                            <a v-for="(document, index) in documents" :key="index" :href="document.upload" target="_top"
                                download>
                                <div class="image-placeholder document-placeholder">
                                    <div class="document-title">{{ document.title }}</div>
                                    <p class="documentlabel">{{ $t('type') }}:</p>
                                    <p class="documentdata theme-color-text">{{ document.type_names[0] }}</p>
                                    <p class="documentlabel">{{ $t('size') }}:</p>
                                    <p class="documentdata theme-color-text">{{ document.size }} MB</p>
                                    <p class="documentlabel">{{ $t('date') }}:</p>
                                    <p class="documentdata theme-color-text">{{ document.date }}</p>
                                </div>
                            </a>
                        </td>
                    </tr>

                    <tr v-if="combined3DModels.length > 0">
                        <td>
                            <div class="gallery-label hexagon-adapted">{{ $t('threedmodels') }}</div>
                        </td>
                        <td>
                            <div v-for="(model, index) in combined3DModels" :key="index"
                                class="image-placeholder square hexagon">
                                <a v-if="model.modelType === 'pointcloud'"
                                    :href="`https://etruscan.dh.gu.se/viewer/?q=${model.id}/pointcloud`" target="_top">
                                    <div class="meta-data-overlay-center">
                                        <!--  <div class="meta-data-overlay-text"><b>{{ model.title }}</b></div> -->

                                        <div class="meta-data-overlay-text">
                                            <div class="meta-pellet">Pointcloud</div>
                                        </div>
                                    </div>
                                    <div class="pointcloud">
                                        <img v-if="previewImageUrl(model.preview_image)"
                                            :src="previewImageUrl(model.preview_image)" :alt="model.title"
                                            class="image-square" />
                                    </div>
                                </a>

                                <a v-else-if="model.modelType === 'object3js'" :href="`https://etruscan.dh.gu.se/viewer/?q=${model.id}/model`" target="_top">
                                    <div class="meta-data-overlay-center">


                                        <!--   <div class="meta-data-overlay-text"><b>{{ model.title }}</b></div> -->
                                        <div class="meta-data-overlay-text">
                                            <div class="meta-pellet">Textured mesh</div>
                                        </div>

                                    </div>
                                    <div class="mesh">
                                        <img v-if="previewImageUrl(model.preview_image)"
                                            :src="previewImageUrl(model.preview_image)" :alt="model.title"
                                            class="image-square" />
                                    </div>
                                </a>

                            </div>

                        </td>
                    </tr>

                    <tr v-if="plans.length > 0">
                        <td>
                            <div class="gallery-label">{{ $t('drawings') }}</div>
                        </td>
                        <td>
                            <div class="plans-masonry-gallery">
                                <div v-for="(image, index) in plans" :key="index" class="plan-gallery__item">
                                    <div class="masonry-image" v-if="'iiif_file' in image"
                                        :style="getAspectStyle(image)">
                                        <a :href="`https://etruscan.dh.gu.se/viewer/?q=${image.id}/image`"
                                            target="_top">
                                            <div class="meta-data-overlay">
                                                <div class="meta-data-overlay-text">{{ image.title }}</div>
                                                <div class="meta-data-overlay-text"> {{ image.type_of_image[0].text }}
                                                </div>
                                            </div>
                                            <img :src="`${image.iiif_file}/full/200,/0/default.jpg`" :alt="image.title"
                                                :width="image.width" :height="image.height" class="image-square-plan" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="images.length > 0">
                        <td>
                            <div class="gallery-label"
                                style="display:flex; flex-direction:column; align-items:flex-end; justify-content:right;">
                                <a :href="`${apiConfig.ADMIN_IMAGE}?q=${route.params.name}`">
                                    <div>{{ $t('photographs') }}</div>
                                </a>
                                <button class="show-button theme-color-background" v-if="nextPageUrl"
                                    @click="fetchMoreImages" :disabled="isLoading">
                                    {{ $t('showall') }}
                                </button>
                            </div>
                        </td>
                        <td>
                            <div class="placeview-masonry-gallery">
                                <div v-for="(image, index) in images" :key="index" class="gallery__item">
                                    <div class="masonry-image" v-if="'iiif_file' in image"
                                        :style="getAspectStyle(image)">
                                        <a :href="`https://etruscan.dh.gu.se/viewer/?q=${image.id}/image`"
                                            target="_top">
                                            <div class="meta-data-overlay">
                                                <div class="meta-data-overlay-text">{{ image.title }}</div>
                                                <div class="meta-data-overlay-text">{{ image.type_of_image[0].text }}
                                                </div>
                                            </div>
                                            <img :src="`${image.iiif_file}/full/200,/0/default.jpg`" :alt="image.title"
                                                :width="image.width" :height="image.height"
                                                class="image-square-inner" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="observations.length > 0">
                        <td>
                            <div class="gallery-label">{{ $t('observations') }}</div>
                        </td>
                        <td>
                            <div v-for="(observation, index) in observations" :key="index"
                                class="image-placeholder observation-placeholder">
                                <div class="observation-title">
                                    {{ observation.title }}
                                </div>
                                <div class="observation-date">
                                    {{ observation.date }}
                                </div>
                                <div class="observation-body" v-html="observation.observation">
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>

                <table class="content-table-date" v-else-if="sort == 'year'">
                    <tr v-for="[year, items] in sortedGroupedByYear" :key="year">
                        <td style="font-size:1.5em; font-weight:200; text-align:right;">{{ year }}</td>
                        <td>
                            <div v-for="(item, index) in items" :key="index"
                                :class="(isImage(item) || isPointcloud(item) || isObject3jsModel(item)) ? 'image-placeholder square' : ''">
                                <!-- If the item is an image -->
                                <div class="image-square" v-if="'iiif_file' in item">
                                    <a v-if="item.iiif_file"
                                        :href="`https://etruscan.dh.gu.se/viewer/?q=${item.id}/image`" target="_top">
                                        <div class="meta-data-overlay">
                                            <div class="meta-data-overlay-text">{{ item.title }}</div>
                                            <div class="meta-data-overlay-text">{{ item.type_of_image[0].text }}</div>
                                        </div>
                                        <img :src="`${item.iiif_file}/full/200,/0/default.jpg`" :alt="item.title"
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

                                <!-- If the item is a model -->
                                <a v-else-if="isObject3jsModel(item)" :href="`https://etruscan.dh.gu.se/viewer/?q=${item.id}/model`" target="_top">
                                    <div class="model-object">

                                        <img v-if="previewImageUrl(item.preview_image)"
                                            :src="previewImageUrl(item.preview_image)" :alt="item.title"
                                            class="image-square hexagon hexagon-small" />
                                    </div>
                                    <div class="meta-data-below-text">
                                        <div class="meta-pellet">Textured mesh</div>
                                    </div>
                                </a>

                                <!-- If the item is a pointcloud -->
                                <a v-else-if="isPointcloud(item)"
                                    :href="` https://etruscan.dh.gu.se/viewer/?q=${item.id}/pointcloud`" target="_top">
                                    <div class="model-object">

                                        <img v-if="previewImageUrl(item.preview_image)"
                                            :src="previewImageUrl(item.preview_image)" :alt="item.title"
                                            class="image-square hexagon hexagon-small" />
                                    </div>
                                    <div class="meta-data-below-text">
                                        <div class="meta-pellet">Pointcloud</div>
                                    </div>
                                </a>

                                <!-- If the item is an document -->
                                <a v-else-if="isDocument(item)" :href="item.upload" target="_top" download>
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
                            </div>
                        </td>
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

.sort {
    margin-left: 120px;
}

.show-button {
    color: white;
    height: auto;
    border-radius: 4px;
    padding: 1px 6px;
    background-color: transparent;
    float: right;
    font-size: 0.85em;
    margin-top: 5px;
    transition: all 0.2s ease-in-out;
    min-width: 10px;
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

.content-table td {
    color: black;
}

.content-table td .gallery-label {
    text-align: right;
    width: 75%;
    margin-top: 2px;
}

.content-table-date {
    table-layout: fixed;
}

.content-table-date td:first-child {
    width: 100px;
    min-width: 100px;
    padding-left: 0;
    padding-right: 20px;
}

.content-table-date td:nth-child(2) {
    width: calc(100% - 100px);
    padding-left: 0;
}

/* hide map zoom controls in placeview */
:deep(.ol-zoom) {
    display: none !important;
}

.gallery__item {
    width: 180px;
    margin-bottom: 10px;
    float: left;
}

.plan-gallery__item {
    width: 180px;
    margin-bottom: 10px;
    float: left;
}

.masonry-image {
    position: relative;
    width: 100%;
    background-color: rgba(232, 228, 217, 0.6);
    overflow: hidden;
}

.masonry-image a {
    display: block;
    height: 100%;
}

.masonry-image img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.masonry-image .meta-data-overlay {
    display: flex;
    flex-direction: column;
    justify-content: end;
    position: absolute;
    inset: 0;
    z-index: 2;
    bottom: 0px;
    opacity: 0.0;
    padding-bottom: 5px;
    background: rgba(0, 0, 0, 0.6);
    transition: all 0.2s ease-in-out;
    padding-bottom: 8px;
}

.masonry-image:hover .meta-data-overlay {
    opacity: 1.0;
}

.image-placeholder .meta-data-overlay {
    display: flex;
    flex-direction: column;
    justify-content: end;
    flex-wrap: nowrap;
    align-items: flex-start;
    opacity: 0.0;
    background: rgba(0, 0, 0, 0.6);
    transition: all 0.2s ease-in-out;
    padding-bottom: 8px;
}

.hexagon {
    clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
    background-color: rgb(180, 200, 180);
}

.heptagon {
    clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)
}

.hexagon-adapted {
    padding-top: 40px;
}

.hexagon-small {
    transform: scale(1.0);
    overflow: auto !important;
}

.model-object {
    width: 180px;
    height: 180px;
}

.meta-data-overlay-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0px;
    opacity: 0.0;
    z-index: 10;
    padding: 0px;
    height: 100%;
    width: 100%;
    color: white;
    background: rgba(0, 0, 0, 0.6);
    transition: all 0.2s ease-in-out;
}

.image-placeholder:hover .meta-data-overlay-center {
    opacity: 1.0;
}

.meta-data-overlay-year {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0px;
    opacity: 1.0;
    z-index: 10;
    padding: 0px;
    height: 100%;
    width: 100%;
    color: white;
}

.plan-placeholder .meta-data-overlay {
    color: black;
    background: linear-gradient(rgba(255, 255, 255, 0.0) 50%, rgba(255, 255, 255, 0.8) 100%);
    transition: all 0.2s ease-in-out;
}

.image-placeholder:hover .meta-data-overlay {
    opacity: 1.0;
}

.meta-data-overlay .meta-data-overlay-text {
    font-size: 0.8em;
    width: auto;
}

.meta-data-below-text {
    font-size: 1.0em;
    width: 180px;
    height: 180px;
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    margin-top: -180px;
    opacity: 0.0;
    background-color: rgb(0, 0, 0, 0.6);
    clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
    transition: all 0.2s ease-in-out;
    transform: scale(1.0);
}

.meta-data-below-text:hover {
    opacity: 1.0;
}

.meta-pellet {
    font-size: 0.9em;
    color: white;
}



.pointcloud {
    transform: scale(1.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0px;
     height:100%!important;
}

.mesh {
    transform: scale(1.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0px;
      height:100%!important;
        width:auto!important;
}

.hexagon img {
    opacity: 1;
    object-fit: cover;
}

@media screen and (max-width: 900px) {

    #app .maijn-container {
        padding: 0px !important;
    }

    #app .place-gallery-container {
        padding: 0px !important;
        margin-left: 0px;
    }

    #app .place-view {
        width: 100% !important;
        padding-top: 20px !important;
        margin-left: 0px !important;
        padding-bottom: 100px;
    }

    .sort {
        margin-left: 20px;
    }

    .square {
        width: 120px;
        height: 120px;
    }

    .placeview-masonry-gallery {
        width: 100%;
    }

    .document-placeholder {
        max-width: 90%;
    }

    .documentlabel {
        display: none;
    }

    .documentdata {
        display: none;
    }

    .observation-placeholder {
        max-width: 90%;
    }
}
</style>
