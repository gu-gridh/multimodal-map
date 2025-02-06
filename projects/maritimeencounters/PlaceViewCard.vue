<script setup>
import router from './router'
</script>

<template>
  <button class="place-back-button" @click="router.push({ path: '/' })"></button>
  <div class="place-meta-container">
    <div class="placecard-full">
  
 
      <div class="placecard-full-content">
      
        <div class="placecard-text-overlay"></div>   
        <div class="placecard-text">
      
          <div class="placecard-title theme-color-text theme-title-typography">hi</div>
          <div class="placecard-subtitle theme-color-text theme-title-typography">test</div>

          <div class="placecard-metadata-content">
          </div>
 
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.placeview-main-title{
  pointer-events:none;
  position:relative;
  z-index:1000;
  font-size:60px;
  padding:25px 25px;
  margin-top:-300px;
  text-shadow: 0px 0px 50px rgba(255,255,255,0.8);
  white-space: pre-line;
  line-height: 0.7;
  width: auto;
  font-weight: 300;
  letter-spacing: 0.05rem;
  transition: all 0.5s ease-in-out;
}
.place-back-button {
  left: 40px;
  top: 80px;
  background: url(@/assets/interface/backbutton.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;

  border-radius: 50%;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
}

.place-meta-container {
  overflow-y: auto;
  height: calc(100vh - 80px);
  padding-bottom: 30px;
  padding-left: 45px;
  padding-right: 20px;
}

.placecard-full {
  margin-top: 80px;
  margin-left: 50px;
  color: black;
  background-color: white;
  padding: 0px;
  box-shadow: -3px 0px 25px rgba(0, 0, 0, 0.3);
  height: calc(100vh - 230px);
  overflow: hidden;
  overflow-y: auto;
  margin-bottom: 10px;
  border-radius: 15px !important;
  -ms-overflow-style: none;
  scrollbar-width: none;
  transition: all 0.0s ease-in-out;
}

.placecard-full::-webkit-scrollbar {
  width: 0 !important
}

.placecard-full-content {
  height: auto;
  width: 100%;
  padding: 0px 0px 10px 0px;
}


.placecard-full .category-button {
  width: 110px !important;
  padding: 4px 18px !important;
  margin-top: 15px;
  margin-bottom: 20px;

}

.placecard-full .placecard-text{
  padding:10px 30px 0px 30px;
}

.mini-map {
  width: 100%;
  height: 35vh;
  max-height: 300px;
  overflow: hidden;
  background-color: grey;
  margin-bottom: 0px;
}

.placecard-metadata-description{
  font-size:0.9em;
}




/* For small screens */
@media screen and (max-width: 900px) {
  .main-title{
  font-size:60px !important;
}

.placeview-main-title{

  font-size:45px;

}

.placecard-full {
    margin-top:60px!important;
  }

  #app .place-meta-container {
    position: relative !important;
    margin-top: 0px !important;
    top: 20px !important;
    height: auto;
    width: 100%;
    z-index: 100;
    padding-right: 0px !important;
    padding-left: 0px !important;
    padding-bottom: 0px !important;
    overflow-y: auto;
  }

  .place-back-button {
    left: 30px;
    top: 18px;
    width: 40px;
    height: 40px;
    z-index: 1000;
  }

  .placecard-full {
    margin-top: 30px;
    color: black;
    margin-left: 0px;
    background-color: white;
    padding-bottom: 30px;
    box-shadow: 0px -15px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.0s ease-in-out;
    height: auto;
    overflow: hidden;
    border-radius: 20px 20px 0px 0px !important;
  }

  .placecard-full .category-button {
    width: 120px !important;
    padding: 8px 15px !important;
    margin-top: 15px;
    padding: 0px;
    padding-left: 0px;
    margin-bottom: 0px !important;
  }
}
</style>