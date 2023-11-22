<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
import type { DianaClient } from "@/assets/diana";
import { storeToRefs } from "pinia";
import PlaceViewCard from "./PlaceViewCard.vue";
import MapComponent from "@/components/MapComponent.vue";
import i18n from '../../src/translations/etruscan';
import { etruscanStore } from "./store";
import { useRoute } from 'vue-router';
import apiConfig from "./apiConfig";

const sort = ref('type');
const etruscan = etruscanStore();
const { placeId } = storeToRefs(etruscanStore());
const groupedByYear = ref<{ [year: string]: (Image | Observation | Document | Pointcloud | Mesh)[] }>({});
const id = computed(() => etruscan.placeId);
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>([]);
const plans = ref<Image[]>([]);
const route = useRoute();
const nextPageUrl = ref<string | null>(null);
const hasMoreImages = ref(true);
const isLoading = ref(false);

let observations = ref<Observation[]>([]);
let documents = ref<Document[]>([]);
let pointcloud = ref<Pointcloud[]>([]);
let mesh = ref<Mesh[]>([]);
let place = ref();

const combined3DModels = computed(() => [
    ...mesh.value.map(m => ({ ...m, modelType: 'mesh' })),
    ...pointcloud.value.map(p => ({ ...p, modelType: 'pointcloud' }))
]);

const sortedGroupedByYear = computed(() => {
    return Object.entries(groupedByYear.value)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
});

function isImage(item: any): item is Image {
    return 'iiif_file' in item;
}

function isObservation(item: any): item is Observation {
    return 'observation' in item;
}

function isPointcloud(item: any): item is Pointcloud {
    return 'camera_position' in item;
}

function isMesh(item: any): item is Mesh {
    return 'triangles_optimized' in item;
}

function isDocument(item: any): item is Mesh {
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
        const response = await fetch(nextPageUrl.value);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        nextPageUrl.value = data.next && data.next.startsWith('http://')
            ? data.next.replace('http://', 'https://')
            : data.next;

        hasMoreImages.value = !!data.next;

        const newImages = data.results.filter((image: Image) => image.published);
        images.value = [...images.value, ...newImages];

        // Now update the grouped and sorted items
        groupAndSortByYear([...images.value, ...plans.value, ...observations.value, ...documents.value, ...pointcloud.value, ...mesh.value]);
    } catch (error) {
        console.error("Failed to fetch more images:", error);
    }
    finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    const urlId = route.params.name;

    // Check if placeId is undefined or null and fetch for the id based on the name
    if (etruscan.placeId === null || etruscan.placeId === undefined) {
        const response = await fetch(`${apiConfig.PLACE}?name=${urlId}`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            etruscan.placeId = data.features[0].id;
        }
    }

    if (id) {
        const [fetchedImages, fetchedObservations, fetchedDocuments, fetchedPointclouds, fetchedMeshes, fetchedPlans] = await Promise.all([
            fetch(`${apiConfig.IMAGE}?tomb=${id.value}&limit=5&type_of_image=2&depth=2`).then(res => res.json()),
            diana.listAll<Observation>("observation", { place: id.value }),
            diana.listAll<Document>("document", { place: id.value, depth: 2 }),
            diana.listAll<Pointcloud>("objectpointcloud", { tomb: id.value, depth: 2 }),
            diana.listAll<Mesh>("object3dhop", { tomb: id.value, depth: 2 }),
            fetch(`${apiConfig.IMAGE}?tomb=${id.value}&type_of_image=1&type_of_image=5&depth=2`).then(res => res.json())
        ]);

        images.value = fetchedImages.results.filter((image: Image) => image.published);
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
});

