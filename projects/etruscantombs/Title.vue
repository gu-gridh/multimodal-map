<template>
    <div class="main-title">{{ $t('etruscantitle') }}</div>
    <div class="about">{{ $t('etruscanabout') }}</div>
    <button class="item" @click="$emit('toggle-about')">
      <div class="p-1 px-2 clickable category-button about-button">
        {{ $t('infobutton') }}</div>
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
  emits: ['toggle-about'],
};
</script>


<style>

</style>