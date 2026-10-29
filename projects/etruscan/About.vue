<template>
  <div class="about-container" v-bind:class="{fullopacity: visibleAbout}"
    :style="{ display: displayAbout ? 'block' : 'none' }">
    <button @click="toggleLanguage">
      <div class="p-1 px-2 clickable category-button about-button" style="
                left: 20px !important;
                top: 20px !important;
                font-size:1.1em!important;
              ">{{ $t('languagebutton') }}</div>
    </button>
    <div class="flex-machine">
      <div class="red-content">

        <div class="about-main-title theme-color-text" v-bind:class="{fullopacityui: visibleAbout}">{{
          $t('title') }}</div>
        <div class="about-sub-title theme-color-text" v-bind:class="{fullopacityui: visibleAbout}"></div>

        <div class="about-article-main" v-bind:class="{fullopacityui: visibleAbout}">
          {{ $t('aboutportalmain') }}
        </div>




        <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
          {{ $t('aboutportal') }}
        </div>




        <button @click="$emit('close')">
          <div class="p-1 px-2 category-button"
            style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
            v-bind:class="{fullopacityui: visibleAbout}"> {{ $t('explore') }}</div>
        </button>
      </div>
      <!-- <div class="about-lower-border"> </div> -->
    </div>

    <div class="about-logo-top-right"> </div>

  </div>


</template>



<script>

  import i18n from '../../src/translations/etruscan';

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
          i18n.global.locale = 'it';
        } else {
          i18n.global.locale = 'en';
        }
      },
    },
  };



</script>

<style scoped src="./styles/about.css"></style>
<style scoped>
  .about-logo-top-right {
    display: block;
    pointer-events: none;
    width: 180px;
    height: 180px;
    position: absolute;
    background: url(/images/logo-isvroma3.png);
    background-repeat: no-repeat;
    background-size: contain;
    top: 30px;
    right: 40px;
    opacity: 0.9;
    transform: rotate(0deg);
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

</style>
