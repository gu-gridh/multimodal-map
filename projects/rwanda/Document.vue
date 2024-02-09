<template>
    <div class="content">
        <div class="flex-1 text-center" >
            <router-link to="" class="back-button" @click="goBack()"> </router-link>
         </div>
        <div class="metadata">
            <!-- <div v-if="place?.properties.names" v-for="name in place.properties.names" class="my-5 object-title">
                {{ name.text }}
            </div> -->
            <div class="my-5 object-title">{{ document?.title }}</div>
            <div class="meta-text">
                {{ document?.text }}
            </div>
        </div>
        <div class="pdf-container">
            <embed :src="filename" type="application/pdf" class="pdf-viewer" />       
        </div>
        
    
    </div>
</template>

<script setup lang="ts">
import type { Document } from './types';
import { ref, onMounted, inject } from 'vue';
import type { DianaClient } from "@/assets/diana";
import router from '@/router';

const props = defineProps<{
    id: any;
}>();

const diana = inject("diana") as DianaClient;
const document = ref<Document>();
const place = ref<any>();
const filename = ref<string>();

const goBack = () => {
    router.go(-1);
}

const fetchPlace = async () => {
    if(document.value?.place_of_interest != null){ 
        place.value = await diana.get("geojson/place", document.value.place_of_interest)
    }
}

onMounted(async () => {
    document.value = await diana.get("document", props.id) 
    filename.value = document.value?.filename + "#toolbar=1"
    fetchPlace();
});

</script>

<style>
.content {
    width: 100%;
    height: auto;
    margin: 0;
    white-space: nowrap
}
.metadata {
    width: 25% !important;
    padding-top: 100px;
    padding-left: 20px;
    padding-right: 20px;
    
}

.pdf-container {
    width: 80%;
    height: calc(100vh - 80px) !important;
    display: inline-block;
    align-items: center;
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

.pdf-viewer {
    width: 100%;
    height: 100%;
}

.meta-text {
    padding-right: 10px;
    font-style: italic;
    width: 100%;
    word-wrap: break-word;
    white-space: pre-line;
}
</style>
