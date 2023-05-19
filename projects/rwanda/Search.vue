<script setup lang="ts">
import AutocompleteComponent from "@/components/input/AutocompleteComponent.vue";
import MapCard from "./MapCard.vue";
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { useRwandaMap } from "./map.composable";
import { formatNames } from "./names";
import type { Place } from "./types";

const { searchText } = useRwandaMap();
const store = mapStore();
const { results } = storeToRefs(store);

function displayName(p: Place): string {
  return formatNames(p.id, p.names);
}
</script>

<template>
  
  <div class="filter-container">
   
    <AutocompleteComponent
      placeholderText="Search..."
      noResultsText="No results found."
      :displayFunction="displayName"
      :searchItems="searchText"
    />
   
<!--     <div class="card-holder clickable overflow-y-auto">
      <MapCard
        v-for="result in results"
        v-bind:key="result"
        :place="result"
        class="pb-5 rounded-lg"
      />
    </div> -->

  </div>
</template>

<style>

.filter-container {
  display:flex;
  flex-direction: column;
  height:auto;

}


.card-holder{
  flex:1;
  border-radius:8px;
  padding:0px 20px;
  border-style:dashed;
  border-color:black;
  border-width:1px;
  margin-top:20px;
  width:100%;
  z-index:0;
  backdrop-filter: blur(5px);
}

#app .searchbox{

  background-color:black !important;
width:100%;
color:white;
  padding:15px  !important;
  font-size: 25px;

}

#app .searchbox-menu{
  z-index:10;
  margin-top:-5px;
  padding:10px 0px 0px 0px;
  border-radius:0 0 8px 8px;
  background-color:rgb(45,45,45);
  color:white;
  max-height:calc(100vh - 550px);


}

#app .searchbox-menu-text{
  
  padding:15px  !important;
  font-size: 16px;

}

#app .searchbox-menu-text-active{
  
 background-color:rgb(180,100,100);

}


#app .searchbox-menu-text-active{
  
  color:white;
 
 }


.filter-container {
  margin-top:30px;
  padding: 1.5rem 0 1.5rem 0;
  border-bottom-right-radius: 0.5rem /* 8px */;
  border-bottom-left-radius: 0.5rem /* 8px */;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}



.section-title {
  font-weight: 400;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 5px;
}
#app .mapcard-container {
  margin-top:10px;
}

#app .area-search-button {
  border-radius:0px;
  margin-bottom:10px;
}

#app .category-button {
  background-color: rgba(180, 100, 100, 1.0);
  color: white;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}

#app .category-button:hover {
  background-color: rgb(220, 140, 140);
  color: white;
}

#app .category-button.active {
  background-color: rgb(180, 100, 100);
  color: white;
}

#app .rounded {
  border-radius: 10px;
}

</style>
