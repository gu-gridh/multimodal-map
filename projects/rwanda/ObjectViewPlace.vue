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
padding-right:0px !important;
padding-left:0px !important;
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
overflow:hidden;
margin-bottom: 0px;
border-radius: 30px 30px 0px 0px !important;
}

.mini-map{
  width:100%;
  height:250px;
  background-color:grey;
  margin-bottom:0px;
}

.back-button {
  left: 30px;
  top: -47vh;
  margin-top: 1px;
  background: url(@/assets/backbutton.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
}
}

</style>