<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
import type { DianaClient } from "@/assets/diana";
import documentIcon from '@/assets/document.svg'; 
import PlaceViewCard from "./PlaceViewCard.vue"; 
import MapComponent from "@/components/MapComponent.vue";
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sort = ref('type');
const groupedByYear = ref<{ [year: string]: (Image | Observation | Document | Pointcloud | Mesh )[] }>({});
const { id } = defineProps<{ id: string; }>();
let documents = ref<Document[]>([]); // Initialized as an empty array

watch(() => route.params.id, async (newId) => {
  if (newId) {
    try {
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ.php?id=${newId}&lang=sv`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        documents.value = [];
        for (let i = 0; i < data.no_docs; i++) {
        if (data[i.toString()]) {
            documents.value.push(data[i.toString()]);
        }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }  }
}, { immediate: true });

onMounted(async () => {
  try {
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/organ.php?id=${id}&lang=sv`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    documents.value = [];
    for (let i = 0; i < data.no_docs; i++) {
      if (data[i.toString()]) {
        documents.value.push(data[i.toString()]);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  console.log(documents.value)
});

</script>
    
<template>
    <div class="main-container">
        <div class="place-card-container">
            <PlaceViewCard :id="id" />
        </div>
        <div class="place-view">
            <div class="place-gallery-container">
                <!-- Sort by TYPE table-->
                 <table class="content-table" v-if="sort === 'type' && documents.length > 0">
                        <td>Documents: </td>
                        <div v-for="(doc, index) in documents" :key="index">
                             <router-link :to="`/detail/image/${doc.Nr}`" class="document-link">
                                    <img src="@/assets/document.svg" class="document-icon" />
                                    {{ doc.Document }}
                              </router-link>
                        </div>
                </table>

              
            </div>
        </div>
    </div>
    <MapComponent />
</template>

    
<style scoped>
.document-icon {
    height: 1em; 
    vertical-align: middle; 
    margin-right: 5px; 
    display: inline-block; 
}

.document-link {
    display: flex;
    align-items: center; 
}

.content-table {
  margin-top: 35px;
}

a {
  color: white;
  font-weight: normal;
}

.main-container{
    background-color:rgba(114,135,138, 0.5) !important;
    backdrop-filter: blur(10px) saturate(50%) brightness(100%);
    color:white;
}

.content-table td{
    color:white;
}
</style>
    