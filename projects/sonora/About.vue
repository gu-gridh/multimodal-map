<template>
  <div class="about-container" v-bind:class="{ fullopacity: visibleAbout }"
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

        <div class="about-main-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('sonoratitle') }}
        </div>

        <div class="about-sub-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }"></div>

        <div class="about-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('aboutportalmain') }}
        </div>


        <div class="about-article-sub" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('aboutportalmain2') }} {{ $t('aboutportalmain3') }}
        </div>

        <button @click="$emit('close')" style="margin-top: 30px;">
          <div class="p-1 px-2 category-button"
            style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
            v-bind:class="{ fullopacityui: visibleAbout }"> {{ $t('explore') }}</div>
        </button>

        <div class="about-logos-container">
          <div class="about-logo about-logo-bottom"></div>
          <div class="about-logo about-logo-bottom2"></div>
          <div class="about-logo about-logo-bottom3"></div>
          <div class="about-logo about-logo-bottom4"></div>
        </div>

        <div class="about-main-subtitle theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('thearchives') }}
        </div>

        <div class="carousel-container" v-if="displayAbout">
          <Carousel v-bind="settings" :breakpoints="breakpoints" class="custom-carousel">
            <Slide v-for="slide in slides" :key="slide.id">
              <div class="carousel__item">
                <div class="carousel__images">
                  <img v-for="(image, index) in slide.images" :key="index" :src="image" alt="slide image"
                    :style="image === '/sonora_archive/Moberg-2.jpg' ? { maxHeight: '300px', margin: '0 auto' } : { maxWidth: '300px', maxHeight: '300px', margin: '0 auto' }" />
                </div>
                <div class="text-content">
                  <h3 v-html="$t(slide.title)"></h3>
                  <p v-html="$t(slide.content)" class="carousel__text"></p>
                </div>
              </div>
            </Slide>
            <template #addons>
              <Navigation />
            </template>
          </Carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '../../src/translations/sonora';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel'

export default {
  name: "aboutview",
  props: {
    visibleAbout: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  data() {
    return {
      displayAbout: this.visibleAbout,
      //carousel settings
      settings: {
        itemsToShow: 1,
        snapAlign: 'center',
      },
      breakpoints: {
        // 700px and up
        700: {
          itemsToShow: 1,
          snapAlign: 'center',
        },
        // 1024 and up
        1024: {
          itemsToShow: 1,
          snapAlign: 'start',
        },
      },
      slides: [
        {
          id: '1',
          images: [
            '/sonora_archive/Erici-1.jpg',
            '/sonora_archive/Erici-2.jpg'
          ],
          title: 'erici_title',
          content: 'erici_content'
        },
        {
          id: '2',
          images: [
            '/sonora_archive/Unnerback-1.jpg',
            '/sonora_archive/Unnerback-2.jpg'
          ],
          title: 'axel_title',
          content: 'axel_content'
        },
        {
          id: '3',
          images: [
            '/sonora_archive/Moberg-1.jpg',
            '/sonora_archive/Moberg-2.jpg'
          ],
          title: 'moberg_title',
          content: `moberg_content`
        },
        {
          id: '4',
          images: [
            '/sonora_archive/lewen1.jpg',
            '/sonora_archive/lewen2.jpeg'
          ],
          title: 'lewenhaupt_title',
          content: `lewenhaupt_content`
        },
        {
          id: '5',
          images: [
            '/sonora_archive/Wester-1.jpg',
            '/sonora_archive/Wester-2.jpg'
          ],
          title: 'wester_title',
          content: `wester_content`
        },
        {
          id: '6',
          images: [
            '/sonora_archive/ksv1.jpeg',
            '/sonora_archive/ksv2.jpg'
          ],
          title: 'friends_of_church_song_title',
          content: `friends_of_church_song_content`
        },
      ],
    };
  },
  watch: {
    visibleAbout(newVal) {
      if (newVal) {
        //if visibleAbout is true, immediately show the container
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

.about-main-subtitle {
  font-family: 'Teko', sans-serif;
  color: white !important;
  line-height: 0.9;
  margin-bottom: 2%;
  font-size: 3.0em;
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

.carousel-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 52px 32px;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 14px;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.24);
}

.carousel-container .custom-carousel {
  padding: 0;
  background: none;
}

.carousel-container h3 {
  font-size: 1.5em;
  margin-bottom: 2%;
  margin-top: 5%;
}

.carousel__item {
  text-align: left;
  font-size: 1.1em;
  font-family: "Barlow Condensed", sans-serif !important;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel__images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.carousel__image {
  max-width: 300px;
  max-height: 300px;
  margin: 0 auto;
}

.carousel__text {
  text-align: left;
  display: block;
  background: none;
  padding: 0;
  border-radius: 0;
  max-width: 100%;
}

.carousel__item h3 {
  display: block;
  background: none;
  padding: 0;
  border-radius: 0;
  margin-bottom: 10px;
}

.custom-carousel .carousel__slide {
  align-items: center !important;
  justify-content: center !important;
}

.text-content {
  max-width: 80%;
  margin: 0 auto;
}

.about-logos-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 50px;
  padding: 30px 0;
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

.carousel-container .custom-carousel :deep(.carousel__prev),
.carousel-container .custom-carousel :deep(.carousel__next) {
  top: 40%;
  width: 72px !important;
  height: 72px !important;
}

.carousel-container .custom-carousel :deep(.carousel__prev svg),
.carousel-container .custom-carousel :deep(.carousel__next svg) {
  width: 50px !important;
  height: 50px !important;
}

@media screen and (min-width: 901px) {
  .carousel-container .custom-carousel :deep(.carousel__prev) {
    left: -60px !important;
  }

  .carousel-container .custom-carousel :deep(.carousel__next) {
    right: -60px !important;
  }
}

@media screen and (max-width: 900px) {
  .carousel-container .custom-carousel :deep(.carousel__prev),
  .carousel-container .custom-carousel :deep(.carousel__next) {
    top: -75px !important;
    left: 47% !important;
    right: auto !important;
    transform: translateX(-60px) !important;
  }

  .carousel-container .custom-carousel :deep(.carousel__next) {
    transform: translateX(-8px) !important;
  }

  .carousel-container .custom-carousel :deep(.carousel__prev svg),
  .carousel-container .custom-carousel :deep(.carousel__next svg) {
    width: 32px !important;
    height: 32px !important;
  }

  .category-button {
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
    font-size: 3.5em !important;
  }

  .about-article-main {
    font-size: 1.3em !important;
    font-weight: 300;
  }

  .about-article-sub {
    font-size: 1.0em !important;
    font-weight: 300;
  }

  .carousel-container {
    max-width: 100%;
    padding: 72px 18px 16px;
  }

  .about-logos-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    align-items: center;
  }

  .about-logo {
    float: left;
    height: 100px;
    width: 200px;
    margin: 0px;
  }

  .about-logo-bottom {
    margin-bottom: 20px;
  }
}
</style>
