<template>
  
  <div class="about" v-bind:class="{fullopacity: visibleAbout}">
    <div class="main-title">Göteborgs <br>Jubileum<br>1923</div>

    <div style="display:flex;  align-items: center; justify-content: center; margin-top:80px;">

    <button class="item" @click="visibleAbout = false;">
            <div
              class="p-1 px-2 clickable category-button"
              style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;">Utforska</div>
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
  position:absolute;
  background-color: #999;
  color: white;
  line-height: 1;
  height: 100%;

  width: 100%;
  font-size: 12px;
  border-radius:10px;
  z-index: 2000;
  background-color: rgba(234, 228, 219,0.9);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter:blur(5px);
  pointer-events:none;
  opacity:0.0;
  transition: all 0.5s ease-in-out;
}

.about-modular {
  position:absolute;
  background-color: #999;
  color: white;
  line-height: 1;
  height: 85vh;
  margin-top:3vh;
  margin-left:25%;
  width: 50%;
  font-size: 12px;
  border-radius:10px;
  z-index: 2000;
  background-color: rgba(234, 228, 219,0.9);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter:blur(5px);
  pointer-events:none;
  opacity:0.0;
  transition: all 0.5s ease-in-out;
}

.fullopacity{
  opacity:1.0;
  pointer-events:auto;
}

.main-title {
  font-size: 105px;
  line-height: 0.8;
  font-weight: 200;
  letter-spacing: -0.2rem;
  text-align: center;
  color:rgb(180,100,100);
  margin-top:100px;
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
