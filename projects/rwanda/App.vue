<script lang="ts" setup>
import { provide } from "vue";
import config from "./settings/config";
import Footer from './Footer.vue';
import { DianaClient } from "@/assets/diana";
import Grid from "./Grid.vue";

const endpoint = new DianaClient("rwanda");

provide("config", config);
provide("diana", endpoint);
</script>

<template>
     <Footer />
     <RouterView/>
</template>
<style>

/* Project theme in regards to colour and fonts */

:root {
  --theme-1: rgb(200,200,200);
  --theme-2: rgb(200, 60, 60);
  --theme-3: rgb(180, 40, 40);
}

html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color:var(--theme-1)!important;
}

.main-title {
  font-family: 'Teko', sans-serif;
  font-size:5.5vw;
  line-height: 0.8;
  font-weight: 600;
  color:var(--theme-2);
  margin-top:1vh;

}

.about {
  padding-right: 25px;
  line-height: 1.3;
  text-align: left;
  margin-top:15px;
}

.about-button {
  font-size:1.0vw!important
}

#app .left-pane {
  font-size:1.2em;
  background: url("./images/gradient.png");
  background-size: contain;
  min-width:900px!important;
  pointer-events: none!important;
  user-select: none!important;
}



.left-pane-layer {
  padding: 0px 380px 0px 0px !important;
  pointer-events: none!important;
  user-select: none!important;
}

.left-pane-content {

  pointer-events: none!important;
  user-select: none!important;
}

#app .mapview-preview {
  height: 100vh !important;
  pointer-events: auto !important;
  overflow-y: scroll !important;
  width: 100%;
  color: white;
  transition: all 0.5s ease-in-out;
  backdrop-filter: blur(7px);
}

.close-button {
  width: 40px;
  height: 40px;
  margin-left: 0px;
  margin-top: -15px;
  padding: 16px 15px 10px 9px;
  line-height: 1px;
  font-size: 50px;
  font-weight: 100;
  border-radius: 50%;
  background-color: var(--theme-2);
  color: white;
  transform: rotate(45deg);
  cursor: pointer;
  pointer-events: auto;
  margin-bottom: 0px;
}

#app .ol-zoom-in {
  left: calc(50% + 0px) !important;


}

#app .ol-zoom-out {
  left: calc(50% + 50px);


}

.close-button:hover {
  background-color: var(--theme-3);
}

.main-filters .category-button {
    background-color: white!important;
    color: black!important;
    border-radius: 4px;
    padding:5px 20px!important;
    margin-top:3px!important;
}

.dropdown{
  margin-top:0px;
  background-color: var(--theme-2);
  color:white!important;
  pointer-events: auto!important;
  user-select: auto!important;
}

.main-filters .category-button:hover {
  background-color: var(--theme-3)!important;
  color:white!important;
}

.main-filters .category-button.active{
  background-color: var(--theme-2)!important;
  color:white!important;
}

@media (max-width: 900px) {

#app .main-title {
  font-weight: 600 !important;
  font-size: 60px !important;
  width: auto !important;

}

#app .about-button {
  font-size: 16px !important;
  color:black!important;
}

.main-filters .category-button {
    color: rgb(71, 85, 105);
    border-radius: 4px;
    background-color:rgb(235,235,235)!important;
    padding:3px 20px!important;
}



.left-pane-layer {
 
}

}

@media screen and (min-width: 1900px) {



#app .filter-container {
  height:auto!important;

}
} 

</style>
