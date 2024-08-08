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
              <div class="sophia-main-title" v-bind:class="{ fullopacityui: visibleAbout }">Написи
                <br>Святої
                <br>Софії
              </div>
              <div class="sophia-sub-title" v-bind:class="{ fullopacityui: visibleAbout }">
                {{ $t('userguide') }}
              </div>
            </div>
          </div>
          <div class="left-content-column2">
            <div class="sophia-article-main" v-bind:class="{ fullopacityui: visibleAbout }">
             This portal makes available a scientifc documentation of the inscriptions of Saint Sophia Cathedral in Kyiv. 
             The data collection has been carried out using a number of overlapping and complementary techniques to ensure an as trustworty source material as possible. 
             To explore this rich and varied material, the portal presents several different inroads. 
            </div>
        
            <h1>Features</h1>
             
            <div class="guide-instructions-item">
              <div class="guide-instructions-item-icon" style="background-image:url(/eyebuttonwhite.png)"></div>
              <div class="guide-instructions-item-label">
                <p id="4">Use the centrally placed widget at the top of the screen to switch betwen an interactive plan of the cathedral, a gallery of the documented Surfaces or a gallery of the individual Inscriptions. 
                 </p>
              </div>
            </div>
            
					<div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/eyebuttonwhite.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="4">The interactive plan shows the position of all the documented surfaces rendered on top of a plan of the cathedral. The colours indicate the amount of annotated inscriptions for each surface, ranging from yeallow to bright red. 
                Switch beteeen Ground Floor and Second Floor with the widget at the bottom of the page. 
                Zoom in by scrolling or double-clicking, and click-and-drag to pan the view.</p>
						</div>
					</div>

          <div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/searchbuttonwhite.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="4">Use the tags at the top of the Surfaces- and Inscriptions galleries to filter down the result to a partcular theme or keyword. you can combine several tags to narrow down the result</p>
						</div>
					</div>
  

					<div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/searchbuttonwhite.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="4">To the left you have controls to filter down the result to inscriptions in a particular language, or filter by type of inscription (Text, Figure or Composite).</p>
						</div>
					</div>

          <div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/searchbuttonwhite.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="4">You can also use the search bar to search for a particular surface or inscription using room, name or tag. The inscription search lets you search both for structured data such as title, genre and tags, but also transcriptions and translations of the texts and descriptions of figures.</p>
						</div>
					</div>

          <div class="guide-instructions-item">
						<div class="guide-instructions-item-icon"
							style="background-image:url(/plus_big.png)"></div>
						<div class="guide-instructions-item-label">
							<p id="4">Click on a surface or inscription to enter the Viewer where you can explore all the documentation and asscoiated data. This includes high resolution orthophotos, topographical visualisations, interactive 3D data, RTI photography, and the possibility to explore the spatial context of the surface through a 3D scan of the cathedral interiors.</p>
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
  h1{
color:white!important;
font-size:2.0em;
font-weight:100;
margin-bottom:20px;
  }

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
  min-height:60px;
}

.guide-instructions-item-icon{
min-width:32px;
min-height:32px;
background-size: contain;
background-repeat: no-repeat;
background-position-y:50%;
margin-left:0px;


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

  .main-about-content {
    display: flex;
    flex-direction: row;
    align-items: top;
    padding: 0px;
    height: auto;
    overflow-y: auto;
  }

  .left-content {
    width: 100%;
    float: right;
    margin-top: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:flex-end;
    padding-top:0px;
    padding-bottom:0px;
 
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
    width: 30%;
    display: flex;
    flex-direction: row;
    justify-content:flex-end;
  }

  .left-content-column2 {
    float: right;
    padding-left: 40px;
    width: 70%;
    margin-left: 40px;
    border-width: 0px 0px 0px 0.5px;
    border-style: dashed;
    border-color: grey;
    max-width: 750px;
    margin-bottom:20px;
  }

  .title-fields{

  }

  .sophia-main-title {
    font-family: "Alumni Sans Pinstripe", sans-serif;
    color: white !important;
    font-weight: 100 !important;
    line-height: 0.7;
    text-align: right;
    font-size: 7vw;
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
 width:auto;
 word-spacing:1000px;
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
    h1{
color:white!important;
font-size:2.2em!important;
font-weight:100;
margin-bottom:20px;
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
      padding-left: 50px;
      min-width: auto;
      padding-right: 20px;
      margin-top: 80px;
      z-index: 10000;
      position: absolute;
      padding-bottom: 20px;
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

    }

    .left-content-column1 {
    width:100%;
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
      width:auto;
      display:none;
   
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

    .guide-instructions-item-label{
  margin-left:20px;
  line-height: 1.4;
  font-size:1.1em;

}


  }




</style>