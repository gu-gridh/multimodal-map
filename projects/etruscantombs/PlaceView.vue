<script setup lang="ts">
import { ref, defineProps, onMounted, inject } from 'vue';
import type { Image } from './types';
import type { DianaClient } from "@/assets/diana";
import PlaceViewCard from "./PlaceViewCard.vue";

const sort = ref('type');
const { id } = defineProps<{ id: number; }>();
const diana = inject("diana") as DianaClient;
const images = ref<Image[]>([]);
const plans = ref<Image[]>([]);
let place = ref();

//Blank squares
const imageArray = ref([
  { src: '', alt: '' },
  { src: '', alt: '' },
]);

onMounted(async () => {
  if (id) {
    images.value = await diana.listAll<Image>("image", { tomb: id, type_of_image: 2 });
    plans.value = await diana.listAll<Image>("image", { tomb: id, type_of_image: 1 });
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
                           <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder document-placeholder">
                             <!-- Get this one from backend, title of document -->   
                             <div class="document-title">The Chamber Tomb Survey of San Giovenale in 1971</div>
                          
                             <!-- Get these ones from backend, type of text: report, survey etcetera -->
                            <p> Type: Report </p> <p>Size: 1.9 mb </p>
                            </div>
                    </tr>
                    <tr>
                        <td>3D Models</td>
                        <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder">
                            <img :src="image.src" :alt="image.alt" class="image-square" />
                        </div>
                    </tr>
                    <tr>
                        <td>Photos</td>
                        <div v-for="(image, index) in images" :key="index" class="image-placeholder">
                            <router-link :to="`/detail/image/${image.id}`">
                                <img :src="`${image.iiif_file}/full/500,/0/default.jpg`" :alt="image.title" class="image-square" />
                            </router-link>
                        </div>
                    </tr>
                  
                    <tr>
                        <td>Plans</td>
                        <div v-for="(image, index) in plans" :key="index" class="image-placeholder">
                            <router-link :to="`/detail/image/${image.id}`">
                                <img :src="`${image.iiif_file}/full/500,/0/default.jpg`" :alt="image.title" class="image-square" />
                            </router-link>
                        </div>
                    </tr>
                    <tr>
                        <td>Observations</td>
                        <div v-for="(image, index) in imageArray" :key="index" class="image-placeholder observation-placeholder">
                            
                                <div class="observation-title">
                                <!-- Get this one from backend -->
                                Type of Observation
                            </div>
                               <div class="observation-date">
                                 <!-- Get this one from backend -->
                                Date
                            </div>
                            <div class="observation-body">
                                 <!-- Get this one from backend -->
                               Observation description 
                            </div>
                        </div>
                    </tr>
                </table>

                <!-- TODO Sort by year-table -->
            </div>
        </div>
    </div>
</template>

<style scoped>

.main-container {
    display: flex;
    flex-direction: row;
    height: 100vh; 
    overflow: hidden; 
}

.place-card-container{
    background-color: transparent !important; 
    flex: 0 0 40%; /* Take up exactly 40% of the space */
    max-width:600px;
    min-width:500px;
    height:100vh!important; 
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
    padding: 10px 30px 100px 10px;
}

.dropdown {
    color: white;
    border-radius:5px;
    background-color:rgb(180,100,100);
    padding:3px 10px;
    padding-right:30px;
    margin-left:108px;
    margin-bottom:10px;
    width:auto;
    height:32px;
    background-image:url("/dropdown-arrow.png");
    background-size:15px;
    background-repeat:no-repeat;
    background-position:90px 10px;
    -webkit-appearance: none;
}

.dropdown:hover {
    
    
    background-color:rgb(160,80,80);
    
}

.dropdown:focus {
    outline: none;
    outline-color: rgb(140,60,60) !important;
      }

.content-table td {
    padding: 15px;
    padding-top: 2px;
    text-align:right;
    vertical-align: top;
}


.image-placeholder {
    width: 200px; 
    height: 200px;
    background-color: #eee; 
    margin: 8px;
    border-radius:3px;
    display: inline-block; 
    overflow:hidden;
    transition: all 0.2s ease-in-out;
    cursor:pointer;
}

.document-placeholder {
    width: 416px; 
    height: 60px;
    background-image:url("/file.png");
    background-size:44px;
    background-repeat:no-repeat;
    background-position: 8px;
    padding:11px 10px 5px 55px;
}

.document-placeholder p {
line-height:1.0;
display:inline;
margin-right:30px;
}

.document-title{
color:rgb(180,100,100);
font-weight:500;
height:18px;
overflow:hidden;
width:100%;
line-height:1.0;
}

.observation-placeholder {
    width: 416px; 
    height: 200px;
    border-radius:8px;
    padding:0px;
}

.observation-title{
    color:rgb(180,100,100);
    font-size:1.4em;
    font-weight:500;
    float:left;
    padding:10px 10px 10px 20px;
}

.observation-date{
    color:rgb(180,100,100);
    font-size:1.1em;
    float:right;
    padding:15px 20px 10px 20px;
}

.observation-body{
    width:100%;
    float:left;
    font-size:1.1em;
    border-style: dotted;
    border-color:rgb(180,100,100);
    border-width:1.3px 0 0px 0;
    padding:10px 10px 10px 20px;
}


.image-square {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-square-plan {
    width: 100%;
    height: 100%;
    object-fit: contain; 
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
  transform: scale(1.1)
}


@media screen and (max-width: 900px) {


/* Overwrites the body-container in MainLayout.vue */
#app html,
body {
height: auto !important;
overflow: auto !important;
}


#app .main-container {
    position:relative!important; 
    display: block!important; 
    height: 100vh!important;
    overflow-y: scroll!important; 
    background-color: transparent!important; 
    color:black!important;
}

.place-card-container{
    position:relative!important; 
    display: block!important; 
    width:100%!important; 
    max-width:100%!important; 
    min-width:100%!important; 
    height:auto !important;
}

#app .place-view {
    display:block;
    position:relative !important;
    color: black !important;
    width:calc(100% - 40px) !important;
    height:auto!important;
    margin-left:20px!important;
    margin-top:0px!important;
    padding-top:50px!important;
    background-color:white!important;
}

.place-gallery-container {
    color: black;
    overflow:hidden;
    position:relative;
    float:left;
}   
}
</style>
