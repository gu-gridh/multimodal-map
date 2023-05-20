<script setup lang="ts">
import type { Place } from './types';
import ObjectViewPlaceCard from "./ObjectViewPlaceCard.vue"

    defineProps<{
        place: Place;
        id: number;
    }>();

</script>

<template>
    <div class="metadata">
        <ObjectViewPlaceCard :place="place" :id="id" />
    </div>
    <!-- gallery here -->
</template>

<style>

@media screen and (max-width: 900px) {

/* Overwrites the body-container in MainLayout.vue */
html,
body {
height: auto;
overflow: auto !important;
}

/* Overwrites the meeta-container in MainLayout.vue */
#app .meta-container {
position:absolute;
margin-top:45vh;
height:auto;
font-size:120%;
width:100%;
padding-right:0px;
padding-left:0px;
padding-bottom:0px !important;
overflow-y:auto;
}

.place-card-full {
margin-top:0px;
color:black;
background-color: white;
padding-bottom: 30px;
box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
transition: all 0.0s ease-in-out;
max-height:10000px;
overflow:auto;
margin-bottom: 0px;
border-radius: 30px 30px 0px 0px !important;
}
}

</style>