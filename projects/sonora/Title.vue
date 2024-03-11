<template>
    <div class="main-title">Svenskt <br>digitalt <br>orgelarkiv</div>
    <!-- <div class="about">{{ $t('sonoraabout') }}</div> -->
    <button class="item" @click="$emit('toggle-about')">
      <div class="p-0.5 px-2 clickable category-button about-button">
        {{ $t('infobutton') }}</div>
    </button>
    <button @click="toggleLanguage">
        <div class="p-0.5 px-2 clickable category-button about-button" style="
                margin-left: 10px;
              ">{{ $t('languagebutton') }}</div>
    </button>
</template>

<script>
import i18n from '../../src/translations/sonora';

export default {
  name: "Title",
  methods: {
    toggleLanguage() {
      if (i18n.global.locale === 'en') {
        i18n.global.locale = 'sv';
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