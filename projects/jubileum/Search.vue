<script setup lang="ts">
import CategoryButtonList from "@/components/input/CategoryButtonList.vue";
import { storeToRefs } from "pinia";
import { jubileumStore } from "./store";

const { categories } = storeToRefs(jubileumStore());

// See https://github.com/gu-gridh/rephotography/blob/master/views.py
const CATEGORIES = {
  all: "Alla kategorier",
  image: "Fotografier",
  documents: "Dokument",
  drawings: "Teckningar och konst",
  observation: "Observationer",
};
</script>

<template>
<!--   <div class="section-title">Typ av dokumentation</div>
  <CategoryButtonList
    v-model="categories"
    :categories="CATEGORIES"
    :limit="1"
    class="my-2"
  /> -->
</template>

<style>
.section-title {
  font-weight: 400;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 5px;
}

#app .category-button {
  background-color: rgba(180, 100, 100, 0.8);
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

#app .range-slider-container {
  display: flex;
  width: 100%;
  height: 90px;
  align-items: bottom;
  padding: 25px 0 0 0;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
}

#app .range-slider-wrapper {
  padding-left: 5px;
  padding-right: 5px;
}

#app .start-end-box {
  width: 15%;
  font-size: 20px;
  text-align: center;
  padding-top: 0rem;
  padding-bottom: 0.5rem;
}

#app .rounded {
  border-radius: 10px;
}

#app .slider-connect {
  background-color: #ff9900;
}

#app .slider-tooltip {
  background-color: #ff9900;
  border: 1px solid var(--slider-tooltip-bg, #ff9900);
}

#app .slider-handle {
  margin-top: -10px;
  margin-left: 10px;
  width: 0;
  height: 0;
  border-radius: 0px;
  background: none;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 15px solid #ff9900;
  box-shadow: var(--slider-handle-shadow, 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0));
  cursor: grab;
}
</style>
