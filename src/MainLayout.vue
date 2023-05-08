<template>
  <div class="map-container h-full">
    <div class="left-pane">
      <div class="left-pane-layer">
        <div class="left-pane-content">
          <div class="mobile-ui">
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
  height: auto;
  z-index: 500;
  width:100%;
  pointer-events: auto;
  margin-top:70vh;
  border-radius:20px 20px 0 0;
  padding: 30px 10px 30px 40px;
  background-color:white;
  box-shadow: 0px -5px 10px 0 rgba(0, 0, 0, 0.2),
    0 0px 0px 0 rgba(0, 0, 0, 0.19);
}

#app .map-container {
overflow-y:auto;
width:100%;
height:calc(100vh - 0px) !important;
}

body {
  height: 100vh;
  width: 100vw;
}

.atlas {
  height: 100vh;
  float:left;
  width: calc(100% - 0px);
  position:absolute;
  overflow:hidden;
  margin-top: -50px;
}

#app .right-pane {
  float:left;
  height: 75vh;
  width: 100%;
  left: 0px;
}

#app .detail-view {
  width: 100%;
 padding-top:30px;
 padding-bottom:0px;
}

.mobile-ui{

}

.main-title {
  width:100%;
  font-size: 80px;
}

.sub-title {
  font-size: 55px;
}

#app .image-container {
  overflow: hidden;
  border-radius:8px;
  width: 100%;
  height: auto;
  margin-left:auto;
  margin-right:auto;
  transition: all 0.2s ease-in-out;
}

#app .image {
  display: block;
  object-fit: cover;
  height: 105%;
  width:100%;
  margin-top: -20px;
}

#app .image-container:hover {
  transform:scale(1.0);
}

#footer {
  height: 0px;
}
}
</style>
