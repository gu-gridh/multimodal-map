<script setup lang="ts">
import type { Place } from './types';
import type { DianaClient } from "@/assets/diana"
import { inject } from "vue"

defineProps<{
        place: Place;
        id: number;
    }>();

    const capitalize = (word: String) => {
      const first = word[0].toUpperCase()
      const rest = word.slice(1)
      return first + rest
    }

    //check if data is missing - TODO


</script>

<template>

<div class="meta-top-gradient"> </div>
  <div class="meta-container">
    <header class="flex flex-row-reverse pt-8">
      <div class="flex-1"></div>
      <div class="container">
        <slot name="title">
          <h1 class="meta-title"></h1>
        </slot>
      </div>
      <div class="flex-1 text-center">
        <!-- TODO -->
        <!-- <router-link to="back" class="back-button"> </router-link> -->
      </div>
    </header>

   
      <div class="place-card">
        <div class="place-card-content"> 
        <div class="mini-map">  </div>
        <div class="metadata-content"> 
      <h1>{{ capitalize(place.properties.type.text) }}</h1>
      <div class="meta-item">{{ capitalize(place.properties.description) }}</div>
      <div class="meta-item"> {{place.properties.is_existing ? 'Existing' : 'Non-existing'}} - {{ place.properties.is_iconic ? 'Iconic' : 'Not iconic'}} - {{ place.properties.is_private ? 'Private' : 'Public'}}</div>
      <div class="meta-item" v-if="place.properties.parent_place !== null">
        <a :href="place.properties.parent_place.id">
        <div class="category-button">
          Parent place
        </div>
      </a>
    </div>
       
    <div style="margin-top:30px;">
        <div  v-for="name in place.properties.names">
        <div  v-if="name !== null || undefined">
        
          <div class="meta-item"  v-if="name.languages && name.languages.length > 0"><div class="lang">{{ name.languages[0].abbreviation }}</div> <div class="long-name" style="font-weight:600;" v-if="name.text">{{ name.text }}</div></div>      
    
        <div style="width:100%; float:left; margin-bottom:30px; padding-left:45px;">
          <div class="meta-item" v-if="name.period !== null">Period: {{ name.period.start_year }} - {{ name.period.end_year }}. {{ capitalize(name.period.text) }}</div>
              <div class="meta-item" v-if="name.informants && name.informants.length > 0">Informant: <span v-for="informant in name.informants">{{ name.informants[0].custom_id }}. {{ name.informants[0].note }}</span></div>
                <div class="meta-item" v-if="name.referent">Comment: {{ name.referent.comment }}</div>
                  <div class="meta-item" v-if="name.note">Note: {{ name.note }}</div>
        </div>
      </div>  
      </div>
      </div>
    </div>
    </div>
      </div>
  


  </div>



</template>

<style>
body{
  background-color:rgb(45,45,45);
}

.place-card {
  margin-top:60px;
  color:black;
  background-color: white;
  font-size: 1.0em;
  padding: 0px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.0s ease-in-out;
  max-height:calc(100vh - 250px);
  overflow:hidden;
  overflow-y:auto;
  margin-bottom: 10px;
  border-radius: 10px !important;
}

.place-card:hover {
transform:scale(1.0);
}

.place-card-content {
height:auto;

}

.place-card-content h1{
font-size:2.5em;
color:rgb(180,100,100);

}

.place-card-content .metadata-content{
padding:20px 30px 30px 30px;
}

.place-card .category-button{
width:110px!important;
padding:4px 18px;
margin-bottom:20px;

}

.mini-map{
  width:100%;
  height:250px;
  background-color:grey;
  margin-bottom:0px;
 
}

.back-button {
  left: 20px;
  top: 40px;
  background: url(@/assets/backbutton.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
}

.metadata {
  background-color: transparent !important;
  overflow:hidden !important;
  width: 550px !important;
}

.meta-item {
margin-bottom:5px;
}


.meta-top-gradient{
 background: transparent;
}


</style>