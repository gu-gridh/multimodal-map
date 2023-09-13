<script lang="ts" setup>
import { provide } from "vue";
import config from "./config";
import Footer from './Footer.vue';
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("jubileum");

provide("config", config);
provide("diana", endpoint);
</script>

<template>
      <Footer />
  <router-view />
</template>

<style>
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color:rgb(232,228,217)!important;
}

.map-container {
  height: calc(100vh - 80px) !important;

}

.theme-color {
  color:rgb(180,100,100);
}

.main-title {
  font-family: 'Teko', sans-serif;
  font-size: 100px;
  line-height: 0.7;
  font-weight:300;
  letter-spacing:0.05rem;
  color:rgb(180,100,100);
  margin-left:-10px;
}

#app .left-pane {
  background-color: grey;
  width: 900px;
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
  z-index:500;
}
#app .right-pane {
  width: 550px;
  right:0px;
  overflow:auto!important;
  -ms-overflow-style: none!important;
  scrollbar-width: none!important;
}

#app .right-pane::-webkit-scrollbar {
    width: 0 !important
    }

@media screen and (max-width: 1800px) {
#app .right-pane {
  width: 500px;
}
}

@media screen and (max-width: 1700px) {
#app .right-pane {
  width: 450px;
}
}


@media screen and (max-width: 1200px) {
#app .right-pane {
width: 400px!important;
}

#app .image-container {
  height:40vh!important;
  border-radius:0px!important;
  margin-bottom: 0px!important;
}

.ui-overlay {
 

}
}

@media screen and (max-width: 900px) {
#app .right-pane {
width: 100%!important;
}

#app .place-card {
margin-top:15px;
}

.ui-overlay {
margin-top: 25px !important;
margin-left:0px !important;
font-size:120% !important;
}

#app .masonry-grid {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%; /* Make the grid height responsive */
  z-index: 200;
  background-color: rgb(234, 228, 219);
  padding: 0px 0px 230px 00px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-template-rows: masonry;
  grid-gap: 5px;
  overflow-y: scroll;
}
}

#app .mapview-preview {
  height: 100vh !important;
  width: 100%;
}

.close-button {
  width: 40px;
  height: 40px;
  margin-left: -10px;
  margin-top: -5px;
  padding: 16px 15px 10px 9px;
  line-height: 1px;
  font-size: 50px;
  font-weight: 100;
  border-radius: 50%;
  background-color: rgb(100, 100, 100);
  color: white;
  transform: rotate(45deg);
  cursor: pointer;
  pointer-events: auto;
  margin-bottom: 30px;
}

.close-button:hover {
  background-color: rgb(140, 140, 140);
}

.theme-button{
  background-color: rgb(180, 100, 100);
  border-radius:5px;
  padding:5px 10px;
  color:white;
}



#app .ol-zoom-in {
  left: calc(50% + 50px) !important;
  top: calc(100vh - 140px)!important;
  position: fixed;
  border-radius: 10px 0px 0px 10px!important;
  height:35px;
  padding-bottom:3px!important;
  width:50px;
}

#app  .ol-zoom-out {
  left: calc(50% + 100px);
  top: calc(100vh - 140px);
  position: fixed;
  margin-top: 1px;
  border-radius: 0px 10px 10px 0px!important;
  height:35px;
  padding-bottom:3px!important;
  widtH:50px;
}

#app .ol-control button:active,
#app .ol-control button:hover,
#app .ol-control button:focus {
  background-color: rgba(0, 0, 0, 0.7)!important;
}

@media screen and (min-width: 1900px) {

  #app .right-pane {
    font-size:120%;
  width: 600px!important;
}


#app .ui-overlay {
  font-size:130%!important;
  margin-top:20px !important;
}
}


</style>
