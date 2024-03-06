<template>
  <div class="about-container" v-bind:class="{ fullopacity: visibleAbout }">

    <div class="language-button">
      <button @click="toggleLanguage">
        <div class="p-1 px-2 clickable about-button" style="
                left: 20px !important;
                top: 20px !important;
                font-size:1.1em!important;
                color:white;
              ">{{ $t('languagebutton') }}</div>
      </button>
    </div>
    <div class="main-about-content">
      <div class="right-content"></div>
      <div class="left-content">

        <div class="about-main-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }">Написи <br>Святої
          <br>Софії
        </div>
        <div class="about-sub-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }">Saint Sophia's <br>
          Inscriptions</div>
        <div class="about-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('aboutportalmain') }}
        </div>
        <div class="about-article-sub" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('aboutportal') }}
        </div>

        <div class="explore-button">
          <button @click="toggleLanguageEN(); $emit('close')">
            <div class="p-1 px-2 category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
              v-bind:class="{ fullopacityui: visibleAbout }">Explore</div>
          </button>
        </div>

        <div class="explore-button">
          <button @click="toggleLanguageUK(); $emit('close')">
            <div class="p-1 px-2 category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
              v-bind:class="{ fullopacityui: visibleAbout }">Досліджуйте</div>
          </button>
        </div>
      </div>


    </div>
  </div>
</template>



<script lang="ts">

import i18n from '../../src/translations/sophia';

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
        i18n.global.locale = 'uk';
      } else {
        i18n.global.locale = 'en';
      }
    },
    toggleLanguageUK() {
      i18n.global.locale = 'uk';
    },
    toggleLanguageEN() {
      i18n.global.locale = 'en';
    }
  },
};



</script>

<style scoped>
.about-container {
  color: black;
  overflow-y: auto;
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1.0) 100%) !important;
  padding-bottom: 0px !important;
  padding-right: 0px !important;
}

.fullopacity {
  /*   Hide the about during development */
  backdrop-filter: blur(5px);
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1.0) 100%) !important;
}



.about-main-title {
  font-family: "Alumni Sans Pinstripe", sans-serif;
  color: white !important;
  font-weight: 100 !important;
  line-height: 0.7;
  text-align: right;
  font-size: 6vw;

}

.about-sub-title {
  font-family: "Alumni Sans Pinstripe", sans-serif;
  color: white !important;
  font-weight: 100 !important;
  line-height: 0.8;
  text-align: right;
  margin-top: 20px;
  font-size: 3.5vw;
  margin-bottom: 0px;
  letter-spacing: 0px !important;
}

.main-about-content {
  padding: 0px;
  height: calc(100vh - 80px);
  overflow: hidden;
}

.language-button {
  width: 120px;
  position: absolute;
  top: 20px;
  left: 20px;
}


.explore-button {
  margin-top: 20px;
  position: relative;
  float: right;
  margin-left: 20px;
}

.left-content {
  width: 50%;
  float: right;
  padding-right: 100px;
  padding-top: 8%;
}

.right-content {
  height: calc(100vh - 0px);
  width: 50%;
  background: url(/images/saintsophia.jpg);
  background-size: cover;
  float: right;
}

.category-button {
  margin-top: 40px;
  float: right;
  font-size: 1.2vw !important;
  font-weight: 300;
  transition: all 0.4s ease-in-out;
  padding: 4px 15px !important;
  z-index: 1000;
  opacity: 1.0;
  right: 0px;
}


@media screen and (max-width: 1500px) {
  .category-button {

    font-size: 1.2em !important;
  }
}

@media screen and (max-width: 900px) {
  .category-button {
    margin-top: 30px;
    font-size: 1.5em !important;
    float:auto!important;
  }

  .explore-button {
  margin-top: 0px;
  position: relative;
  float: left;
  margin-left: 30px;

}

  .about-main-title{
    text-align:left;
    margin-left:30px;
  }

  .about-sub-title{
    text-align:left;
    margin-left:30px;
    font-size:3em;
  }

  .language-button{
    margin-left:5px;
  }
}

.about-logo-top-right {
  display: block;
  pointer-events: none;
  width: 180px;
  height: 180px;
  position: absolute;
  /*   background: url(/images/logo.png); */
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
  /*   background:url(./images/about-etruscans.png); */
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.7;
}
</style>
