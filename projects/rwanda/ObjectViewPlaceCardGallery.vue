<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import MapViewPreviewImage from "./MapViewPreviewImage.vue";

const props = defineProps({
    id: Number
})
const id = props.id

const images = ref<null|string>(null);

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

    <div class="gallery">
        <div v-for="image in images" :key="image.uuid">
<!--             <router-link :to="`/image/${image.id}`" class="clickable">
                <img :src="`${image.file}`" alt="image" class="imgPreview"/>
                {{ image.title }}
            </router-link> -->
        </div>
        <div class="imgPreview">
            <MapViewPreviewImage
                v-for="image in images"
                :key="image.id"
                :image="image"
            />
        </div>
        
    </div>

</template>

<style>
    .gallery {
        color: white;
        font-size:120%;
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
</style>