function groupAndSortByYear(allItems: (Image | Observation | Document | Pointcloud | Mesh)[]) {
    // Reset groupedByYear
    groupedByYear.value = {};

    // Group items by year
    allItems.forEach((item: Image | Observation | Document | Pointcloud | Mesh) => {
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
                    <select v-model="sort" class="dropdown theme-color-background" style="margin-left:130px;">
                        <option active value="type">{{ $t('sortbytype') }}</option>
                        <option value="year">{{ $t('sortbyyear') }}</option>
                    </select>
                </div>

                <div>
                    <select class="dropdown theme-color-background">
                        <option value="All datasets">All datasets</option>
                        <option value="CTSG-2015">CTSG-2015</option>
                    </select>
                </div>

                <!-- Sort by TYPE table-->
                <table class="content-table" v-if="sort == 'type'">
                    <tr v-if="documents.length > 0">
                        <td>{{ $t('documents') }}</td>
                        <a v-for="(document, index) in documents" :key="index" :href="document.upload" target="_blank"
                            download>
                            <div class="image-placeholder document-placeholder">
                                <div class="document-title">{{ document.title }}</div>
                                <p class="documentlabel">{{ $t('type') }}:</p>
                                <p class="documentdata theme-color-text">{{ document.type[0].text }}</p>
                                <p class="documentlabel">{{ $t('size') }}:</p>
                                <p class="documentdata theme-color-text">{{ document.size }} MB</p>
                                <p class="documentlabel">{{ $t('published') }}:</p>
                                <p class="documentdata theme-color-text">{{ document.date }}</p>
                            </div>
                        </a>
                    </tr>

                    <tr v-if="combined3DModels.length > 0">
                        <td>{{ $t('threedmodels') }}</td>
                        <div v-for="(model, index) in combined3DModels" :key="index" class="image-placeholder">
                            <a v-if="model.modelType === 'mesh'" :href="`https://modelviewer.dh.gu.se/mesh/?q=${model.id}`"
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
                                :href="`https://modelviewer.dh.gu.se/pointcloud/?q=${model.id}`" target="_blank">
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ model.title }}</div>
                                    <div class="meta-data-overlay-text">{{ model.technique ? model.technique.text : 'N/A' }}
                                    </div>
                                </div>
                                <img :src="`${model.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="model.title"
                                    class="image-square" />
                            </a>
                        </div>
                    </tr>

                    <tr v-if="plans.length > 0">
                        <td>{{ $t('drawings') }}</td>
                        <div v-for="(image, index) in plans" :key="index" class="image-placeholder plan-placeholder">
                            <div class="image-square" v-if="'iiif_file' in image">
                                <router-link :to="`/detail/image/${image.id}`">
                                    <div class="meta-data-overlay">
                                        <div class="meta-data-overlay-text">{{ image.title }}</div>
                                        <div class="meta-data-overlay-text">  {{ image.type_of_image[0].text }}</div>
                                    </div>
                                    <img :src="`${image.iiif_file}/full/400,/0/default.jpg`" :alt="image.title"
                                        class="image-square-plan" />
                                </router-link>
                            </div>
                        </div>
                    </tr>
                    <tr v-if="images.length > 0">
                        <td>
                            <a :href="`${apiConfig.ADMIN_IMAGE}?q=${route.params.name}`">
                                {{ $t('photographs') }}
                            </a>
                            <button class="show-button theme-color-background" v-if="nextPageUrl" @click="fetchMoreImages" :disabled="isLoading">Show all</button>
                        </td>
                        <div v-for="(image, index) in images" :key="index" class="image-placeholder">
                            <div class="image-square" v-if="'iiif_file' in image">
                                <router-link :to="`/detail/image/${image.id}`">
                                    <div class="meta-data-overlay">
                                        <div class="meta-data-overlay-text">{{ image.title }}</div>
                                        <div class="meta-data-overlay-text">{{ image.type_of_image[0].text }}</div>
                                    </div>
                                    <img :src="`${image.iiif_file}/full/400,/0/default.jpg`" :alt="image.title"
                                        class="image-square-inner" />
                                </router-link>
                            </div>
                        </div>
                        

                        <div>
                                                    </div>
                    </tr>

                    <tr v-if="observations.length > 0">
                        <td>Observations</td>
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
                    </tr>
                </table>

                <table class="content-table-date" v-else-if="sort == 'year'">
                    <tr v-for="[year, items] in sortedGroupedByYear" :key="year">
                        <td style="font-size:1.5em; font-weight:200; text-align:right;">{{ year }}</td>

                        <div v-for="(item, index) in items" :key="index"
                            :class="(isImage(item) || isPointcloud(item) || isMesh(item)) ? 'image-placeholder' : ''">
                            <!-- If the item is an image -->
                            <div class="image-square" v-if="'iiif_file' in item">
                                <router-link v-if="item.iiif_file" :to="`/detail/image/${item.id}`">
                                    <div class="meta-data-overlay">
                                        <div class="meta-data-overlay-text">{{ item.title }}</div>
                                        <div class="meta-data-overlay-text">{{ item.type_of_image[0].text }}</div>
                                    </div>
                                    <img :src="`${item.iiif_file}/full/400,/0/default.jpg`" :alt="item.title"
                                        class="image-square-inner" />
                                </router-link>
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
                                :href="`https://modelviewer.dh.gu.se/pointcloud/?q=${item.id}`" target="_blank">
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ item.title }}</div>
                                    <div class="meta-data-overlay-text">{{ item.technique ? item.technique.text : 'N/A' }}
                                    </div>
                                </div>
                                <img :src="`${item.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="item.title"
                                    class="image-square" />
                            </a>

                            <!-- If the item is a mesh -->
                            <a v-else-if="isMesh(item)" :href="`https://modelviewer.dh.gu.se/mesh/?q=${item.id}`"
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
                        </div>
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

.show-button{
    color:white;
    height:auto;
    border-radius:4px;
    padding:2px 8px;
    background-color:transparent;
    float:right;
    font-size:0.9em;
}

.show-button:hover{
    background-color: var(--theme-4) !important;
}

/* unvisited link */
a:link {
    font-weight:normal !important;
}

/* visited link */
a:visited {
  font-weight:normal !important;
}

/* mouse over link */
a:hover {

}

/* selected link */
a:active {

}
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
</style>
    