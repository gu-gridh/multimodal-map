<template>
  <div class="about-container" v-bind:class="{fullopacity: visibleAbout}">
    <div class="flex-machine">
      <div class="red-content">
    <div class="about-main-title" v-bind:class="{fullopacityui: visibleAbout}">Extended <br>Rephotography</div>

    <div class="about-article-main" v-bind:class="{fullopacityui: visibleAbout}">
        Extended Rephotography is a transdisciplinary project focused on the glacial environment in northwest Svalbard. The core of the project is using Extended Reality (XR) technologies for field based visualizations and research analysis, documentation and communication of research results.
        The works aimed for the public is focused on storytelling and visualization using a wide range of historical data and on going research as a collaboration between several disciplines and institutions.
    </div>


 

      <div class="about-article-sub" v-bind:class="{fullopacityui: visibleAbout}">
      The project is led by Tyrone Martinsson and is a collaboration between University of Gothenburg, Norwegian Polar Institute, Visual Arena Lindholmen, Universeum, and University of Plymouth. Infravis, the national infrastructure for resaearch visualisation, has developed this tool to explore the data. The site is hosted and maintained by Gothenburg Research Infrastructure in Digital Humanities (GRIDH).
      </div>
  
    
    
      
        <button @click="$emit('close')">
            <div
              class="p-1 px-2 clickable category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"  v-bind:class="{fullopacityui: visibleAbout}">Explore</div>
          </button>
        </div>
        <div class="about-lower-border"> </div>
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
  height: 100%;
  width: 100%;
  font-size: 12px;
  z-index: 2000;
  backdrop-filter:blur(0px);
  pointer-events:none;
  transform:scale(1.5);
  translate: 0px 100px;
  transition: all 1.5s ease-in-out;
  opacity:0.0;
  overflow-y:auto;

}

.fullopacity{
  backdrop-filter:blur(5px);
  opacity:1.0;
  pointer-events:auto;
  transform:scale(1.0);
  translate: 0px 0px;
  background: linear-gradient(90deg, rgba(250, 250, 250,1) 0%, rgba(250, 250, 250,0.8) 100%);
 
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
  margin-top:100px;
  flex-basis:auto;
  width:100%;
  font-size: 105px;
  line-height: 0.9;
  font-weight: 100;
  letter-spacing: -0.2rem;
  text-align: center;
  color:black;
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
text-align:justify;
 color:black;
columns:2;
column-gap:30px;
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
