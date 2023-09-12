<script setup lang="ts">
import router from './router'
import { ref, inject, onMounted, watchEffect} from "vue"

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
    const zoom = ref(14);
    const rotation = ref(0);
    const strokeWidth = ref(5);
    const strokeColor = ref("red");
    const center = ref([12.001323, 42.241995])
    const minZoom = ref(10)

    const format = inject("ol-format");
    const geoJson = new format.GeoJSON();

    const url = "https://diana.dh.gu.se/api/rwanda/geojson/place/"+ props.id

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
      <div class="place-card-full">
        <div class="place-card-content">
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
                <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>
              </ol-style>
            </ol-vector-layer>
          </ol-map>
        </div>
        <div class="card-text">
          <div class="place-title">Place Title</div>
          
          <button class="theme-button">3D model</button>
        </div>
    </div>
      </div>
  
  </div>
</template>

<style scoped>
.place-back-button {
  left: 40px;
  top: 50px;
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
  overflow-x:auto;
  overflow:auto;
  height:calc(100vh - 80px);
  padding-bottom:30px;
  padding-left:45px;
  padding-right:20px;
}

.place-card-full {
  margin-top:50px;
  margin-left:50px;
  color:black;
  background-color: white;
  padding: 0px;
  box-shadow: -3px 0px 25px rgba(0, 0, 0, 0.3);
  height:calc(100vh - 240px);
  overflow:hidden;
  overflow-y:auto;
  margin-bottom: 10px;
  border-radius: 10px !important;
  -ms-overflow-style: none;
  scrollbar-width: none;
  transition: all 0.0s ease-in-out;
}

.place-card-full::-webkit-scrollbar {
    width: 0 !important
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
padding:4px 18px!important;
margin-top:15px;
margin-bottom:20px;

}

.mini-map{
  width:100%;
  height:300px;
  overflow:hidden;
  background-color:grey;
  margin-bottom:0px;
}
.meta-item {
  margin-bottom:5px;
}

.card-text {
  font-family: "Barlow Condensed", sans-serif;
  color: black;
  margin-top:0px;
  font-size:1.0em;
  text-align: left;
  hyphens: auto;
  line-height:1.2;
  padding:10px 20px 20px 20px;
  float:left;
}

.card-text p{
padding: 0px;
}

.place-title {
  letter-spacing: -0.1rem;
  text-align: left;
  color: rgb(180, 100, 100);
  width: calc(100% - 20px);
  margin-bottom: 10px;
  margin-top:10px;
  float:left;
  font-size:35px;
}

.place-title p {
  color: white;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.0;
  background-color: rgb(180, 100, 100);
  border-radius: 10px 10px 0 0;
  padding: 20px 10px 15px 10px;
  width: 100%;
  opacity: 0.99;
  box-shadow: 0px -5px 10px 0 rgba(0, 0, 0, 0.2),
    0 0px 0px 0 rgba(0, 0, 0, 0.19);
}


@media screen and (min-width: 1900px) {

.place-card-full .category-button{
  width:125px!important;
  padding:6px 20px!important;
}
}


@media screen and (min-width: 1900px) {
  .place-card-full .category-button{
  width:125px!important;
padding:5px 18px!important;
margin-top:15px;
}
}


@media screen and (max-width: 900px) {


  .place-back-button {
  left: 30px;
  top: 53vh;
  width: 50px;
  height: 50px;
  z-index:1000;

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


.place-card-full .category-button{
width:120px!important;
padding:8px 15px!important;
margin-top:15px;
padding:0px;
padding-left:0px;
margin-bottom:0px!important;
}
}

</style>