<template>
    <div class="main-title">{{ $t('etruscantitle') }}</div>
    <div class="about-text">{{ $t('etruscanabout') }}</div>
    <button class="item" @click="$emit('toggle-about')">
      <div class="p-1 px-2 clickable category-button about-button" style="
                width: 90px;
                text-align: center;
                cursor: pointer;
              ">{{ $t('infobutton') }}</div>
    </button>
    <button @click="toggleLanguage">
        <div class="p-1 px-2 clickable category-button about-button" style="
                text-align: center;
                margin-left: 10px;
                cursor: pointer;
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
  }
};
</script>


<style>

</style>