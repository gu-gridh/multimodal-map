<template>
  <div class="instructions-container" v-bind:class="{ fullopacity: visibleInstructions }"
    :style="{ display: displayInstructions ? 'block' : 'none' }">

    <!-- language-switcher (optional depending on site) -->
    <div class="instructions-language-button">
      <button @click="toggleLanguage">{{ $t('languagebutton') }}</button>
    </div>

    <!-- keeps instructions vertically centered -->
    <div class="instructions-flex">

      <div class="content-columns">

        <!--  title column -->
        <div class="content-column1">
          <div class="title-fields">

            <!--  Main title or logo of the site -->
            <div class="instructions-main-title" style="">
              Svenskt<br>Digitalt<br>Orgelarkiv
            </div>

            <!--  User Guide or Instructions title -->
            <div class="instructions-sub-title">
              {{ $t('instructions') }}
            </div>

            <!--  Short text summarising the intent if the site -->
            <div class="instructions-article-main">
              {{ $t('aboutinstructions') }}
            </div>
          </div>

          <div class="buttons">

            <!--  Button to go to video tutorial on GU-Play -->
            <div class="explore-button">
              <button>
                <a href="https://play.gu.se/media/Etruscan+Tombs+Guide/0_ev6ow83l" target="_blank">
                  <div class="p-1 px-2 category-button"
                    style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;">{{ $t('video') }}</div>
                </a>
              </button>
            </div>

            <!--  Button to close the instructions -->
            <div class="explore-button">
              <button @click="$emit('close')">
                <div class="p-1 px-2 category-button"
                  style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
                  v-bind:class="{ fullopacityui: visibleInstructions }">{{ $t('close') }}</div>
              </button>
            </div>

          </div>
        </div>

        <!--  Features column -->
        <div class="content-column2">
          <h1>{{ $t('features') }}</h1>
          <!--  Individiual feature -->
          <div class="instructions-item">
            <!--  Feature icon -->
            <div class="instructions-item-icon"
              style="background-image:url(https://data.dh.gu.se/ui-icons/inspect_white.png)"></div>
            <div class="instructions-item-description">
              <!--  Feature Title -->
              <div class="instructions-item-title">{{ $t('f1title') }}</div>
              <!--  Feature Description -->
              <p>{{ $t('f1description') }}</p>
            </div>
          </div>

          <!-- repeat -->
          <div class="instructions-item">
            <div class="instructions-item-icon"
              style="background-image:url(https://data.dh.gu.se/ui-icons/search_white.png)"></div>
            <div class="instructions-item-description">
              <div class="instructions-item-title">{{ $t('f2title') }}</div>
              <p>{{ $t('f2description') }}</p>
            </div>
          </div>

          <!-- repeat -->
          <div class="instructions-item">
            <div class="instructions-item-icon"
              style="background-image:url(https://data.dh.gu.se/ui-icons/search_white.png)"></div>
            <div class="instructions-item-description">
              <div class="instructions-item-title">{{ $t('f3title') }} </div>
              <p>{{ $t('f3description') }}</p>
            </div>
          </div>

          <!-- repeat -->
          <div class="instructions-item">
            <div class="instructions-item-icon"
              style="background-image:url(https://data.dh.gu.se/ui-icons/zoomin_big_white.png)"></div>
            <div class="instructions-item-description">
              <div class="instructions-item-title">{{ $t('f4title') }}</div>
              <p>{{ $t('f4description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '../../src/translations/sonora.js';

export default {
  name: "aboutinstructionsview",
  props: {
    visibleInstructions: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      displayInstructions: this.visibleInstructions,
    };
  },
  watch: {
    visibleInstructions(newVal) {
      if (newVal) {
        // If visibleInstructions is true, immediately show the container
        this.displayInstructions = true;
      } else {
        // if visibleInstructions is false, wait for the transition to finish before hiding
        setTimeout(() => {
          this.displayInstructions = false;
        }, 1000); // transition duration
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
    toggleLanguageIT() {
      i18n.global.locale = 'sv';
    },
    toggleLanguageEN() {
      i18n.global.locale = 'en';
    }
  },
};
</script>

<style scoped>
.instructions-container {
  pointer-events: none;
  width: 100%;
  height: calc(100vh - 80px);
  position: absolute;
  line-height: 1;
  z-index: 2000;
  backdrop-filter: blur(0px);
  transform: scale(1.5);
  translate: 0px 100px;
  transition: all 1.5s ease-in-out;
  opacity: 0.0;
  overflow: hidden;
  overflow-y: auto;
}

.fullopacity {
  opacity: 1.0;
  pointer-events: auto;
  transform: scale(1.0);
  translate: 0px 0px;
  transition: all 0.1s ease-in-out;
  background: linear-gradient(90deg, rgba(88, 116, 119, 1) 0%, rgba(185, 175, 165, 0.85) 100%) !important;
  backdrop-filter: blur(5px);
}

/* adapt min-height to encompass all features */
.instructions-flex {
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.content-columns {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
}

.content-column1 {
  width: 35%;
  pointer-events: none;
}

.content-column2 {
  float: right;
  padding-left: 40px;
  padding-right: 30px;
  width: 65%;
  margin-left: 40px;
  border-width: 0px 0px 0px 0.5px;
  border-style: dashed;
  border-color: white;
  max-width: 750px;
  margin-bottom: 20px;
}

.buttons {
  float: right;
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

h1 {
  font-family: 'Teko', sans-serif;
  color: white;
  font-size: 3.0em;
  font-weight: 500;
  margin-bottom: 10px;
}

.instructions {
  width: 100%;
}

.instructions-intro {
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
  font-size: 0.95em;
  line-height: 1.5;
}

#instructions-tools {
  width: 450px;
  margin-left: calc(50% - 235px);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  padding: 0px 20px 10px 10px;
  border-style: solid;
  border-color: grey;
  border-width: 0.5px 0px 0px 0px;
  transform: scale(0.5);
  transition: all 0.5s ease-in-out;
}

.instructions-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  margin-bottom: 0px;
  min-height: 60px;
}

.instructions-item-icon {
  min-width: 32px;
  min-height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position-y: 50%;
  margin-left: 0px;
  margin-top: -15px;
}

.instructions-item-title {
  font-weight: 600;
  letter-spacing: 0.05em;
  color: white;
}

.instructions-item-description {
  color: white;
  margin-left: 20px;
  font-weight: 200;
  line-height: 1.3;
  font-size: 0.95em;
  user-select: none;
  -webkit-user-select: none;
  cursor: default;
  letter-spacing: 0.00em;
}

.instructions-item-label p {
  display: inline;
  /* font-weight:700; */
}

.instructions-language-button {
  margin-left: 10px;
  margin-top: 10px;
  z-index: 10001;
  color: white;
}

.main-about-content {
  background-color: green;
  height: auto;
}

.title-fields {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  width: 100%;
}

.instructions-main-title {
  font-family: 'Teko', sans-serif;
  color: white;
  font-weight: 100 !important;
  line-height: 0.7;
  text-align: right;
  font-size: 5.5vw;
  user-select: none;
  pointer-events: none;
}

.instructions-sub-title {
  align-self: end;
  font-family: 'Teko', sans-serif;
  color: white;
  font-weight: 100 !important;
  line-height: 0.8;
  text-align: right;
  margin-top: 20px;
  font-size: 3.5vw;
  margin-bottom: 0px;
  letter-spacing: 0px !important;
  user-select: none;
  pointer-events: none;
  width: auto;
  word-spacing: 1px;
}

@media screen and (min-width: 2100px) {
  .instructions-main-title {
    font-size: 7.5em;
  }

  .instructions-sub-title {
    font-size: 3.5em;
  }
}

@media screen and (max-width: 1400px) {

  .instructions-main-title {
    font-size: 5.0em;
  }
}

.instructions-article-main {
  align-self: end;
  font-family: "Barlow Condensed", sans-serif !important;
  color: white;
  text-align: right;
  font-size: 1.1em;
  line-height: 1.3;
  width: auto;
  font-weight: 100;
  padding: 0px;
  margin-bottom: 0px;
  padding-left: 40px;
  margin-top: 20px;
  margin-right: 0px;
  max-width: 450px;
}

.instructions-language-button {
  width: 120px;
  position: absolute;
  top: 20px;
  left: 15px;
}


.explore-button {
  margin-top: 0px;
  position: relative;
  margin-left: 20px;
  pointer-events: auto;
}

.category-button {
  font-family: "Barlow Condensed", sans-serif !important;
  margin-top: 30px;
  float: left;
  font-size: 1.0em !important;
  font-weight: 300;
  transition: all 0.1s ease-in-out;
  padding: 4px 15px !important;
  z-index: 1000;
  opacity: 1.0;
  right: 0px;
  color: black !important;
  background-color: rgb(250, 250, 250) !important;
}

.category-button:hover {
  color: white !important;
  background-color: rgb(180, 100, 100) !important;
}

/*   Mid screen adaption */
@media screen and (max-width: 1450px) {

  .insructions-main-title {
    font-size: 5em;
  }

  .instructions-sub-title {
    font-size: 3.0em;
  }
}

/*   Small screen adaption */
@media screen and (max-width: 900px) {
  h1 {
    color: vlack !important;
    font-size: 2.2em !important;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .buttons {
    float: left;
  }

  .instructions-flex {
    display: block;
  }

  .content-columns {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 50px 20px 80px 20px;
  }

  .content-column1 {
    width: 100%;
  }

  .content-column2 {
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
    float: none;
    margin-left: 0px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .instructions-main-title {
    display: none;
  }

  .instructions-sub-title {
    text-align: left;
    margin-left: 0px;
    font-size: 3.8em;
    align-self: start;
  }

  .instructions-article-main {
    align-self: start;
    padding-left: 0px !important;
    margin-top: 20px;
    text-align: left;
    width: 100%;
    max-width: 100%;
    margin-bottom: 0px;
    font-weight: 100 !important;
    font-size: 1.2em !important;
    padding-right: 0px !important;
  }

  .language-button {
    margin-left: 0px;
    z-index: 10001;
  }

  .instructions-item-label {
    margin-left: 20px;
    line-height: 1.4;
    font-size: 1.1em;
  }
}
</style>