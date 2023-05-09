<template>
  
  <div class="about-container" v-bind:class="{fullopacity: visibleAbout}">
    <div class="about-main-title" v-bind:class="{fullopacityui: visibleAbout}">Etruscan <br>Chamber<br>Tombs</div>

    <div style="display:flex;  align-items: center; justify-content: center; margin-top:20px;">
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
      <div style="display:flex;  align-items: center; justify-content: center; margin-top:20px;">
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
.about-container {
  position:fixed;
  background-color: #999;
  color: white;
  line-height: 1;
  height: 100%;
  width: 100%;
  font-size: 12px;
  border-radius:10px;
  z-index: 2000;
  background-color: rgba(234, 228, 219,0.9);
  backdrop-filter:blur(5px);
  pointer-events:none;
  opacity:0.0;
  transform:scale(1.5);
  translate: 0px 100px;
  background: linear-gradient(90deg, rgba(234, 228, 219,1) 0%, rgba(234, 228, 219,0) 50%);
  transition: all 1.5s ease-in-out;
}

.fullopacity{
  opacity:1.0;
  pointer-events:auto;
  transform:scale(1.0);
  translate: 0px 0px;
  background: linear-gradient(90deg, rgba(234, 228, 219,1) 0%, rgba(234, 228, 219,0.7) 100%);
}

.about-main-title {
  font-family: "Geo", sans-serif !important;
  font-size: 105px;
  line-height: 0.70;
  font-weight: 200;
  letter-spacing: -0.2rem;
  text-align: left;
  color:rgb(180,100,100);
  margin-top:100px;
  margin-left:calc(50% - 420px);
  opacity:0.0;
  transition: all 0.4s ease-in-out;

}

.article{
  text-align:justify;
  color:black;
columns:2;
column-gap:30px;
width:800px;
font-size:1.2em;
opacity:0.0;
transition: all 0.4s ease-in-out;
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
