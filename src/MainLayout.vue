<template>
  <div class="map-container h-full">
    <div class="left-pane">
      <div class="left-pane-layer">
        <div class="left-pane-content">
          <div class="mobile-ui-drag">
          </div>
          <slot name="title">
            <!--<div v-if="config" class="px-8 py-6 bg-white rounded-t-lg shadow-lg">-->
            <div v-if="config" class="py-1">
              <div class="main-title" v-html="config.title"></div>
              <div class="sub-title" v-html="config.subtitle"></div>
            </div>
          </slot>

          <slot name="about">

            
            <div class="py-2 about">
              <p class="" v-html="config.about"></p>
            </div>
            
          </slot>

          <slot name="search"></slot>

          

        </div>
      </div>
    </div>
    
    <div class="right-pane">
      <slot name="details">
        <div class="col-start-6 col-span-2 detail">
          <div class="bg-black rounded-lg shadow-lg mb-4 mx-12 detail">
            <div class="px-8 py-6">
              <div>
                Here you'll find more information and media on the selected
                location.
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>
    <div class="atlas">
    
    <slot name="background">
      <MapComponent />
    </slot>
    <div class="atlas-gradient"></div>
  </div>
 
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import MapComponent from "./components/MapComponent.vue";
import type { Project } from "./types/project";

const config = inject("config") as Project;
</script>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
  overflow: hidden !important;
}

#app {
  height: inherit;
  width: inherit;
  /* display: flex !important; */
}
.atlas {
  position:absolute;
  width:100%;
  height:100vh;
}

.mobile-ui-drag{
  display:none;
}

.about {
  line-height: 1.2;
  margin-bottom: 10px;
}

.map-container {
  height: inherit;
  width: inherit;
}

.left-pane {
  position: absolute;
  height: 100vh;
  z-index: 100;
  pointer-events: none;
}

.right-pane {
  position: absolute;
  height: 100vh;
  width: 350px;
  right: 0px;
  pointer-events: none;
  z-index: 200;
  transition: all 0.5s ease-in-out;
  overflow: hidden !important;
}

.detail-view {
  padding-top: 5px;
  width: 100%;
  transition: all 0.5s ease-in-out;
}



/* Adaption for various screen sizes */

@media screen and (min-width: 1600px) {
  #app .about-main-title {
    font-size:140px;
  }

  #app .article{
column-gap:30px;
width:1200px;
font-size:1.6em;
}
}



@media screen and (max-width: 1200px) {
  .right-pane {
    width: 250px;
    z-index: 100;
  }
  .detail-view {
    padding: 0px;
  }
}


@media screen and (max-width: 900px) {
 #app .left-pane {
  position: relative;
  float:left;
  height:auto;
  z-index: 500;
  width:100%;
  pointer-events: auto;
  margin-top:70vh;
  border-radius:25px 25px 0 0;
  padding: 30px 30px 60px 30px;
  background-color:rgba(255,255,255,0.8);
  backdrop-filter:blur(5px);
  box-shadow: 0px -10px 20px 0 rgba(0, 0, 0, 0.3),
    0 0px 0px 0 rgba(0, 0, 0, 0.19);
}

#app .map-container {
overflow-y:auto;
width:100%;
height:calc(100vh) !important;
}

body {
  height: 100vh;
  width: 100vw;
}

.atlas {
  height: 120vh;
  float:left;
  width: calc(100% - 0px);
  position:absolute;
  overflow:hidden;
  margin-top: 0px;
}

.atlas-gradient {
  height: 300px;
  width: 100%;
  position:absolute;
  background: linear-gradient(0deg, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%);
bottom: 100px;
  z-index:100;
}

#app .right-pane {
  float:left;
  height: 100vh;
  width: 100%;
  left: 0px;

}

#app .detail-view {
  width: 100%;
  overflow:hidden;
 padding-top:30px;
 padding-bottom:35vh !important;
 
}

#app .image-card {
  width: auto;
  
  border-radius: 10px;
  margin-right: 25px;
  padding: 20px;
  margin-bottom: 20px;
}

.mobile-ui-drag{
display:block;
width:60px;
height:8px;
border-radius:4px;
border-color:grey;
border-width:0.5px 0.5px 0px 0.5px;
border-style:solid;
margin-left:auto;
margin-right:auto;
margin-bottom:25px;
margin-top:-15px;
box-shadow: inset 0px 2px 2px 0 rgba(0, 0, 0, 0.2),
    0 0px 0px 0 rgba(0, 0, 0, 0.19);
}

.mobile-ui-drag:hover{
box-shadow: inset 0px 2px 2px 0 rgba(0, 0, 0, 0.3),
    0 0px 0px 0 rgba(0, 0, 0, 0.19);
}

.main-title {
  width:100%;
  font-size: 73px;
  margin-left:0px;
}

.sub-title {
  font-size: 55px;
  margin-left:0px;
}

#app .image-container {
  overflow: hidden;
  border-radius:8px;
  width: 100%;
  height:auto;
  margin-left:auto;
  margin-right:auto;
  transition: all 0.2s ease-in-out;
}

#app .image {
  display: block;
  object-fit: cover;
  height: 100%;
  width:100%;
  margin-top: -20px;
}

#app .image-container:hover {
  transform:scale(1.0);
}

#app #footer {
  height: 0px;
}

#app .about-main-title {
    font-size:75px;
    width:100%;
    margin-left:0px;
  }

  #app .article{
columns:1;
width:1200px;
text-align:left;
margin-top:30px;
font-size:1.5em;
}

#app .about-container {
  position:fixed;
  color: white;
  line-height: 1;
  height: calc(100% - 0px);
  width: 100%;
  padding:80px 40px;

}

#app .illustration {
  position:absolute;
  height:60vh;
  width: 100%;

}

#app .meta-container {
position:absolute;
margin-top:60vh;
height:40vh;
width:100%;
padding-right:20px;
overflow-y:auto;
}

#app .metadata {
  float: left;
  width:100%;
}

#app .meta-title {
  width: auto;
}

#app #ToolbarVertical {

  top: 15px;
}
}

@media screen and (max-width: 400px) {
  .left-pane{
    padding: 30px 10px 30px 10px;
  }
  .main-title {
  width:100%;
  font-size: 60px;
  margin-left: 0px;
}
.sub-title {
  font-size: 50px;
  margin-left: 0px;
}
}

@media screen and (max-width: 350px) {
  .left-pane{
    padding: 30px 10px 30px 10px;
  }
  .main-title {
  width:100%;
  font-size: 50px;
  margin-left: 0px;
}
.sub-title {
  font-size: 40px;
  margin-left: 0px;
}
}
</style>
