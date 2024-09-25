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
</template>

<script>
import i18n from '../../src/translations/etruscan';

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
  emits: ['toggle-about', 'toggle-instructions'],
};
</script>


<style>

</style>