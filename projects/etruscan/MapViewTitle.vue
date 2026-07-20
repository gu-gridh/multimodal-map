<template>
    <div class="main-title">{{ $t('title') }}</div>
    <div class="about">{{ $t('about') }}</div>
    <button class="item" @click="$emit('toggle-about')">
      <div class="p-1 px-2 clickable category-button about-button">
        {{ $t('infobutton') }}</div>
    </button>
    <button class="item" @click="$emit('toggle-instructions')">
      <div class="p-1 px-2 clickable category-button about-button" style="margin-left: 10px;">
        {{ $t('instructions') }}</div>
    </button>
    
    <button @click="toggleLanguage">
        <div class="p-1 px-2 clickable category-button about-button" style="
                margin-left: 10px;
              ">{{ $t('languagebutton') }}</div>
    </button>
    <button class="show-labels-button" @click="toggleMapLabels">
      <div class="p-1 px-2 clickable category-button about-button" :class="{ active: showMapLabels }">
        {{ $t('maplabels') }}
      </div>
    </button>
</template>

<script>
import i18n from '../../src/translations/etruscan';
import { mapState } from 'pinia';
import { etruscanStore } from './settings/store';

export default {
  name: "Title",
  computed: {
    ...mapState(etruscanStore, ['showMapLabels']),
  },
  methods: {
    toggleLanguage() {
      if (i18n.global.locale === 'en') {
        i18n.global.locale = 'it';
      } else {
        i18n.global.locale = 'en';
      }
    },
    toggleMapLabels() {
      etruscanStore().showMapLabels = !this.showMapLabels;
    },
  },
  emits: ['toggle-about', 'toggle-instructions'],
};
</script>


<style>
.show-labels-button {
  margin-left: 10px;
}

@media screen and (max-width: 900px) {
  .show-labels-button {
    display: block;
    margin: 10px 0 0;
  }
}
</style>
