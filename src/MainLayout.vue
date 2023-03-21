<template>
  <div class="map-container h-full">
        <div class="left-pane">
        <slot name="title">
           <!--<div v-if="config" class="px-8 py-6 bg-white rounded-t-lg shadow-lg">-->
            <div v-if="config" class="py-1">
            <div
              class="main-title"
              v-html="config.name"
            ></div>
          </div>
        </slot>

        <slot name="about">
           <!--<div v-if="config" class="px-8 py-6 bg-white rounded-b-lg shadow-lg">-->
            <div v-if="config" class="py-5">
            <p class="" v-html="config.about"></p>
          </div>
          <div class="p-1 px-2 clickable category-button" style="width:90px; text-align:center; margin-top:-10px; cursor:pointer;">Learn more... </div>
        </slot>

        <slot name="search"></slot>
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

    <slot name="background">
      <MapComponent />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import MapComponent from "./components/MapComponent.vue";
import type { Project } from "./types/project";

const config = inject<Project>("config");
</script>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0 !important;
}

#app {
  height: inherit;
  width: inherit;
  /* display: flex !important; */
}

.map-container {
  height: inherit;
  width: inherit;
}

.close-button{
  width:40px;
  height:40px;
  padding:16px 15px 10px 9px;
  line-height:1.0px;
  font-size:50px;
  font-weight:100;
  border-radius:50%;
  background-color:rgb(100,100,100);
  color:white;
  transform: rotate(45deg);
cursor:pointer;
margin-bottom:30px;
}

.close-button:hover{

  background-color:rgb(40,40,40);

}

.left-pane{
  position:absolute;
  height:100vh;
  background-color:grey;
  background: linear-gradient(90deg, rgba(213,213,213,1) 0%, rgba(213,213,213,1) 30%, rgba(213,213,213,0.9) 50%, rgba(213,213,213,0) 99%);
  width:700px;
  z-index:100;
  padding:60px 250px 50px 60px;
  pointer-events: none;
}

.right-pane{
  position:absolute;
  height:100vh;
  width:350px;
  right:0px;
  pointer-events: none;
  z-index:100;
  transition: all 0.5s ease-in-out;
}

.detail-view{
  height:100vh;
  background-color:white;
  width:100%;

  transition: all 0.5s ease-in-out;
}

@media screen and (max-width: 1200px) {
  .right-pane{

  width:250px;
  z-index:100;
}
.detail-view{
  padding:0px;
}
}


</style>
