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


      <div class="left-content">
        <div class="left-content-columns">
          <div class="left-content-column1">
            <div class="title-fields">
              <div class="sophia-main-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }">Написи
                <br>Святої
                <br>Софії
              </div>
              <div class="sophia-sub-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }">Saint
                Sophia's
                <br>
                Inscriptions
              </div>
            </div>
          </div>
          <div class="left-content-column2">
            <div class="sophia-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
              {{ $t('aboutportalmain') }}
            </div>
            <div class="sophia-article-sub" v-bind:class="{ fullopacityui: visibleAbout }">
              {{ $t('aboutportal') }}
            </div>
            <div class="explore-button">
              <button @click="toggleLanguageEN(); $emit('close')">
                <div class="p-1 px-2 category-button"
                  style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
                  v-bind:class="{ fullopacityui: visibleAbout }">{{ $t('explore') }}</div>
              </button>
            </div>

            <div class="explore-button">
              <a href="https://www.gu.se/en/research/digital-documentation-of-inscriptions-in-the-saint-sophia-cathedral-in-kyiv"
                target="_blank">
                <button>
                  <div class="p-1 px-2 category-button"
                    style="margin-left:20px; width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
                    v-bind:class="{ fullopacityui: visibleAbout }">{{ $t('learnmore') }}</div>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="right-content"></div>

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
    background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1.0) 100%) !important;
  }

  .sophia-main-title {
    font-family: "Alumni Sans Pinstripe", sans-serif;
    color: white !important;
    font-weight: 100 !important;
    line-height: 0.7;
    text-align: right;
    font-size: 7vw;
    top: 40%;

  }

  .sophia-sub-title {
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

  .sophia-article-main {
    font-family: "Oswald", sans-serif !important;
    color: white;
    text-align: left;
    font-size: 1.1em;
    line-height: 1.3;
    width: auto;
    font-weight: 100;
    padding: 0px;
    margin: 0px;
  }

  .sophia-article-sub {
    font-family: "Oswald", sans-serif !important;
    color: white;
    text-align: left;
    font-size: 0.95em;
    line-height: 1.3;
    width: auto;
    font-weight: 100;
    padding: 0px;
    margin: 0px;
    columns: 1;
    margin-top: 20px;
  }


  .main-about-content {
    display: flex;
    flex-direction: row;
    align-items: top;
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
    margin-top: 0px;
    position: relative;
    float: left;
    margin-left: 0px;

  }

  .left-content {
    width: 60%;
    float: right;
    padding-right: 10px;
    min-width: 800px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .right-content {
    height: calc(100vh - 80px);
    width: 40%;
    background: url(/images/saintsophia.jpg);
    background-size: cover;
    float: right;
  }


  .left-content-columns {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    width: 100%;
    float: right;
    padding-right: 10px;

  }

  .left-content-column1 {
    float: right;
    width: 55%;
  }

  .left-content-column2 {
    float: right;
    padding-left: 40px;
    width: 45%;
    margin-left: 40px;
    border-width: 0px 0px 0px 0.5px;
    border-style: dashed;
    border-color: grey;
    max-width: 500px;
  }




  .category-button {
    font-family: "Oswald", sans-serif !important;
    margin-top: 30px;
    float: left;
    font-size: 1.0em !important;
    font-weight: 300;
    transition: all 0.4s ease-in-out;
    padding: 4px 15px !important;
    z-index: 1000;
    opacity: 1.0;
    right: 0px;
    color: white !important;
    background-color: rgb(50, 50, 50) !important;
  }

  /*   Mid screen adaption */
  @media screen and (max-width: 1450px) {
    .left-content {
    width: 60%;
    float: left;
    padding-right: 10px;
  }

    .sophia-main-title {
      font-size: 7em;
    }

    .sophia-sub-title {
      font-size: 3.5em;
    }
  }

  

  /*   Small screen adaption */

  @media screen and (max-width: 900px) {
   
    .main-about-content {
    display: flex;
    flex-direction: row;
    align-items: top;
    padding: 0px;
    height: auto;
    overflow: hidden;
  }
    .left-content {
      width: 100%;
      float: left;
      padding-left: 50px;
      min-width: auto;
      padding-right: 20px;
      margin-top: 80px;
      z-index: 10000;
      position: absolute;
      padding-bottom: 140px;
      display: block;
      flex-direction: row;
      align-items:flex-start;
    }

    .right-content {
      width: 100%;
      float: right;
      margin-left: 150px;
      height: calc(100vh + 160px);
    }

    .left-content-columns {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      float: right;
    }

    .left-content-column2 {
      float: right;
      padding-left: 0px;
      padding-top: 10px;
      width: 100%;
      padding-left: 0px;
      padding-right: 0px;
      margin-left: 0px;
      border-width: 0px 0px 0px 0.0px;
    }

    .category-button {
      margin-top: 30px;
      font-size: 1.2em !important;
      float: auto !important;
    }

    .explore-button {
      margin-top: 0px;
      position: relative;
      float: left;
      margin-left: 0px;
    }

    .sophia-main-title {
      text-align: left;
      margin-left: 0px;
    }

    .sophia-sub-title {
      text-align: left;
      margin-left: 0px;
      font-size: 3.8em;
    }

    .sophia-article-main {
      padding-left: 0px !important;
      margin: 0px;
      font-weight: 100 !important;
      font-size: 1.2em !important;
      padding-right: 0px !important;
    }

    .sophia-article-sub {
      font-family: "Oswald", sans-serif;
      color: white;
      text-align: left;
      font-size: 1.0em !important;
      line-height: 1.3;
      width: auto;
      font-weight: 100 !important;
      padding: 0px !important;
      margin: 0px !important;
      columns: 1 !important;
      margin-top: 20px !important;
    }

    .language-button {
      margin-left: 25px;
    }


  }

  @media screen and (max-width: 600px) {
    .right-content {}
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