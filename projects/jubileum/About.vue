<template>
  <div class="about-container" v-bind:class="{ fullopacity: visibleAbout }" :style="{ display: displayAbout ? 'block' : 'none' }">
    <div class="flex-machine">
      <div class="red-content">
    <div class="about-main-title" v-bind:class="{fullopacityui: visibleAbout}">Göteborgs<br>Jubileum</div>
    <div class="about-sub-title" v-bind:class="{fullopacityui: visibleAbout}">1923</div>

    <div class="about-article-main"  v-bind:class="{fullopacityui: visibleAbout}">
      Då Göteborg firar 400 år vill vi här bjuda på en återblick till firandet för 100 år sedan.    
    </div>

      <div class="about-article-sub"  v-bind:class="{fullopacityui: visibleAbout}">
<p>Jubileumsutställningen i Göteborg invigdes den 8 maj 1923 av dåvarande kung Gustaf V. Utställningen arrangerades för att högtidlighålla stadens 300-årsjubileum 1921 men på grund av de höga ambitionerna och efterdyningarna av världskriget m.m. så blev utställningen fördröjd till 1923. På samma sätt har ju årets firande blivit fördröjt två år på grund av Covid-19 pandemin. Utställningen var planerad att stänga den 30 september men förlängdes till den 15 oktober och hade då besökts av 4,2 miljoner personer.
 Det var en mycket stor utställning som omfattade stora delar av Göteborg och ett flertal av dagens mer välkända byggnader och institutioner grundades som exempelvis Göteborgs konstmuseum, Göteborgs botaniska trädgård, Naturhistoriska museet och Slottsskogsvallen. I huvudsak var utställningen lokaliserad till två områden: området för själva Jubileumsutställningen samt området för lantbruksmötet, luftfartsutställningen och nordisk trädgårdsutställning med båda på vardera över 220 000 m².</p>

    <p>Under jubileumsutställningen 1923 pågick en konstutställning med samtida nordisk konst på Konstmuseet och på Konsthallen. I den lokal som vi idag kallar Göteborgs Konsthall visades den norska delen av utställningen med bland andra Edvard Munch. Den danska och finska delen visades i två intilliggande byggnader som idag är rivna, medan den svenska konsten höll till inne på det nuvarande Göteborgs Konstmuseum.</p>

      <p>Bakom konstmuseet och upp emot området runt näckrosdammen var platsen för den Historiska minnesutställningen. Här visades olika former av historiska utställningar kopplade till olika ämnen som sjöfart, handel, konsthantverk och hemslöjd. En rolig detalj är att humanistiska fakulteten och Humanistiska biblioteket ligger precis där stora delar av utställningen då var lokaliserad. Biblioteket ligger i dag där huvudrestaurangen låg och Humanisten där minneshallen stod.
Nedanför, på andra sidan Korsvägen där nuvarande Svenska mässan ligger var Exportutställningen lokaliserad. Här visade många av de stora industriföretagen upp sina produkter. </p>

<p>Här kan du se bilder på de olika byggnaderna m.m. som stod på platsen under utställningen. Vi har även samlat en rad digitaliserade skrifter som på olika sätt berör utställningen, som du lätt hittar här. Återkom gärna vid flera tillfällen då vi kommer fortsätta att publicera digitaliserat material här.</p>

<p>Bakgrundskartan till portalen kommer från kartverket <i>Historiskt kartverk över Göteborg upprättat för Jubileumsutställningen i Göteborg 1923 av andre stadsingenjören Arvid Södergren</i> som har <a href="https://gupea.ub.gu.se/handle/2077/38284">digitiserats av Göteborgs Universitetsbibliotek</a>.
Kartverket beskriver stadens utveckling från att den grundades, dels med autentiska historiska kartor, dels med en serie nyproducerade kartor med historiskt innehåll från 1790-1921 med 30 till 10 års mellanrum. Som bakgrundskarta har vi använt kartbladet som beskriver Göteborgs centrum år 1921 i skala 1:4000 där utställningsområdet också finns utritat.</p>
<h2>Om Portalen </h2>
<p>Göteborgs jubileum 1923 är ett samarbetsprojekt mellan Göteborgs universitetsbibliotek (GUB) och Göteborgs infrastruktur för digital humaniora (GRIDH). 
Bilderna och trycksakerna kommer från bibliotekets samlingar, Göteborgs stadsmuseums databas <a href="https://samlingar.goteborgsstadsmuseum.se/carlotta/web/">Carlotta</a>,  <a href="https://sv.wikipedia.org/wiki/Portal:Huvudsida]och">Wikipedia</a> och <a href="https://sv.wikipedia.org/wiki/Portal:Huvudsida">Filmarkivet</a>. Samtliga bilder har fri upphovsrätt.  </p>

<p>Bild- och platsbeskrivningar: Siska Humlesjö och Johan Åhlfeldt, GRIDH. Text om jubileet och projektet: Anders Strinnholm, GUB.
Samordning av digitaliseringen av Universitetsbibliotekets material: Lennart Stark, GUB. 
Utvecklingen av gränssnittet: Jonathan Westin, Tristan Bridge och Kristin Åkerlund, GRIDH. 
Utveckling av datamodellen och backend: Johan Åhlfeldt och Aram Karimi, GRIDH.</p>

