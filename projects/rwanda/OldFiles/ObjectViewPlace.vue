<script setup lang="ts">
import type { Place } from './types';
import ObjectViewPlaceCard from "./ObjectViewPlaceCard.vue"
import ObjectViewPlaceCardGallery from './ObjectViewPlaceCardGallery.vue';

    defineProps<{
        place: Place;
        id: number;
    }>();

</script>

<template>
    <div class="place-card-container">
        <ObjectViewPlaceCard :place="place" :id="id" />
    </div>
    <!-- gallery here -->
    <div class="place-gallery-container">
        <ObjectViewPlaceCardGallery :id="id"/>
    </div>
</template>

<style>

.place-card-container{
    background-color: transparent !important; 
    overflow:hidden !important; 
    width:600px!important;
    float: left;
}

@media screen and (max-width: 900px) {

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