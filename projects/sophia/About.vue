<template>
  <div class="about-container" v-bind:class="{fullopacity: visibleAbout}">
    <button @click="toggleLanguage">
        <div class="p-1 px-2 clickable category-button about-button" style="
                left: 20px !important;
                top: 20px !important;
                font-size:1.1em!important;
              ">{{ $t('languagebutton') }}</div>
    </button>
    <div class="flex-machine">
      <div class="red-content">
        
    <div class="about-main-title theme-color-text" v-bind:class="{fullopacityui: visibleAbout}">{{ $t('etruscantitle') }}</div>
    <div class="about-sub-title theme-color-text" v-bind:class="{fullopacityui: visibleAbout}"></div>

    <div class="about-article-main" v-bind:class="{fullopacityui: visibleAbout}">
      {{ $t('aboutportalmain') }}
    </div>




      <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
        {{ $t('aboutportal') }}
    </div>
  
    
    
      
      <button @click="$emit('close')">
        <div
              class="p-1 px-2 category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"  v-bind:class="{fullopacityui: visibleAbout}"> {{ $t('explore') }}</div>
          </button>
        </div>
        <!-- <div class="about-lower-border"> </div> -->
      </div>
       
        <div class="about-logo-top-right"> </div>

  </div>
  

</template>



<script lang="ts">

import i18n from '../../src/translations/etruscan';

export default {
  name: "aboutview",
  props: {
    visibleAbout: {
      type: Boolean,
      required: true,
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

<style scoped>
.about-container {
  color: black;
  overflow-y:auto;
  background: linear-gradient(90deg, rgba(245, 235, 225,1) 0%, rgba(245, 235, 225,0.8) 100%) !important;
  padding-bottom:40px !important;

/*   Hide the about during development */
  display:none;
}

.fullopacity{
  /*   Hide the about during development */
  display:none;
  
  backdrop-filter:blur(5px);
  background: linear-gradient(90deg, rgba(245, 235, 225,1) 0%, rgba(245, 235, 225,0.8) 100%) !important;
}

.category-button{
  position:relative;
  float:left;
  font-size:1.4vw!important;
  font-weight:400;
  transition: all 0.4s ease-in-out;
  padding:8px 20px !important;
  z-index:1000;
  opacity:1.0;
}

.about-main-title {
  font-family: 'Teko', sans-serif;
}


@media screen and (max-width: 1500px) {
.category-button{

  font-size:1.2em!important;

}
}

@media screen and (max-width: 900px) {
.category-button{
margin-top:30px;
font-size:1.9em!important;
}
}

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
  transform:rotate(0deg);
}


.about-lower-border{
  flex-grow: 1;
  margin-top:0px;
  pointer-events:none;
  width:100%;
  height:300px;
  position:relative;
  background:url(./images/about-etruscans.png);
  background-repeat: no-repeat;
  background-size: cover;
  opacity:0.7;
}

</style>
