<script setup lang="ts">
import type { Place } from './types';
import { ref, defineProps } from 'vue';
import PlaceViewCard from "./PlaceViewCard.vue"

const sort = ref('type')

const { id } = defineProps<{
    id: number;
}>();

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
                        <td>Content will link to pdf-viewer?</td>
                    </tr>
                    <tr>
                        <td>3D Models</td>
                        <td>Content will link to ModelView</td>
                    </tr>
                    <tr>
                        <td>Plans</td>
                        <td>Content</td>
                    </tr>
                    <tr>
                        <td>Photos</td>
                        <td>Content will link to ImageView</td>
                    </tr>
                    <tr>
                        <td>Observations</td>
                        <td>Content</td>
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
}

.place-card-container{
    background-color: transparent !important; 
    overflow:auto !important; 
    width:600px!important;
    flex-grow: 0;
}


.place-view {
    background-color: transparent !important;
    color: black;
    width: auto;
    flex-grow: 1;
    padding-top:20px;
}

.place-gallery-container {
    width:100%;
    float: left;
    padding:30px;
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
