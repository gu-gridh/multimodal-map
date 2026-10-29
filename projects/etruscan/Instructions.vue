<template>
  <div class="instructions-container" v-bind:class="{ fullopacity: visibleInstructions }"
    :style="{ display: displayInstructions ? 'block' : 'none' }">

    <!-- language-switcher (optional depending on site) -->
    <div class="instructions-language-button">
      <button @click="toggleLanguage">{{ $t('languagebutton') }}</button>
    </div>

     <!-- top right close icon -->
     <button @click="$emit('close')">
      <div class="close-instructions-button" v-bind:class="{ fullopacityui: visibleInstructions }">+</div>
    </button>

    <!--    keeps instructions vertically centered -->
    <div class="instructions-flex">

      <div class="content-columns">

        <!--  title column -->
        <div class="content-column1">
          <div class="title-fields">

            <!--  Main title or logo of the site -->
            <div class="instructions-main-title" style="">
              Tombe<br>Etrusche<br> A Camera
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
              style="background-image:url(https://data.dh.gu.se/ui-icons/inspect_black.png)"></div>
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
                      style="background-image:url(https://data.dh.gu.se/ui-icons/search_black.png)"></div>
                    <div class="instructions-item-description">
                      <div class="instructions-item-title">{{ $t('f2title') }}</div>
                      <p>{{ $t('f2description') }}</p>
                    </div>
                  </div>

          <!-- repeat -->

          <div class="instructions-item">
            <div class="instructions-item-icon"
              style="background-image:url(https://data.dh.gu.se/ui-icons/search_black.png)"></div>
            <div class="instructions-item-description">
              <div class="instructions-item-title">{{ $t('f3title') }} </div>
              <p>{{ $t('f3description') }}</p>
            </div>
          </div>

    
          <!-- repeat -->

          <div class="instructions-item">
            <div class="instructions-item-icon"
              style="background-image:url(https://data.dh.gu.se/ui-icons/zoomin_big_black.png)"></div>
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

  import i18n from '../../src/translations/etruscan.js';

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
          i18n.global.locale = 'it';
        } else {
          i18n.global.locale = 'en';
        }
      },
      toggleLanguageIT() {
        i18n.global.locale = 'it';
      },
      toggleLanguageEN() {
        i18n.global.locale = 'en';
      }
    },
  };



</script>

<style scoped src="./styles/instructions.css"></style>