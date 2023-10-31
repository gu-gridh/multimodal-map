<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
import type { DianaClient } from "@/assets/diana";
import PlaceViewCard from "./PlaceViewCard.vue";
import MapComponent from "@/components/MapComponent.vue";
import i18n from '../../src/translations/etruscan';

const sort = ref('type');
const groupedByYear = ref<{ [year: string]: (Image | Observation | Document | Pointcloud | Mesh)[] }>({});
const { id } = defineProps<{ id: string; }>();
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>([]);
const plans = ref<Image[]>([]);

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

onMounted(async () => {
    if (id) {
        const [fetchedImages, fetchedObservations, fetchedDocuments, fetchedPointclouds, fetchedMeshes, fetchedPlans] = await Promise.all([
            diana.listAll<Image>("image", { tomb: id, type_of_image: 2, depth: 2 }),
            diana.listAll<Observation>("observation", { place: id }),
            diana.listAll<Document>("document", { place: id, depth: 2 }),
            diana.listAll<Pointcloud>("objectpointcloud", { tomb: id, depth: 2 }),
            diana.listAll<Mesh>("object3dhop", { tomb: id, depth: 2 }),
            fetch('https://diana.dh.gu.se/api/etruscantombs/image/?tomb=' + id + '&type_of_image=1&type_of_image=5&depth=2').then(res => res.json())
        ]);

        images.value = fetchedImages.filter(image => image.published);
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
    var url = "https://diana.dh.gu.se/admin/etruscantombs/place/" + id;
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
            <PlaceViewCard :id="id" />

        </div>
        <!-- Here we will show info of the place -->
        <div class="place-view">
            <div class="place-gallery-container">
                <!-- Gallery of objects will show here with the ability to sort by TYPE of object -->
                <!-- <p>ID: {{ id }}</p> -->
                <!-- <p>PLACE: {{ place.id }}</p> -->
                <div>
                    <select v-model="sort" class="dropdown">
                        <option actve value="type">{{ $t('sortbytype') }}</option>
                        <option value="year">{{ $t('sortbyyear') }}</option>
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
                        <td>{{ $t('plans') }}</td>
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

                        <td><a :href="`https://diana.dh.gu.se/admin/etruscantombs/image/?q=${id}`">{{ $t('photographs') }}</a></td>

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
    