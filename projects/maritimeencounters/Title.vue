<template>
    <div class="main-title">{{ "Maritime Encounters" }}</div>
    <div class="about">{{ "The portal is published by GRIDH at the University of Gothenburg in close collaboration with InfraVis." }}</div>
    <button class="item" @click="$emit('toggle-about')">
      <div class="p-1 px-2 clickable category-button about-button">
        {{ "About the portal" }}</div>
    </button>
    <button class="item" style="margin-left: 20px;" @click="startRectangleDraw">
      <div class="p-1 px-2 clickable category-button about-button">Download the data</div>
    </button>
    <button class="item" style="margin-left: 20px;" @click="toggleHeatMap" v-if="doneFetching">      
      <div class="p-1 px-2 clickable category-button about-button">Heat map</div>
    </button>
</template>

<script>
import i18n from '../../src/translations/etruscan';
import { maritimeencountersStore } from "./store";
import { computed } from "vue";

export default {
  name: "Title",
  methods: {
    toggleLanguage() {
      if (i18n.global.locale === 'en') {
        i18n.global.locale = 'it';
      } else {
        i18n.global.locale = 'en';
      }
    },
  },
  setup() {
    const store = maritimeencountersStore();

    const startRectangleDraw = () => {
      store.startRectangleDraw = true;
    };

    const toggleHeatMap = () => {
      store.showHeatMap = !store.showHeatMap;
    };

    const doneFetching = computed(() => store.doneFetching);

    return {
      startRectangleDraw, toggleHeatMap, doneFetching
    };
  },
  emits: ['toggle-about'],
};
</script>


<style>

</style>