<template>
    <div class="content">
        <div class="">
            <router-link to="" class="back-button" @click="goBack()"> </router-link>
        </div>
        <div class="metadata">
            <!-- <div v-if="place?.properties.names" v-for="name in place.properties.names" class="my-5 object-title">
                {{ name.text }}
            </div> -->
            <div class="meta-content">
                <div class="meta-title">{{ document?.title }}</div>
                <div class="meta-text">
                    {{ document?.text }}
                </div>
            </div>
        </div>
        <div class="pdf-container" v-if="fileType== 'pdf'">
            <iframe :src="filename" type="application/pdf" class="pdf-viewer"/>
        </div>
        <div class="image-container" v-if="fileType== 'image'">
            <img :src="filename"/>
            </div>


    </div>
</template>

<script setup lang="ts">
    import type { Document } from './settings/types';
    import { ref, onMounted, inject } from 'vue';
    import type { DianaClient } from "@/assets/diana";
    import router from '@/router';

    const props = defineProps < {
        id: any;
    } > ();

    const diana = inject("diana") as DianaClient;
    const document = ref < Document > ();
    const place = ref < any > ();
    const filename = ref < string > ();
    const fileType = ref ('')

    const goBack = () => {
        router.go(-1);
    }

    const fetchPlace = async () => {
        if (document.value?.place_of_interest != null) {
            place.value = await diana.get("geojson/place", document.value.place_of_interest)
        }
    }

    onMounted(async () => {
        document.value = await diana.get("document", props.id)
        //check type of file
        if (document.value?.filename.includes(".pdf")) {
            filename.value = document.value?.filename + "#toolbar=1"
            fileType.value = "pdf"
        } else {
            //if not pdf, show image
            fileType.value = "image"
            filename.value = document.value?.filename 
        }
        console.log(fileType.value)
        fetchPlace();
    });

</script>

<style scoped>
    .content {
        width: 100%;
        height: auto;
        margin: 0;

    }

    .metadata {
        float: left;
  height: 100vh;
  color: white;
        width: 400px !important;
        padding-top: 0px;
        padding-left: 20px;
        padding-right: 20px;

    }

    .pdf-container {
        float: left;
  width: calc(100% - 350px);
  background-color: black;
  height: 100vh;
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
        z-index:1000;
    }

    .pdf-viewer {
        width: 100%;
    }

    .meta-content{
        margin-top: 50px;
        left: 60px;
        padding-right: 20px;
        position: relative !important;
    }

    .meta-text {
    
        font-style: italic;
        width: 100%;
        word-wrap: break-word;
        white-space: pre-line;
    }

    .meta-title {
        font-weight: 600 !important;
        font-size: 35px;
        line-height: 1.0;
        position: relative !important;

    }

    .image-container {
        width: calc(100% - 350px);
    }

    @media screen and (max-width: 900px) {
        .metadata {
        margin-top:60vh;

    }

        .meta-content{
        left: 60px;
        padding-right: 20px;
        position: relative !important;
    }
    .pdf-container {
        width: calc(100%);
        height: calc(60vh) !important;
        display: inline-block;
        align-items: center;
    }

    .back-button {
        top: 120px;
        z-index:2000;
    }
    }
</style>