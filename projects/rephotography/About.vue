<template>
  <div class="about-container" v-bind:class="{fullopacity: visibleAbout}">
    <div class="about-main-title" v-bind:class="{fullopacityui: visibleAbout}">Extended <br>Rephotography</div>

    <div style="display:flex;  align-items: center; justify-content: center; margin-top:20px;">
      <div class="article" v-bind:class="{fullopacityui: visibleAbout}">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
        sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
       
      </div>
    </div>
      <div style="display:flex;  align-items: center; justify-content: center; margin-top:20px;">
        <button @click="$emit('close')">
            <div
              class="p-1 px-2 clickable category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;"  v-bind:class="{fullopacityui: visibleAbout}">Explore</div>
          </button>
        </div>
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
.about-container {
  position:fixed;
  color: white;
  line-height: 1;
  height: calc(100%);
  width: 100%;
  font-size: 12px;
  z-index: 2000;
  backdrop-filter:blur(0px);
  pointer-events:none;
  transform:scale(1.5);
  translate: 0px 100px;
  transition: all 1.5s ease-in-out;
  opacity:0.0;
  padding:80px 30px;
  overflow-y:auto;

}

.fullopacity{
  backdrop-filter:blur(5px);
  opacity:1.0;
  pointer-events:auto;
  transform:scale(1.0);
  translate: 0px 0px;
  background: linear-gradient(90deg, rgba(250, 250, 250,1) 0%, rgba(250, 250, 250,0.7) 100%);
 
}

.about-main-title {
  margin-top:100px;
  font-size: 105px;
  line-height: 0.9;
  font-weight: 100;
  letter-spacing: -0.2rem;
  text-align: center;
  color:black;
  opacity:0.0;
  transition: all 0.4s ease-in-out;

}


.article{
text-align:left;
 color:black;
columns:2;
column-gap:30px;
width:900px;
font-size:1.4em;
opacity:0.0;
margin-top:30px;
margin-bottom:20px;
transition: all 0.4s ease-in-out;

}

.category-button{
  font-size:2em;
  font-weight:200;
  transition: all 0.4s ease-in-out;
  opacity:1.0;
}

.fullopacityui{
  opacity:1.0;
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
