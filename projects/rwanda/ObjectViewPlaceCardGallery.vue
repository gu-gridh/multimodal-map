<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import MapViewPreviewImage from "./MapViewPreviewImage.vue";

const props = defineProps({
    id: Number
})
const id = props.id

const images = ref<null|any>(null);

//fetch all images
onBeforeMount(() => {
    fetch('https://diana.dh.gu.se/api/rwanda/image/?place_of_interest='+ id)
    .then(res => res.json())
    .then(data => {
        console.log(data.results)
        images.value = data.results
    })
    .catch(error => { console.error('Error fetching ', error)})
})


</script>

<template>
    <div class="place-gallery">
            <MapViewPreviewImage
                v-for="image in images"
                :key="image.uuid"
                :image="image"
            />
    </div>
</template>

<style>
    .place-gallery {
        color: white;
        font-size:120%;
        width:calc(100% - 600px);
        margin-left:600px;
        height:calc(100vh - 80px);
        padding-top:90px;
        padding-left:20px;
        overflow-y:auto;
    }
    .imgPreview {
        width: 300px;
        height:auto;
        color:black;
        background-color: white;
        font-size: 14px;
        margin-bottom: 0px;
        border-radius: 10px;
        padding: 10px 10px 15px 10px;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
        transition: all 0.2s ease-in-out;
    }

   #app .place-gallery .image-card-white {
  width:300px !important;
  font-size: 14px;
  margin-bottom: 0px;
  margin-right:30px;
  margin-bottom:30px;
}

@media screen and (max-width: 900px) {

    #app .place-gallery {
font-size:120%;
width:100%;
margin-left:0px;
height:calc(100vh);
padding-top:40px;
padding-left:50px;
padding-right:50px;
padding-bottom:50vh;
overflow-y:auto;
}
.image-card-white {
  float:left;
  width:100%;
  color:black;
  background-color: white;
  font-size: 20px;
  margin-bottom: 0px;
  border-radius: 10px;
  padding: 10px 10px 15px 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  margin-right:30px;
  margin-bottom:30px;
}
}


</style>