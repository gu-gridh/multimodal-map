<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
import type { DianaClient } from "@/assets/diana";
import PlaceViewCard from "./PlaceViewCard.vue";

const sort = ref('type');
const groupedByYear = ref<{ [year: string]: (Image | Observation | Document | Pointcloud | Mesh )[] }>({});
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

onMounted(async () => {
    if (id) {
        images.value = await diana.listAll<Image>("image", { tomb: id, type_of_image: 2 });
        observations.value = await diana.listAll<Observation>("observation", { place: id });
        documents.value = await diana.listAll<Document>("document", { place: id, depth: 2 });
        pointcloud.value = await diana.listAll<Pointcloud>("objectpointcloud", { tomb: id, depth: 2});
        mesh.value = await diana.listAll<Mesh>("object3dhop", { tomb: id, depth: 2});
        
        //fetch for sections and plans
        const url = 'https://diana.dh.gu.se/api/etruscantombs/image/?tomb=' + id + '&type_of_image=1&type_of_image=5';
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            plans.value = data.results;
        } else {
            console.error(`Failed to fetch data: ${response.statusText}`);
        }

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

</script>
    
<template>
    <div class="main-container">
        <div class="place-card-container">
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
                        <option actve value="type">Sort by: TYPE</option>
                        <option value="year">Sort by: YEAR</option>
                    </select>
                </div>
                <!-- Sort by TYPE table-->
                <table class="content-table" v-if="sort == 'type'">
                    <tr v-if="documents.length > 0">
                        <td>Documents</td>
                        <a v-for="(document, index) in documents" :key="index" :href="document.upload" target="_blank" download>
                            <div class="image-placeholder document-placeholder">
                                <div class="document-title">{{document.title}}</div>
                                <p>Type: {{document.type[0].text}}</p>
                                <p>Size: {{document.size}} MB</p>
                                <p>Published: {{document.date}}</p>
                            </div>
                        </a>
                    </tr>

                    <tr v-if="combined3DModels.length > 0">
                        <td>3D Models</td>
                        <div v-for="(model, index) in combined3DModels" :key="index" class="image-placeholder">
                            <a 
                            v-if="model.modelType === 'mesh'" 
                            :href="`https://modelviewer.dh.gu.se/mesh/?q=${model.id}`" 
                            target="_blank"
                            >
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ model.title }}</div>
                                    <div class="meta-data-overlay-text">{{ model.technique ? model.technique.text : 'N/A' }}</div>
                                </div>
                                <img :src="`${model.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="model.title" class="image-square" />
                            </a>
                            <a 
                            v-else-if="model.modelType === 'pointcloud'" 
                            :href="`https://modelviewer.dh.gu.se/pointcloud/?q=${model.id}`" 
                            target="_blank"
                            >
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ model.title }}</div>
                                    <div class="meta-data-overlay-text">{{ model.technique ? model.technique.text : 'N/A' }}</div>
                                </div>
                                <img :src="`${model.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="model.title" class="image-square" />
                            </a>
                        </div>
                    </tr>
                
                    <tr v-if="plans.length > 0">
                        <td>Plans</td>
                        <div v-for="(image, index) in plans" :key="index" class="image-placeholder plan-placeholder">
                            <div class="image-square" v-if="'iiif_file' in image">
                                <router-link :to="`/detail/image/${image.id}`">
                                    <div class="meta-data-overlay"><div class="meta-data-overlay-text">{{image.title}}</div>
                                </div>
                                    <img :src="`${image.iiif_file}/full/400,/0/default.jpg`" :alt="image.title"
                                        class="image-square-plan" />
                                </router-link>
                            </div>
                        </div>
                    </tr>
                    <tr v-if="images.length > 0">
                        <td>Photos</td>
                        <div v-for="(image, index) in images" :key="index" class="image-placeholder">
                            <div class="image-square" v-if="'iiif_file' in image">
                                <router-link :to="`/detail/image/${image.id}`">
                                    <div class="meta-data-overlay"><div class="meta-data-overlay-text">{{image.title}}</div></div>
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
                            <div class="observation-body" 
                                v-html="observation.observation">
                            </div>
                        </div>
                    </tr>
                </table>

                <table class="content-table-date" v-else-if="sort == 'year'">
                    <tr v-for="[year, items] in sortedGroupedByYear" :key="year">
                        <td style="font-size:1.5em; font-weight:200; text-align:right;">{{ year }}</td>
                       
                            <div v-for="(item, index) in items" :key="index" :class="(isImage(item) || isPointcloud(item) || isMesh(item)) ? 'image-placeholder' : ''">
                                <!-- If the item is an image -->
                                 <div class="image-square" v-if="'iiif_file' in item">
                                    <router-link v-if="item.iiif_file" :to="`/detail/image/${item.id}`">
                                        <div class="meta-data-overlay"><div class="meta-data-overlay-text">{{item.title}}</div></div>
                                        <img :src="`${item.iiif_file}/full/400,/0/default.jpg`" :alt="item.title" class="image-square-inner"/>
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
                                     <div class="observation-body" 
                                        v-html="item.observation">
                                    </div>
                                </div>

                                 <!-- If the item is a pointcloud -->
                                <a 
                                    v-else-if="isPointcloud(item)" 
                                    :href="`https://modelviewer.dh.gu.se/pointcloud/?q=${item.id}`" 
                                    target="_blank"
                                >
                                    <div class="meta-data-overlay">
                                        <div class="meta-data-overlay-text">{{ item.title }}</div>
                                        <div class="meta-data-overlay-text">{{ item.technique ? item.technique.text : 'N/A' }}</div> 
                                    </div>
                                    <img :src="`${item.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="item.title" class="image-square" />
                                </a>

                                 <!-- If the item is a mesh -->
                                <a 
                                    v-else-if="isMesh(item)" 
                                    :href="`https://modelviewer.dh.gu.se/mesh/?q=${item.id}`" 
                                    target="_blank"
                                >
                                    <div class="meta-data-overlay">
                                        <div class="meta-data-overlay-text">{{item.title}}</div>
                                        <div class="meta-data-overlay-text">{{ item.technique ? item.technique.text : 'N/A' }}</div>
                                    </div>
                                    <img :src="`${item.preview_image.iiif_file}/full/400,/0/default.jpg`" :alt="item.title" class="image-square" />
                                </a>

                                 <!-- If the item is an document -->
                                <a v-else-if="isDocument(item)" :href="item.upload" target="_blank" download>
                                    <div class="image-placeholder document-placeholder">
                                        <div class="document-title">{{item.title}}</div>
                                        <p>Type: {{item.type[0].text}}</p>
                                        <p>Size: {{item.size}} MB</p>
                                        <p>Published: {{item.date}}</p>
                                    </div>
                                </a>
                            </div>
                       
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
    
<style scoped>
</style>
    