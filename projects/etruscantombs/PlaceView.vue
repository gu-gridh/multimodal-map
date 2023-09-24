<script setup lang="ts">
import { ref, defineProps, onMounted, inject } from 'vue';
import type { Image, Observation } from './types';
import type { DianaClient } from "@/assets/diana";
import PlaceViewCard from "./PlaceViewCard.vue";

const sort = ref('type');
const groupedByYear = ref<{ [year: string]: (Image | Observation)[] }>({});
const { id } = defineProps<{ id: number; }>();
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>([]);
const plans = ref<Image[]>([]);
let observations = ref<Observation[]>([]);
let place = ref();

//Blank squares
const imageArray = ref([
    { src: '', alt: '' },
    { src: '', alt: '' },
]);

onMounted(async () => {
    if (id) {
        images.value = await diana.listAll<Image>("image", { tomb: id, type_of_image: 2 });
        observations.value = await diana.listAll<Observation>("observation", { place: id });
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
        groupAndSortByYear([...images.value, ...plans.value, ...observations.value]);
    }
});

function groupAndSortByYear(allItems: (Image | Observation)[]) {
  // Group items by year
  allItems.forEach((item) => {
    const year = item.date;
    if (!groupedByYear.value[year]) {
      groupedByYear.value[year] = [];
    }
    groupedByYear.value[year].push(item);
  });

  // Sort grouped items by date
  const sortedGroupedByYear = Object.keys(groupedByYear.value)
    .sort()
    .reduce<{ [year: string]: (Image | Observation)[] }>((acc, key) => {
        acc[key] = groupedByYear.value[key];
        return acc;
    }, {});

  groupedByYear.value = sortedGroupedByYear;
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
                    <tr>
                        <td>Documents</td>
                        <div v-for="(image, index) in imageArray" :key="index"
                            class="image-placeholder document-placeholder">
                            <!-- Get this one from backend, title of document -->
                            <div class="document-title">The Chamber Tomb Survey of San Giovenale in 1971</div>

                            <!-- Get these ones from backend, type of text: report, survey etcetera -->
                            <p> Type: Report </p>
                            <p>Size: 1.9 mb </p>
                        </div>
                    </tr>
                    <tr>
                        <td>3D Models</td>
                        <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder">

                            <div class="meta-data-overlay"><div class="meta-data-overlay-text">{{image.title}}</div></div>
                            <img :src="image.src" :alt="image.alt" class="image-square" />
                        
                        </div>
                    </tr>
                    <tr v-if="plans.length > 0">
                        <td>Plans</td>
                        <div v-for="(image, index) in plans" :key="index" class="image-placeholder plan-placeholder">
                         
                            <router-link :to="`/detail/image/${image.id}`">
                                <div class="meta-data-overlay"><div class="meta-data-overlay-text">{{image.title}}</div></div>
                                <img :src="`${image.iiif_file}/full/500,/0/default.jpg`" :alt="image.title"
                                    class="image-square-plan" />
                            </router-link>
                        </div>
                    </tr>
                    <tr v-if="images.length > 0">
                        <td>Photos</td>
                        <div v-for="(image, index) in images" :key="index" class="image-placeholder">
                           
                            <router-link :to="`/detail/image/${image.id}`">
                                <div class="meta-data-overlay"><div class="meta-data-overlay-text">{{image.title}}</div></div>
                                <img :src="`${image.iiif_file}/full/500,/0/default.jpg`" :alt="image.title"
                                    class="image-square" />
                            </router-link>
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
                            <div class="observation-body">
                                {{ observation.description }}
                            </div>
                        </div>
                    </tr>
                </table>

                <table class="content-table-date" v-else-if="sort == 'year'">
                    <tr v-for="(items, year) in groupedByYear" :key="year">
                        <td>{{ year }}</td>
                       
                            <div v-for="(item, index) in items" :key="index"
                                :class="[item.iiif_file ? 'image-placeholder' : 'image-placeholder observation-placeholder']">
                                <!-- If the item is an image -->
                               
                                <router-link v-if="item.iiif_file" :to="`/detail/image/${item.id}`">
                                    <div class="meta-data-overlay"><div class="meta-data-overlay-text">{{item.title}}</div></div>
                                    <img :src="`${item.iiif_file}/full/500,/0/default.jpg`" :alt="item.title" class="image-square" />
                                  
                                </router-link>

                                <!-- If the item is an observation -->
                                <div v-else-if="item.title" class="observation-content">
                                    <div class="observation-title">
                                        {{ item.title }}
                                    </div>
                                    <div class="observation-date">
                                        {{ item.date }}
                                    </div>
                                    <div class="observation-body">
                                        {{ item.description }}
                                    </div>
                                </div>
                            </div>
                       
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
    
<style scoped>

table td{
    width:110px!important;
}
.main-container {
    display: flex;
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
}

.place-card-container {
    background-color: transparent !important;
    flex: 0 0 40%;
    /* Take up exactly 40% of the space */
    max-width: 600px;
    min-width: 500px;
    height: 100vh !important;
}

.place-view {
    background-color: transparent !important;
    color: black;
    flex: 1;
    /* Take up the remaining space */
    padding-top: 20px;
    overflow-y: auto;
    /* Enable vertical scrolling */
}

.place-gallery-container {
    flex: 1;
    padding: 10px 30px 100px 0px;
}

.dropdown {
    color: white;
    border-radius: 5px;
    background-color: rgb(180, 100, 100);
    padding: 3px 10px;
    padding-right: 30px;
    margin-left: 110px;
    margin-bottom: 10px;
    width: auto;
    height: 32px;
    background-image: url("/dropdown-arrow.png");
    background-size: 15px;
    background-repeat: no-repeat;
    background-position: 90px 10px;
    -webkit-appearance: none;
}

.dropdown:hover {
    background-color: rgb(160, 80, 80);
}

.dropdown:focus {
    outline: none;
    outline-color: rgb(140, 60, 60) !important;
}

.content-table td {
    padding: 15px;
    padding-top: 2px;
    padding-right: 25px;
    vertical-align: top;
    text-align: right;
}

.content-table-date td {
    padding: 15px;
    padding-top: 2px;
    padding-right: 25px;
    vertical-align: top;
}



.image-placeholder {
    width: 200px;
    height: 200px;
    background-color: #eee;
    border-radius:4px;
    margin: 8px 16px 8px 0px;
    display: inline-block;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    background-color: white;
}



.document-placeholder {
    width: 416px;
    height: 60px;
    background-image: url("/file.png");
    background-size: 44px;
    background-repeat: no-repeat;
    background-position: 8px;
    background-color: white;
    padding: 11px 10px 5px 55px;
}

.document-placeholder p {
    line-height: 1.0;
    display: inline;
    margin-right: 30px;
}

.document-title {
    color: rgb(180, 100, 100);
    font-weight: 500;
    height: 18px;
    overflow: hidden;
    width: 100%;
    line-height: 1.0;
}

.observation-placeholder {
    width: 416px;
    height: 200px;
    border-radius: 8px;
    padding: 0px;
    background-color: white;
    cursor: auto;
}

.observation-title {
    color: rgb(180, 100, 100);
    font-size: 1.4em;
    font-weight: 500;
    float: left;
    padding: 10px 10px 10px 20px;
}

.observation-date {
    color: rgb(180, 100, 100);
    font-size: 1.1em;
    float: right;
    padding: 15px 20px 10px 20px;
}

.observation-body {
    width: 100%;
    float: left;
    font-size: 1.1em;
    border-style: dotted;
    border-color: rgb(180, 100, 100);
    border-width: 1.3px 0 0px 0;
    padding: 10px 10px 10px 20px;
}

.image-square {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-square-plan {
    width: 100%;
    height: 100%;
    padding: 10px;
    object-fit: contain;
    background-color: white;
}

.image-placeholder img {
    transform: scale(1.05);
    transition: all 0.2s ease-in-out;
}

.image-placeholder:hover {
    transform: scale(1.03);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.12);
}

.image-placeholder:hover img {
    transform: scale(1.1);
}

.image-placeholder .meta-data-overlay{
    pointer-events:none;
    position:relative;
    margin-top:-150px;
    bottom:-200px;
    opacity:0.0;
    z-index:10;
    padding:0px;
    height:150px;
    width:100%;
    color:white;
    background: linear-gradient(rgba(0, 0, 0, 0.0) 50%, rgba(0, 0, 0, 0.5) 100%);  
    transition: all 0.5s ease-in-out;
}

.meta-data-overlay .meta-data-overlay-text{
    position:absolute;
    bottom: 0px;
    padding-bottom:10px;
    padding-left:15px;
    transition: all 0.5s ease-in-out;
    opacity:1.0;
}

.plan-placeholder .meta-data-overlay{
    color:black;
   background: linear-gradient(rgba(255, 255, 255, 0.0) 50%, rgba(255, 255, 255, 0.8) 100%);  
    transition: all 0.5s ease-in-out;
}

.image-placeholder:hover .meta-data-overlay {
    opacity:1.0;
}


@media screen and (max-width: 900px) {


    /* Overwrites the body-container in MainLayout.vue */
    #app html,
    body {
        height: auto !important;
        overflow: auto !important;
    }


    #app .main-container {
        position: relative !important;
        display: block !important;
        height: 100vh !important;
        overflow-y: scroll !important;
        background-color: transparent !important;
        color: black !important;
    }

    .place-card-container {
        position: relative !important;
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
        height: auto !important;
    }

    #app .place-view {
        display: block;
        position: relative !important;
        color: black !important;
        width: calc(100% - 40px) !important;
        height: auto !important;
        margin-left: 20px !important;
        margin-top: 0px !important;
        padding-top: 50px !important;
        background-color: white !important;
    }

    .place-gallery-container {
        color: black;
        overflow: hidden;
        position: relative;
        float: left;
    }
}</style>
    