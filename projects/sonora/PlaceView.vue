<script setup lang="ts">
import { ref, defineProps, onMounted, inject, computed } from 'vue';
import type { Image, Observation, Document, Pointcloud, Mesh } from './types';
import type { DianaClient } from "@/assets/diana";
import documentIcon from '@/assets/document.svg'; 
import PlaceViewCard from "./PlaceViewCard.vue"; 
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

// function groupAndSortByYear(allItems: (Image | Observation | Document | Pointcloud | Mesh)[]) {
//   // Reset groupedByYear
//   groupedByYear.value = {};

//   // Group items by year
//   allItems.forEach((item: Image | Observation | Document | Pointcloud | Mesh) => {
//     const fullDate = new Date(item.date);
//     const year = fullDate.getFullYear().toString();

//     if (!groupedByYear.value[year]) {
//       groupedByYear.value[year] = [];
//     }
//     groupedByYear.value[year].push(item);
//   });
// }

</script>
    
<template>
    <div class="main-container">
        <div class="place-card-container">
            <PlaceViewCard :id="id" />
        </div>
        <!-- Here we will show info of the place -->
        <div class="place-view">
            <div class="place-gallery-container">
                <!-- Gallery of objects will show here with the ability to sort by TYPE of object -->
                <!-- <p>ID: {{ id }}</p> -->
                <!-- <p>PLACE: {{ place.id }}</p> -->
                <div>
                    <!-- <select v-model="sort" class="dropdown">
                        <option actve value="type">Arkiv: Alla</option>
                        <option value="year">Sort by: YEAR</option>
                    </select> -->
                </div>
                <!-- Sort by TYPE table-->
                 <table class="content-table" v-if="sort === 'type' && documents.length > 0">
                        <td>Documents: </td>
                        <div v-for="(doc, index) in documents" :key="index" class="image-placeholder plan-placeholder">
                        <div class="image-square">
                            <router-link :to="`/detail/image/${doc.Nr}`">
                                <div class="meta-data-overlay">
                                    <div class="meta-data-overlay-text">{{ doc.Document }}</div>
                                </div>
                                <img :src="documentIcon" :alt="doc.title" class="image-square-plan" />
                            </router-link>
                        </div>
                        </div>
                </table>

              
            </div>
        </div>
    </div>
</template>

    
<style scoped>
.image-square:hover img {
    opacity: 0.3;
}

.meta-data-overlay-text {
    bottom: 50px !important;
    font-size: 20px;
    color: white;
}
.main-container{
    background-color:rgb(114,135,138) !important;
    color:white;
}

.content-table td{
    color:white;
}
</style>
    