<template>
  <div class="about-container" v-bind:class="{ fullopacity: visibleInstructions }">

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
              <div class="sophia-sub-title theme-color-text" v-bind:class="{ fullopacityui: visibleAbout }">
                User
                <br>
                Guide
              </div>
            </div>
          </div>
          <div class="left-content-column2">
            <div class="sophia-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
              {{ $t('aboutportalmain') }}
            </div>
        
            

					<div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(@/assets/marker-white.svg)"></div>
						<div class="guide-instructions-item-label">
							<p id="4">Test text that could describe for instance a filter function or search or something</p>
						</div>
					</div>

					<div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/viewer/shared/interface/colour_on.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="5"></p>
						</div>
					</div>

					<div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/viewer/shared/interface/specular_on.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="6"></p>
						</div>
					</div>

					<div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/viewer/shared/interface/light_on.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="7"></p>
						</div>
					</div>

			

            <div class="explore-button">
              <button @click="$emit('close')">
                <div class="p-1 px-2 category-button"
                  style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"
                  v-bind:class="{ fullopacityui: visibleAbout }">{{ $t('close') }}</div>
              </button>
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
    name: "aboutinstructionsview",
    props: {
      visibleInstructions: {
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

.guide-instructions{
  width: 100%;
}

.guide-instructions-intro{
   width: 100%;
  text-align:center;
  margin-bottom:15px;
  font-size:0.95em;
  line-height: 1.5;
}

#guide-instructions-tools{
  width:450px;
  margin-left:calc(50% - 235px);
  background-color:rgba(0,0,0,0.5);
  border-radius:12px;
  padding:0px 20px 10px 10px;
  border-style: solid;
  border-color: grey;
  border-width:0.5px 0px 0px 0px;
  transform:scale(0.5);
  transition: all 0.5s ease-in-out;
}

.guide-instructions-item{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items:center;
  margin-bottom:15px;
}

.guide-instructions-item-icon{
min-width:32px;
min-height:32px;
background-size: contain;
background-repeat: no-repeat;
background-position-y:50%;
margin-left:5px;
background-color:grey;

}

.guide-instructions-item-label{
  color:white;
  margin-left:20px;
  font-weight:200;
  line-height: 1.3;
  font-size:0.95em;
  user-select: none;
  -webkit-user-select: none;
  cursor:default;
}

.guide-instructions-item-label p{
  display:inline;
  /* font-weight:700; */
}

  .instructions-container {
    color: white;
    overflow-y: auto;
    background: rgba(0,0,0,0.5);
    padding-bottom: 0px !important;
    padding-right: 0px !important;

    pointer-events: none;
  height: calc(100vh - 80px);
  position: absolute;
  line-height: 1;
  width: 100%;
  z-index: 2000;
  backdrop-filter: blur(5px);
  transform: scale(1.5);
  translate: 0px 100px;
  transition: all 1.5s ease-in-out;
  opacity: 0.0;
  overflow-y: auto;
  }

  .fullopacity {
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(5px);
  }

  .sophia-main-title {
    font-family: "Alumni Sans Pinstripe", sans-serif;
    color: white !important;
    font-weight: 100 !important;
    line-height: 0.7;
    text-align: right;
    font-size: 7vw;
    top: 40%;
    user-select: none;
    pointer-events:none;

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
    user-select: none;
    pointer-events:none;
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
    margin-bottom:20px;
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
    width: 100%;
    float: right;
    margin-top: 0px;
    padding-right: 10px;
    min-width: 800px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .right-content {
    height: calc(100vh - 80px);
    width: 00%;

    background-size: cover;
    float: right;
  }


  .left-content-columns {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    float: right;
    padding-right: 10px;

  }

  .left-content-column1 {
    float: right;
    width: 40%;
  }

  .left-content-column2 {
    float: right;
    padding-left: 40px;
    width: 60%;
    margin-left: 40px;
    border-width: 0px 0px 0px 0.5px;
    border-style: dashed;
    border-color: grey;
    max-width: 600px;
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
    width: 100%;
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

    .logo-area{
      display:none;
    }
   
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
      margin-bottom: 30px;
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
      z-index: 10001;
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