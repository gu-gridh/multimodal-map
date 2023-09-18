<script setup lang="ts">
import router from './router'
import { ref, inject, onMounted, watchEffect} from "vue"
import markerIcon from "@/assets/marker-red.svg";

    const props = defineProps<{
        id: number;
    }>();

    const capitalize = (word: String) => {
      if (word !== '') {
        const first = word[0].toUpperCase()
        const rest = word.slice(1)
        return first + rest
      }
      else return word
    }

    const projection = ref("EPSG:4326");
    const zoom = ref(15);
    const rotation = ref(0);
    const strokeWidth = ref(5);
    const strokeColor = ref("red");
    const center = ref([11.999722, 42.224444])
    const minZoom = ref(12)

    const format = inject("ol-format");
    const geoJson = new format.GeoJSON();

    const url = "https://diana.dh.gu.se/api/etruscantombs/geojson/place/"+ props.id

    // watchEffect(async() => {
    //   const coords = props.place?.geometry.coordinates
    //   const feature = props.place?.geometry
    //   console.log(coords)
    //   await coords.forEach((coord: any) => {
    //     if(feature.type === 'MultiLineString' || 'Polygon') {
    //       center.value = JSON.parse(JSON.stringify(coord[0]))
    //     }
    //     if(feature.type === 'MultiPolygon') {
    //       center.value = JSON.parse(JSON.stringify(coord[0][0]))
    //     }
    //     if(feature.type === 'LineString') {
    //       center.value = JSON.parse(JSON.stringify(coord))
    //     }
    //     else {center.value = [30.05885, -1.94995 ]}
    //   });
    // })
   
</script>

<template>
   <button class="place-back-button" @click="router.push({path: '/'})"></button>
  <div class="place-meta-container">
   
      <div class="placecard-full">
   
        <div class="placecard-full-content">
        
          <!-- mini map -->
        <div class="mini-map">
          <ol-map 
            :loadTilesWhileAnimating="true"
            :loadTilesWhileInteracting="true"
            style="height:300px"
          >
            <ol-view
              ref="view"
              :center="center"
              :rotation="rotation"
              :zoom="zoom"
              :projection="projection"
              :minZoom="minZoom"
            />
            <ol-tile-layer>
              <ol-source-osm />
            </ol-tile-layer>

            <ol-vector-layer>
              <ol-source-vector :url="url" :format="geoJson">
              </ol-source-vector>
              <ol-style>
                <ol-style-icon 
                :src="markerIcon" 
                :scale="1.8" 
                :displacement="[-10, 45]"
                :anchor="[0.0, 0.0]"></ol-style-icon>
              </ol-style>
            </ol-vector-layer>
          </ol-map>
        </div>
        <div class="placecard-text">
          <div class="placecard-title">Title of place</div> 
          <div class="placecard-subtitle">Other title of place</div>       
  
          <div class="placecard-metadata-content">
            <div class="metadata-item">
              <div class="label">Necropolis:</div>
              <div class="tag">Grotte Tufarina</div>
            </div>
            <div class="metadata-item">
              <div class="label">Type:</div>
              <div class="tag">Tumulus</div>
            </div>
            <div class="metadata-item">
              <div class="label">Chambers:</div>
              <div class="tag">1</div>
            </div>
            <div class="metadata-item">
              <div class="label">Period:</div>
              <div class="tag">Before 650 BC</div>
            </div>
          </div>  
          <div class="placecard-metadata-content" style="margin-top:10px;">Here goes the description</div>    
        </div>
    </div>
      </div>
  
  </div>
</template>

<style scoped>
.place-back-button {
  left: 40px;
  top: 80px;
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
  position: absolute;
}

.place-meta-container{
  overflow-y: auto;
  height:calc(100vh - 80px);
  padding-bottom:30px;
  padding-left:45px;
  padding-right:20px;
}

#app .place-meta-container {

}

.placecard-full {
  margin-top:80px;
  margin-left:50px;
  color:black;
  background-color: white;
  padding: 0px;
  box-shadow: -3px 0px 25px rgba(0, 0, 0, 0.3);
  height:calc(100vh - 230px);
  overflow:hidden;
  overflow-y:auto;
  margin-bottom: 10px;
  border-radius: 10px !important;
  -ms-overflow-style: none;
  scrollbar-width: none;
  transition: all 0.0s ease-in-out;
}

.placecard-full::-webkit-scrollbar {
    width: 0 !important
    }

.placecard-full-content {
height:auto;
width:100%;
padding: 0px 0px 10px 0px;
}

.placecard-full-content h1{
font-size:2.5em;
color:rgb(180,100,100);
margin-bottom:5px;
}

.placecard-full .category-button{
  width:110px!important;
padding:4px 18px!important;
margin-top:15px;
margin-bottom:20px;

}

.mini-map{
  width:100%;
  height:35vh;
  max-height:300px;
  overflow:hidden;
  background-color:grey;
  margin-bottom:0px;
}


/* For big screens */
@media screen and (min-width: 1900px) {
  .placecard-full .category-button{
  width:125px!important;
padding:5px 18px!important;
margin-top:15px;
}
}


/* For small screens */
@media screen and (max-width: 900px) {

  #app .place-meta-container{
position:relative !important;
margin-top:0px  !important;
top:20px!important;
height:auto;
font-size:100%;
width:100%;
z-index:100;
padding-right:20px !important;
padding-left:20px !important;
padding-bottom:0px !important;
overflow-y:auto;
}

  .place-back-button {
    left: 30px;
  top: 70px;
  width: 50px;
  height: 50px;
  z-index:1000;
}

.placecard-full {
margin-top:30px;
color:black;
margin-left:0px;
background-color: white;
padding-bottom: 30px;
box-shadow: 0px -15px 15px rgba(0, 0, 0, 0.1);
transition: all 0.0s ease-in-out;
height:auto;
overflow:hidden;
border-radius: 20px 20px 0px 0px !important;
}

.placecard-full .category-button{
width:120px!important;
padding:8px 15px!important;
margin-top:15px;
padding:0px;
padding-left:0px;
margin-bottom:0px!important;
}
}
</style>