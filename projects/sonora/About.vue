<template>
  <div class="about-container" v-bind:class="{ fullopacity: visibleAbout }" :style="{ display: displayAbout ? 'block' : 'none' }">
    <button @click="toggleLanguage">
      <div class="p-1 px-2 clickable category-button about-button" style="
                left: 20px !important;
                top: 20px !important;
                font-size:1.1em!important;
              ">{{ $t('languagebutton') }}</div>
    </button>
    <div class="flex-machine">
      <div class="red-content">

        <div class="about-main-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }"
          v-html="$t('sonoratitle')"></div>
        <div class="about-sub-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }"></div>

        <div class="about-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('aboutportalmain') }}
        </div>


        <div class="about-article-sub" v-bind:class="{ fullopacityui: visibleAbout }" style="margin-top: 0px;">
          {{ $t('aboutportalmain2') }} {{ $t('attributions') }}
        </div>

        <div class="about-article-sub-list" v-bind:class="{ fullopacityui: visibleAbout }"
          style="margin-top: 30px; text-align:left;">
          <ul>
            <li>{{ $t('attributions1') }}</li><br>
            <li>{{ $t('attributions2') }}</li><br>
            <li>{{ $t('attributions3') }}</li>

            <li>{{ $t('attributions4') }}</li><br>
            <li>{{ $t('attributions5') }}</li><br>
            <li>{{ $t('attributions6') }}</li>
          </ul>
        </div>

        <div class="about-article-main" v-bind:class="{ fullopacityui: visibleAbout }"
          style="margin-top: 20px; margin-bottom: 30px">
          {{ $t('aboutportalmain3') }}
        </div>

        <button @click="$emit('close')">
          <div class="p-1 px-2 category-button" style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
            v-bind:class="{ fullopacityui: visibleAbout }"> {{ $t('explore') }}</div>
        </button>
      </div>
      <!-- <div class="about-lower-border"> </div> -->
    </div>

    <div class="about-logos-container">
      <div class="about-logo about-logo-bottom"></div>
      <div class="about-logo about-logo-bottom2"></div>
      <div class="about-logo about-logo-bottom3"></div>
      <div class="about-logo about-logo-bottom4"></div>
    </div>
  </div>
</template>

<script lang="ts">

import i18n from '../../src/translations/sonora';

export default {
  name: "aboutview",
  props: {
    visibleAbout: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      displayAbout: this.visibleAbout,
    };
  },
  watch: {
    visibleAbout(newVal) {
      if (newVal) {
        // If visibleAbout is true, immediately show the container
        this.displayAbout = true;
      } else {
        //if visibleAbout is false, wait for the transition to finish before hiding
        setTimeout(() => {
          this.displayAbout = false;
        }, 1000); //transition duration
      }
    },
  },
  methods: {
    toggleLanguage() {
      if (i18n.global.locale === 'en') {
        i18n.global.locale = 'sv';
      } else {
        i18n.global.locale = 'en';
      }
    },
  },
};



</script>

<style scoped>
ul {
  list-style-type: circle;
  padding-left: 30px;
}

.about-container {
  color: white;
  overflow-y: auto;
  background: linear-gradient(90deg, rgba(108, 136, 139, 1) 0%, rgba(245, 235, 225, 0.8) 100%) !important;
  padding-bottom: 40px !important;
}

.fullopacity {
  backdrop-filter: blur(5px);
  background: linear-gradient(90deg, rgba(108, 136, 139, 1) 0%, rgba(138, 166, 169, 1) 100%) !important;
}

.category-button {
  position: relative;
  float: left;
  font-size: 1.4vw !important;
  font-weight: 400;
  transition: all 0.4s ease-in-out;
  padding: 8px 20px !important;
  z-index: 1000;
  opacity: 1.0;
}

.about-main-title {
  font-family: 'Teko', sans-serif;
  color: white !important;
  line-height: 0.9;
  margin-bottom: 0px;
  font-size: 5.0em;
}

.about-article-main {
  color: white;
  text-align: center;
  line-height: 1.1;
}

.about-article-sub {
  color: white;
  line-height: 1.2;
  padding-bottom: 0px;
}

.about-article-sub-list {
  color: white;
  line-height: 1.2;
  padding-bottom: 0px;
  max-width: 800px;
  columns: 2;
  float: left;
  margin-top: 20px;
}

@media screen and (max-width: 1500px) {
  .category-button {

    font-size: 1.2em !important;

  }
}

@media screen and (max-width: 900px) {
  .category-button {
    margin-top: 30px;
    font-size: 1.9em !important;
  }

  .about-article-sub-list {
    color: white;
    line-height: 1.2;
    padding-bottom: 0px;
    padding: 0px 30px 30px 30px;
    columns: 1;
    float: left;
    font-size: 1.2em !important;
  }
  .about-main-title {
  font-size: 5.0em!important;
}
}

.about-logo {
  display: block;
  pointer-events: none;
  width: 200px;
  height: 200px;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  opacity: 0.9;
}

.about-logo-bottom {
  background: url(/images/logo1.svg);
}

.about-logo-bottom2 {
  background: url(/images/logo2.png);
}

.about-logo-bottom3 {
  background: url(/images/logo3.svg);
}

.about-logo-bottom4 {
  background: url(/images/logo4.png);
}

.about-logos-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 50px;
  padding:0px 30px;
}

.about-lower-border {
  flex-grow: 1;
  margin-top: 0px;
  pointer-events: none;
  width: 100%;
  height: 300px;
  position: relative;
  background: url(./images/about-etruscans.png);
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.7;
}

@media screen and (max-width: 900px) {
  .about-logos-container {
  display: block;
  gap: 20px!important;
  padding:20px 20px 300px 20px;
}

  .about-logo {
  float:left;
  height:auto;
  min-height:100px;
  width:150px;
  margin:10px;
}
}
</style>
