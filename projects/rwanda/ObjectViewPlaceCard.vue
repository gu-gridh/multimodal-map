<script setup lang="ts">
import type { Place } from './types';
import type { DianaClient } from "@/assets/diana"
import { inject, ref } from "vue"

defineProps<{
        place: Place;
        id: number;
    }>();

    const capitalize = (word: String) => {
      const first = word[0].toUpperCase()
      const rest = word.slice(1)
      return first + rest
    }

    const center = ref([30.0636, -1.9520]);
    const projection = ref("EPSG:4326");
    const zoom = ref(15);
    const rotation = ref(0);
    const strokeWidth = ref(5);
    const strokeColor = ref("red");

    //check if data is missing - TODO


</script>

<template>


  <div class="meta-container">

    <header class="flex flex-row-reverse pt-8">
      <div class="flex-1"></div>
      <div class="container">
      </div>
      <div class="flex-1 text-center">
        <!-- TODO -->
        <!-- <router-link to="back" class="back-button"> </router-link> -->
      </div>
    </header>

      <div class="place-card-full">
        <div class="place-card-content">
          <!-- mini map -->
        <div class="mini-map">
          <ol-map 
          :loadTilesWhileAnimating="true"
          :loadTilesWhileInteracting="true"
          style="height:200px"
          >
            <ol-view
              ref="view"
              :center="place.geometry.coordinates[0][0]"
              :rotation="rotation"
              :zoom="zoom"
              :projection="projection"
            />
            <ol-tile-layer>
              <ol-source-osm />
            </ol-tile-layer>
            <ol-vector-layer>
            <ol-source-vector>
              <ol-feature>
                <ol-geom-line-string
                  :coordinates="place.geometry.coordinates[0]"
                ></ol-geom-line-string>
                <ol-style>
                  <ol-style-stroke
                    :color="strokeColor"
                    :width="strokeWidth"
                  ></ol-style-stroke>
                </ol-style>
              </ol-feature>
            </ol-source-vector>
          </ol-vector-layer>
          </ol-map>
        </div>
        <!-- meta-data -->
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

.meta-container{
  overflow-y: auto;
  height:calc(100vh - 80px);
  padding-bottom:30px;
  padding-left:45px;
  padding-right:20px;
}

#app .metadata {
  background-color: transparent !important;
  overflow:hidden !important;
  width: 550px !important;
  background-color:red;
}

.place-card-full {
  margin-top:80px;
  color:black;
  background-color: white;
  padding: 0px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.0s ease-in-out;
  max-height:calc(100vh - 240px);
  overflow:hidden;
  overflow-y:auto;
  margin-bottom: 10px;
  border-radius: 10px !important;
}

.lang{
  font-size: 14px;
}

.place-card-content {
height:auto;

}

.place-card-content h1{
font-size:2.5em;
color:rgb(180,100,100);
margin-bottom:5px;

}

.place-card-content .metadata-content{
padding:20px 30px 30px 30px;
line-height:1.2;
}

.place-card-full .category-button{
width:110px!important;
padding:4px 18px;
margin-top:15px;
margin-bottom:20px;

}

.mini-map{
  width:100%;
  height:200px;
  background-color:grey;
  margin-bottom:0px;

 
}

.meta-item {
margin-bottom:5px;
}
</style>