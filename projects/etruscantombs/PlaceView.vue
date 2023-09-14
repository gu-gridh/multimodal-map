<script setup lang="ts">
import { ref, defineProps, onMounted, inject } from 'vue';
import type { Image } from './types';
import type { DianaClient } from "@/assets/diana";
import PlaceViewCard from "./PlaceViewCard.vue";

const sort = ref('type');
const { id } = defineProps<{ id: number; }>();
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>([]);
let place = ref();

//Blank squares
const imageArray = ref([
  { src: '', alt: 'Image 1' },
  { src: '', alt: 'Image 2' },
  { src: '', alt: 'Image 3' },
  { src: '', alt: 'Image 4' },
  { src: '', alt: 'Image 5' },
]);

onMounted(async () => {
  if (id) {
    images.value = await diana.listAll<Image>("image", { place: id });
  }
});
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
                           <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder">
                                <img :src="image.src" :alt="image.alt" class="image-square" />
                            </div>
                    </tr>
                    <tr>
                        <td>3D Models</td>
                        <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder">
                            <img :src="image.src" :alt="image.alt" class="image-square" />
                        </div>
                    </tr>
                    <tr>
                        <td>Plans</td>
                        <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder">
                            <img :src="image.src" :alt="image.alt" class="image-square" />
                        </div>
                    </tr>
                    <tr>
                        <td>Photos</td>
                         <div v-for="(image, index) in images" :key="index" class="image-placeholder">
                            <img :src="`${image.iiif_file}/full/500,/0/default.jpg`" :alt="image.title" class="image-square" />
                        </div>
                    </tr>
                    <tr>
                        <td>Observations</td>
                        <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder">
                            <img :src="image.src" :alt="image.alt" class="image-square" />
                        </div>
                    </tr>
                </table>

                <!-- TODO Sort by year-table -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.content-table td {
    vertical-align: top;
}

.image-placeholder {
    width: 200px; 
    height: 200px;
    background-color: #eee; 
    margin: 10px;
    display: inline-block; 
}

.image-square {
    width: 100%;
    height: 100%;
    object-fit: cover; 
}

.main-container {
    display: flex;
    flex-direction: row;
    height: 100vh; 
    overflow: hidden; 
}

.place-card-container{
    background-color: transparent !important; 
    flex: 0 0 40%; /* Take up exactly 40% of the space */
}

.place-view {
    background-color: transparent !important;
    color: black;
    flex: 1;  /* Take up the remaining space */
    padding-top: 20px;
    overflow-y: auto; /* Enable vertical scrolling */
}

.place-gallery-container {
    flex: 1;
    padding: 30px;
}

.dropdown {
    color: white;
    border-radius:5px;
    background-color:rgb(180,100,100);
    padding:3px 10px;
    margin-left:-0px;
    width:auto;
    height:32px;
    background-image:none;
    -webkit-appearance: none;
}

.dropdown:focus {
    outline: none;
    outline-color: rgb(140,60,60) !important;
      }

.content-table td {
    padding: 15px;
    text-align:right;
}


.place-card-wrapper {
    width: 40%;
    overflow: hidden;
}

.place-view-wrapper {
    width: 60%;
    overflow: auto;
    padding: 20px;
}

@media screen and (max-width: 900px) {
.main-container {
    flex-direction: column;
}

.place-card-wrapper, .place-view-wrapper {
    width: 100%;
}
/* Overwrites the body-container in MainLayout.vue */
html,
body {
height: auto;
overflow: auto !important;
}

/* Overwrites the place-meta-container in MainLayout.vue */
#app .place-meta-container {
position:absolute;
margin-top:50vh;
height:auto;
font-size:120%;
width:100%;
z-index:100;
padding-right:0px !important;
padding-left:0px !important;
padding-bottom:0px !important;
overflow-y:auto;
}

.place-gallery-container {
    color: white;
    width: 100%;
    float: left;
}   

}
</style>
