<template>
  
  <div class="about" v-bind:class="{fullopacity: visibleAbout}">
    <div class="main-title" v-bind:class="{fullopacityui: visibleAbout}">Extended <br>Rephotography</div>

    <div style="display:flex;  align-items: center; justify-content: center; margin-top:60px;">
      <div class="article" v-bind:class="{fullopacityui: visibleAbout}">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, 
        sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, 
        nisi ut aliquid ex ea commodi consequatur? 
        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, 
        vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
      </div>
    </div>
    <div style="display:flex;  align-items: center; justify-content: center; margin-top:80px;">

    <button class="item" @click="visibleAbout = false;">
            <div
              class="p-1 px-2 clickable category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;">Explore</div>
          </button>
        </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "aboutview",
  data() {
    return {
      visibleAbout:true
  }
  },
};
</script>

<style scoped>
.about {
  position:fixed;
  background-color: #999;
  color: white;
  line-height: 1;
  height: 100vh;
  width: 100%;
  font-size: 12px;
  z-index: 2000;
  background-color: rgba(240,240,240,0.9);
  background: linear-gradient(90deg, rgba(240,240,240,1) 0%, rgba(240,240,240,0.8) 50%);
  backdrop-filter:blur(5px);
  pointer-events:none;
  opacity:0.0;
  transform:scale(1.5);
  translate: 0px 100px;
  transition: all 1.5s ease-in-out;
}

.fullopacity{
  opacity:1.0;
  pointer-events:auto;
  transform:scale(1.0);
  translate: 0px 0px;
  background: linear-gradient(90deg, rgba(240,240,240,1) 0%, rgba(240,240,240,0.8) 100%);
}

.main-title {
  font-size: 105px;
  line-height: 0.8;
  font-weight: 100;
  letter-spacing: -0.2rem;
  text-align: center;
  color:black;
  margin-top:100px;
  opacity:0.0;
  transition: all 0.5s ease-in-out;
}

.article{
color:black;
columns:2;
width:800px;
font-size:1.2em;
opacity:0.0;
transition: all 0.5s ease-in-out;
text-align:justify;
}

.fullopacityui{
  opacity:1.0;

}

.category-button{
  font-size:2em;
  font-weight:200;
}

a {
  font-weight: bold;
}

#CDHLogo {
  float: right;
  margin-top: 0px;
  margin-right: 30px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 45px;
  line-height: 0.4;
  padding: 30px 0px 10px 0px;
  vertical-align: middle;
  font-family: "Barlow Condensed", sans-serif;
}

#GUBLogo {
  float: right;
  margin-top: 0px;
  margin-right: 60px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 35px;
  line-height: 0.4;
  padding: 33px 0px 10px 0px;
  vertical-align: middle;
  font-family: "Barlow Condensed", sans-serif;
}
</style>
