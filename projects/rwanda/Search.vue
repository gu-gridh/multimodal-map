<script setup lang="ts">
import AreaSearch from "@/components/AreaSearch.vue";
import AutocompleteComponent from "@/components/input/AutocompleteComponent.vue";
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import RangeSlider from "@/components/input/RangeSlider.vue";
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
    <AreaSearch id="button-wrapper" class="clickable" />

    <CategoryButtonList
      :categories="{
        Streets: 'Streets',
        Buildings: 'Buildings',
        Areas: 'Areas',
      }"
      class="my-2"
    />

    <RangeSlider :min="1700" :max="2022" :step="1" class="my-2" />

    <AutocompleteComponent
      placeholderText="Search..."
      noResultsText="No results found."
      :displayFunction="displayName"
      :searchItems="searchText"
    />
    <div class="clickable overflow-y-auto h-[600px]">
      <MapCard
        v-for="result in results"
        v-bind:key="result"
        :place="result"
        class="pb-5 rounded-lg"
      />
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  padding: 1.5rem 0 1.5rem 0;
  border-bottom-right-radius: 0.5rem /* 8px */;
  border-bottom-left-radius: 0.5rem /* 8px */;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
