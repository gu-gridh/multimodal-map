<template>
  <div class="about-container" v-bind:class="{fullopacity: visibleAbout}">
    <div class="flex-machine">
      <div class="red-content">
    <div class="about-main-title" v-bind:class="{fullopacityui: visibleAbout}">Göteborgs<br>Jubileum</div>
    <div class="about-sub-title" v-bind:class="{fullopacityui: visibleAbout}">1923</div>

    <div class="about-article-main" v-bind:class="{fullopacityui: visibleAbout}">
      Då Göteborg firar 400 år vill vi här bjuda på en återblick till firandet för 100 år sedan.    
    </div>

      <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
Jubileumsutställningen i Göteborg invigdes den 8 maj 1923 av dåvarande kung Gustaf V. Utställningen arrangerades för att högtidlighålla stadens 300-årsjubileum 1921 men på grund av de höga ambitionerna och efterdyningarna av världskriget m.m. så blev utställningen fördröjd till 1923. På samma sätt har ju årets firande blivit fördröjt två år på grund av Covid-19 pandemin. Utställningen var planerad att stänga den 30 september men förlängdes till den 15 oktober och hade då besökts av 4,2 miljoner personer.
Det var en mycket stor utställning som omfattade stora delar av Göteborg och ett flertal av dagens mer välkända byggnader och institutioner grundades som exempelvis Göteborgs konstmuseum, Göteborgs botaniska trädgård, Naturhistoriska museet och Slottsskogsvallen. I huvudsak var utställningen lokaliserad till två områden: området för själva Jubileumsutställningen samt området för lantbruksmötet, luftfartsutställningen och nordisk trädgårdsutställning med båda på vardera över 220 000 m².
      </div>
      <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
Under jubileumsutställningen 1923 pågick en konstutställning med samtida nordisk konst på Konstmuseet och på Konsthallen. I den lokal som vi idag kallar Göteborgs Konsthall visades den norska delen av utställningen med bland andra Edvard Munch. Den danska och finska delen visades i två intilliggande byggnader som idag är rivna, medan den svenska konsten höll till inne på det nuvarande Göteborgs Konstmuseum.
      </div>
      <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
Bakom konstmuseet och upp emot området runt näckrosdammen var platsen för den Historiska minnesutställningen. Här visades olika former av historiska utställningar kopplade till olika ämnen som sjöfart, handel, konsthantverk och hemslöjd. En rolig detalj är att humanistiska fakulteten och Humanistiska biblioteket ligger precis där stora delar av utställningen då var lokaliserad. Biblioteket ligger i dag där huvudrestaurangen låg och Humanisten där minneshallen stod.
      </div>
      <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
Nedanför, på andra sida Korsvägen där nuvarande Svenska mässan ligger var Exportutställningen lokaliserad. Här visade många av de stora industriföretagen upp sina produkter.
Här kan du se bilder på de olika byggnaderna m.m. som stod på platsen under utställningen. Vi har även samlat en rad digitaliserade skrifter som på olika sätt berör utställningen, som du lätt hittar här. Återkom gärna vid flera tillfällen då vi kommer fortsätta att publicera digitaliserat material här.
      </div>
      <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
Göteborgs forskningsinfrastruktur för digital humaniora (GRIDH) i samarbete med Göteborgs universitetsbibliotek har tagit fram den här tjänsten som en del i ett större samarbete. Vi hoppas du kommer finna både bilder och texter intressanta.
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

<script lang="ts">
export default {
  name: "aboutview",
  props: {
    visibleAbout: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
body{
  border:opx;
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
width:850px;
font-size:1.8em;
opacity:0.0;
padding:00px 30px;
transition: all 0.4s ease-in-out;

}

.about-article-sub{
  position:relative;
  float:left;
  text-align:left;
  color:black;
  width:950px;
  font-size:1.4em;
  font-weight: 200;
  opacity:0.0;
  padding:30px;
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
  font-weight: bold;
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
  width:200px;
  height:90px;
  position:absolute;
  background:url(./images/logo-Infravis-516.png);
  background-repeat: no-repeat;
  background-size: contain;
  top:30px;
  right:60px;
  opacity:0.7;

}




</style>
