<template>
  <div class="about-container" v-bind:class="{abouthidden: !visibleAbout}">
    <div class="flex-machine"  v-bind:class="{abouthiddenui: !visibleAbout}">
      <div class="red-content" >
    <div class="about-main-title" >Extended <br>Rephotography</div>

    <div class="about-article-main">
        Extended Rephotography is a transdisciplinary project focused on the glacial environment in northwest Svalbard. The core of the project is using Extended Reality (XR) technologies for field based visualizations and research analysis, documentation and communication of research results.
        The works aimed for the public is focused on storytelling and visualization using a wide range of historical data and on going research as a collaboration between several disciplines and institutions.
    </div>




      <div class="about-article-sub">
      The project is led by Tyrone Martinsson and is a collaboration between University of Gothenburg, Norwegian Polar Institute, Visual Arena Lindholmen, Universeum, and University of Plymouth. Infravis, the national infrastructure for information visualisation, has developed this tool to explore the data. The site is hosted and maintained by Gothenburg Research Infrastructure in Digital Humanities (GRIDH).
      </div>
  
    
    
      
        <button @click="$emit('close')">
            <div
              class="p-1 px-2 clickable category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"  v-bind:class="{abouthiddenui: !visibleAbout}">Explore</div>
          </button>
        </div>
        <div class="about-lower-border" v-bind:class="{abouthiddenui: !visibleAbout}"> </div>
        <div class="about-logo-top-right"> </div>
      </div>
       
       

  </div>
  

</template>

<script>
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
.about-container {
  backdrop-filter:blur(3px);
  pointer-events:auto;
  transform:scale(1.0);
  translate: 0px 0px;
  transition: all 0.0s ease-in-out;
  opacity:1.0;
  background: linear-gradient(90deg, rgba(250, 250, 250,1) 0%, rgba(250, 250, 250,0.7) 100%);
}


.flex-machine{
  opacity:1.0; 
  height:100%;
  display:flex;
  flex-direction:column;
}

.abouthidden{
  transition: all 1.5s ease-in-out;
  backdrop-filter:blur(5px);
  opacity:0.0;
  pointer-events:none;
  transform:scale(1.5);
  translate: 0px 100px;
  background: linear-gradient(90deg, rgba(250, 250, 250,1) 0%, rgba(250, 250, 250,0.5) 30%);
}

.abouthiddenui{
  transition: all 1.5s ease-in-out;
  opacity:0.0; 
}


.about-main-title {
font-family: "Barlow Condensed", sans-serif !important;
line-height: 0.9;
font-weight: 100;
letter-spacing: -0.2rem;
text-align: center;
color:black;
margin-bottom:50px;
user-select: none;
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
  margin-bottom:50px;
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
  transition: all 0.4s ease-in-out;
}

.about-logo-top-right{
  z-index:1000;
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
  opacity:1.0;
  transition: all 0.4s ease-in-out;
}

.category-button{
  position:relative;
  float:left;
  font-size:1.4vw!important;
  font-weight:400;
  transition: all 0.4s ease-in-out;
  padding:8px 20px !important;
  z-index:1000;
  opacity:1.0;
  margin-bottom:0px;
}

.about-main-title {
  font-family: 'Teko', sans-serif;
}


@media screen and (max-width: 1500px) {
.category-button{

  font-size:1.2em!important;

}
}

@media screen and (max-width: 900px) {
.category-button{
margin-top:30px;
  font-size:1.9em!important;
  margin-bottom:50px!important;

}

.about-main-title {
font-size:4em!important;
}

.about-container {
  
}
}





</style>