<p><b>För att citera portalen som helhet:</b> <br>
  Humlesjö, Siska, Åhlfeldt, Johan, Strinnholm, Anders <i>et al.</i> (2023).
      <i>Göteborgs jubileum 1923</i>, v.1.0 GRIDH. https://jubileet1923.dh.gu.se/. Accessed [datum].</p>
<p><b>För att citera kodbasen:</b><br>
  Westin, Jonathan, Bridge, Tristan, Åkerlund, Kristin & Karimi, Aram ”gu-gridh/multimodal-map/projects/jubileum: v.1.0 Initial public release" Github, May 24, 2023. https://github.com/gu-gridh/multimodal-map/tree/main/projects/jubileum</p>      
  Bilder: <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.sv">CC0 1.0</a> | Texter: <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
</div>
    
        <button @click="$emit('close')">
            <div
              class="p-1 px-2 clickable category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"  v-bind:class="{fullopacityui: visibleAbout}">Utforska</div>
          </button>
        </div>
        <div class="about-lower-border" v-bind:class="{fullopacityui: visibleAbout}"> </div>
      </div>
       
        <div class="about-logo-top-right"> </div>

  </div>
  

</template>

<script lang>
export default {
  name: "aboutview",
  props: {
    visibleAbout: {
      type: Boolean,
      required: true,
    },
  },
  components: {
 
  },
  data() {
    return {
      displayAbout: this.visibleAbout,
      // carousel settings
      
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
    
  },
};
</script>

<style scoped>
body{
  border:opx;
}

h2{
  font-size:120%;
  font-style:bold;
  margin-bottom:5px;
}
.about-container {
  position:fixed;
  color: white;
  line-height: 1;
  width: 100%;
  font-size: 12px;
  z-index: 2000;
  backdrop-filter:blur(0px);
  pointer-events:none;
  transform:scale(1.5);
  translate: 0px 100px;
  transition: all 0.5s ease-in-out;
  opacity:0.0;
  height: calc(100% - 80px);
  overflow-y: scroll;
  background: linear-gradient(90deg, rgba(245, 235, 225,1) 0%, rgba(245, 235, 225,0.8) 30%);
}

.fullopacity{
  backdrop-filter:blur(5px);
  opacity:1.0;
  pointer-events:auto;
  transform:scale(1.0);
  translate: 0px 0px;
  background: linear-gradient(90deg, rgba(245, 235, 225,1) 0%, rgba(245, 235, 225,0.8) 100%);
}

.flex-machine{
  height:100%;
  display:flex;
  flex-direction:column;
}

.red-content{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content: start;
  width:auto;

}

.about-main-title {
  font-family: "Josefin Sans", sans-serif !important;
  margin-top:100px;
  flex-basis:auto;
  width:100%;
  font-size: 105px;
  line-height: 0.85;
  font-weight: 100;
  letter-spacing: -0.2rem;
  text-align: center;
  color:rgb(180,100,100);
  opacity:0.0;
  margin-bottom:40px;
  transition: all 0.4s ease-in-out;
}

.about-sub-title {
  font-family: "Josefin Sans", sans-serif !important;
  margin-top:-30px;
  flex-basis:auto;
  width:100%;
  font-size: 65px;
  line-height: 0.9;
  font-weight: 100;
  letter-spacing: -0.2rem;
  text-align: center;
  color:rgb(180,100,100);
  opacity:0.0;
  margin-bottom:40px;
  transition: all 0.4s ease-in-out;
}

.about-article-main{
 position:relative;
 float:left;
 text-align:center;
 color:black;
 font-weight: 100;
 columns:1;
 column-gap:30px;
 max-width:1400px;
 font-size:2.0em;
 opacity:0.0;
 padding:0px 100px;
 transition: all 0.4s ease-in-out;

}

.about-article-sub{
  position:relative;
  float:left;
  text-align:justify;
  color:black;
  columns:2;
  width:auto;
  padding:30px 100px;
  column-gap:30px;
  max-width:1400px;
  font-size:1.4em;
  line-height:1.1;
  font-weight: 300;
  opacity:0.0;
  transition: all 0.4s ease-in-out;
}

.category-button{
  position:relative;
  float:left;
  font-size:2em;
  font-weight:400;
  transition: all 0.4s ease-in-out;
  background-color:rgb(230,230,230);
  padding:8px 20px !important;
  z-index:1000;
  opacity:1.0;
  margin-bottom:50px;
}

.fullopacityui{
  opacity:1.0;
}

a {
  font-weight: normal;
}

.about-lower-border{
  flex-grow: 1;
  margin-top:0px;
  pointer-events:none;
  width:100%;
  height:300px;
  position:relative;
  background:url(./images/about-mountains.png);
  background-repeat: no-repeat;
  background-size: cover;
  opacity:0.7;

}

.about-logo-top-right{
  display:block;
  pointer-events:none;
  width:180px;
  height:180px;
  padding:20px;
  position:absolute;
  background:url(../../public/gu-logo-sv.png);
  background-repeat: no-repeat;
  background-position:center;
  background-size: 80%;
  background-color:rgb(180,100,100);
  top:0px;
  right:50px;
  opacity:1.0;
  border-radius:0px 0px 4px 4px;
  box-shadow: 0px 3px 10px 0 rgba(0, 0, 0, 0.3),
    0 0px 0px 0px rgba(0, 0, 0, 0.4);
}


@media screen and (max-width: 900px) {

.about-article-sub{
  font-size:1.25em;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
}
</style>
