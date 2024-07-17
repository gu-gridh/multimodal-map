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

        <div class="about-main-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }"> 
          {{ $t('sonoratitle') }}
        </div>

        <div class="about-sub-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }"></div>

        <div class="about-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('aboutportalmain') }}
        </div>

        <button @click="$emit('close')" style="margin-top: 20px;">
          <div class="p-1 px-2 category-button" style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
            v-bind:class="{ fullopacityui: visibleAbout }"> {{ $t('explore') }}</div>
        </button>

        <div class="about-article-sub" v-bind:class="{ fullopacityui: visibleAbout }">
          {{ $t('aboutportalmain2') }} {{ $t('aboutportalmain3') }}
        </div>

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
                  <img v-for="(image, index) in slide.images" :key="index" :src="image" alt="slide image" class="carousel__image" />
                </div>
                <div class="text-content">
                  <h3>{{ slide.title }}</h3>
                  <p v-html="slide.content" class="carousel__text"></p>
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

<script lang="ts">
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
      // carousel settings
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
            '/sonora_archive/Erici exempel SE_ATA_ENSK_31-1_F5_12_00118.jpg',
            '/sonora_archive/Erici porträtt SE_ATA_ENSK_141-1_F1A_7_00125.jpg'
          ],
          title: 'Dr Einar Erici',
          content: `
            <p>Dr Einar Erici (1885–1965) was a physician who devoted much of his life to documenting historical Swedish organs and worked assiduously for their preservation. He published many articles on specific organs and organ builders, but his magnum opus was the Orgelinventarium, a detailed compilation of preserved pipe organs built in what he considered to be the “classical” building tradition.</p>
            <p>After Erici’s death, Axel Unnerbäck saw to it that the Erici archive was received by the Swedish National Heritage Board (Riksantikvariämbetet) in Stockholm, where it is held and managed today. Dr Unnerbäck, who worked at the board as a building antiquarian and an organ expert for many decades, was instrumental in getting the Orgelinventarium published in 1965; he published a revised edition of the book in 1988.</p>
            <p>The archive has the ID number SE/ATA/ENSK_31-1 and is organized into 28 boxes which in turn are grouped into eight series:</p>
            <ul>
              <li>F 1 Personal documents</li>
              <li>F 2 Manuscripts and printed articles</li>
              <li>F 3 Correspondence</li>
              <li>F 4 Documents about pipe organs</li>
              <li>F 5 Documents about organ builder</li>
              <li>F 6 Miscellaneous documents</li>
              <li>F 7 Photographs</li>
              <li>F 8 Magic lantern images</li>
            </ul>
          `
        },
        {
          id: '2',
          images: [ 
            '/sonora_archive/Unnerbäck exempel 3_24-03-18_53899.jpg',
            '/sonora_archive/Unnerbäck porträtt.jpg'
          ],
          title: 'Axel Unnerbäck',
          content: `Dr Axel Unnerbäck (b. 1938) was formerly the Head of the Division for the Documentation of Buildings at the Swedish National Heritage Board. He has worked as an organ expert and researcher, art historian, and building antiquarian, and has published extensively on the Swedish heritage of organs. During his long time working in the field, he built up a substantial reference archive containing information (both original documents and copies) about all kinds of organs in Sweden. As an organ researcher affiliated with GOArt (Göteborg Organ Art Center) at University of Gothenburg, he was responsible for the research on Swedish historical organs.`
        },
        {
          id: '3',
          images: [
            '/sonora_archive/Moberg exempel SE_ATA_ENSK_141-1_F1A_27_00442.jpg',
            '/sonora_archive/Moberg porträtt SE_ATA_ENSK_141-1_F1A_39_00051.jpg'
          ],
          title: 'The Moberg brothers',
          content: `
            <p>The organ builders Harry Moberg (1915–1992) and Valter Moberg (1915–2006) were pioneering specialists in the restoration and preservation of Swedish historical organs. After having worked for the organ builder John Vesterlund, they opened up their own workshop. They built only a small number of new organs, but carried out a vast number of organ restorations. Unusually for their time, restoration and reconstruction was the primary focus of their workshop. They also developed a document practice that was far more detailed than most organ restorers of their time, resulting in a large archive that was donated to the Swedish National Heritage Board (Riksantikvariämbetet) in Stockholm in 2008. The single most important part is F1A which contains documents about Swedish organs that they researched and/or worked on, organised alphabetically by place name.</p>
            <p>The archive has the ID number SE/ATA/ENSK_141 and is organised in the following series:</p>
            <ul>
              <li><strong>E 1-3:</strong> Correspondence</li>
              <li><strong>F 1 A-C:</strong> Documents relating to specific organs (including restoration proposals and reports)</li>
              <li><strong>F 1 D:</strong> Pipe scalings and reed pipes</li>
              <li><strong>F 1 E:</strong> Workshop documentation</li>
              <li><strong>F 2:</strong> Presentations and exhibitions regarding organs and organ restoration</li>
              <li><strong>F 3:</strong> Documents regarding the Association of Swedish Organ Builders</li>
              <li><strong>F 4:</strong> Personal documents</li>
              <li><strong>F 5–6:</strong> Business documents</li>
              <li><strong>F 7:</strong> Private documents</li>
              <li><strong>G 1–2:</strong> Accounting</li>
              <li><strong>H:</strong> Statistics</li>
              <li><strong>K:</strong> Photographs</li>
              <li><strong>L:</strong> Print publications</li>
              <li><strong>N:</strong> Objects</li>
              <li><strong>Z:</strong> Sound recordings</li>
            </ul>
          `
          },
        {
          id: '4',
          images: [ 
            '/sonora_archive/KSV exempel 240122_SONORA_0010_.jpeg',
            '/sonora_archive/KSV exempel 240122_SONORA_0010_.jpeg'
          ],
          title: 'Carl Gustaf Lewenhaupt',
          content: `
                    <p>Carl Gustaf Lewenhaupt (1949–2000) was an organist, organ consultant, and organ researcher affiliated with the Swedish National Heritage Board. As an independent consultant, he was instrumental in the construction of the Cahman style organ in the Kristine church (Magnussons Orgelbyggeri, Herwin Troje, 1982), Falun and oversaw the reconstruction of the Wahlberg organ in the Fredrik church, Karlskrona (Grönlunds Orgelbyggeri, 1987). He also worked on the restoration of a large number of historical organs, including the ones in Rappestad, Ekeby, Flisby and Västra Eneby. As an organ researcher affiliated with GOArt (Göteborg Organ Art Center) at University of Gothenburg, he was responsible for the development of instrument documentation methodology in close collaboration with Axel Unnerbäck and Niclas Fredriksson.</p>
                    <p>After his death his organ archive was donated to the Swedish National Heritage Board (Riksantikvariämbetet) in Stockholm, where it was organised by Unnerbäck and Fredriksson. The archive has the ID number SE/ATA/ENSK_215-1 and consists of four series of boxes.</p>
                    <ul>
                      <li>F 1 Text documents, tables and sketches</li>
                      <li>F 2 Drawings</li>
                      <li>K 1 Photographs</li>
                      <li>N 1 Objects</li>
                    </ul>
                  `
        },
        {
          id: '5',
          images: [
            '/sonora_archive/Wester exempel SE_ATA_ENSK_131-1_F2_69_00063.jpg',
            '/sonora_archive/Wester porträtt.jpg'
          ],
          title: 'Bertil Wester',
          content: `<p>Dr Bertil Wester (1902–1976), art historian, museum curator and musicologist specialising in Swedish historical organs, and a pioneer in academic organ research in Sweden. In 1936, he presented the first dissertation on historical organ building in Sweden, “Gotisk resning i svenska orglar”, and started a series of publications on Swedish Church Organs, which resulted in many articles on regional organ building traditions. He was a member of the Organ Committee of the Friends of Church Song, a very influential and active advisory body on issues concerning organ-building and restorations of Swedish historical organs in the decades around mid-twentieth century.</p>
                    <p>The archive has the ID number SE/ATA/ENSK_131-1 and is organised in the following series:</p>
                    <ul>
                      <li>F 1 Card catalogue</li>
                      <li>F 2 Notes</li>
                      <li>F 3-4 Documents regarding Abraham Hülphers’ works</li>
                      <li>F 5 A-C Correspondence</li>
                      <li>F 6 Manuscripts</li>
                      <li>F 7 Accounting</li>
                      <li>F 8 Photographs</li>
                      <li>F 9 Organ studies</li>
                      <li>F 10 Excerpts of organ contracts</li>
                      <li>F 11 Organ surveys</li>
                      <li>F 12 Organs at the Historical museum, Stockholm</li>
                      <li>F 13 Organs abroad</li>
                      <li>F 14 Organ Committee of the Friends of Church Song</li>
                      <li>F 15 Manuscript collection of Hennerberg I</li>
                      <li>F 16 Miscellaneous</li>
                      <li>F 17 Excerpts, measurements and notes</li>
                      <li>F 18 Excerpts from the works of Abraham Hülphers</li>
                      <li>F 19 Manuscript collection of Hennerberg II</li>
                      <li>F 20 Miscellaneous</li>
                      <li>J 1 Drawings and stereotype prints</li>
                      <li>K 1 Magic lantern images</li>
                    </ul>
                    `
        },
        {
          id: '6',
          images: [
            '/sonora_archive/KSV exempel 240122_SONORA_0010_.jpeg',
            '/sonora_archive/KSV exempel 240122_SONORA_0010_.jpeg'
          ],
          title: 'The Organ Committee of the Friends of Church Song',
          content: '<p>The Friends of Church Song was an association formed in 1889 to promote singing in the Swedish churches. In 1934 they formed an organ committee to advise congregations looking to build a new organ or do work on an existing instrument. The three original members of the committee were the organists Henry Weman and Waldemar Åhlén, and the organ historian Bertil Wester. The committee was very influential in promoting the ideas of the organ reform movement in Sweden as well as stimulating the interest in early Swedish organs. In 1967, the Organ Council was dissolved following a dispute with the National Heritage Board over the 18th-century organ in Börstil.</p> <p>The archive is divided between two locations, with a portion forming part of the archive of Bertil Wester, and the remaining material (consisting of administration documents, and the personal archive of Henry Wehman) housed in the Special Collections of Uppsala University Library.</p>'
        },
      ],
    };
  },
  watch: {
    visibleAbout(newVal) {
      if (newVal) {
        // If visibleAbout is true, immediately show the container
        this.displayAbout = true;
      } else {
        // if visibleAbout is false, wait for the transition to finish before hiding
        setTimeout(() => {
          this.displayAbout = false;
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
  max-width: 800px;
  max-height: 500px;
  margin: 0 auto;
  padding: 0 10px;
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
  max-width: 100%;
  max-height: 200px;
  margin: 0 auto;
}

.carousel__text {
  text-align: left;
}

.custom-carousel .carousel__slide {
  align-items: flex-start !important;
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

.carousel-container .custom-carousel >>> .carousel__prev,
.carousel-container .custom-carousel >>> .carousel__next {
    top: 12%;
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

  .carousel-container {
    max-width: 100%;
    padding: 0 15px;
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
    height: auto;
    min-height: 100px;
    width: 150px;
    margin: 10px;
  }
}
</style>
