<script setup>
import { provide } from "vue";
import config from "./settings/config";
import Footer from "./Footer.vue";
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("jubileum");

provide("config", config);
provide("diana", endpoint);
</script>

<template>
  <Footer />
  <router-view />
</template>

<style>
/* Project theme in regards to colour and fonts */
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color: rgb(234, 228, 219) !important;
  margin: 0 !important;
}

.map-container {
  height: calc(100vh - 80px) !important;
}

.main-title {
  font-family: "Josefin Sans", sans-serif !important;
  line-height: 0.85;
  font-size:500%;
  font-weight: 200;
  letter-spacing: -0.2rem;
  margin-left:-50px;
  text-align: center;
  color: rgb(180, 100, 100);
}

.sub-title {
  font-family: "Josefin Sans", sans-serif !important;
  line-height: 0.8;
  font-weight: 200;
  letter-spacing: -0.2rem;
  text-align: center;
  color: rgb(180, 100, 100);
  margin-top: 10px;
  margin-bottom: 15px;
  margin-left:-50px;
}

#app .about {
  width:90%;
  font-size:90%;
  text-align:justify;
}

#app .left-pane {
  background: url("@/assets/gradient-jubileum.png");
  background-size: contain;
  z-index: 249;
  width:1200px;
}

.left-pane-layer {
  padding: 0px 720px 0px 0px !important;
  pointer-events: none !important;
  height: 100vh !important;
  width: 100% !important;
}

#app .right-pane {
  height: 100vh;
  width: 360px !important;
  pointer-events: none;
  transition: all 0.5s ease-in-out;
}

#app .mapview-preview {
  color: white;
  transition: all 0.5s ease-in-out;
  padding-top: 20px;
  padding-bottom: 0px;
  width: auto;
  pointer-events: none;
  z-index:0!important;
}

#app .ol-zoom-in {
  left: calc(50% + 50px) !important;
  top: calc(100vh - 140px) !important;
  position: fixed;
  border-radius: 10px 0px 0px 10px !important;
  height: 35px;
  padding-bottom: 3px !important;
  width: 50px;
  background-color: rgba(160, 80, 80, 1.0) !important;
}

#app .ol-zoom-out {
  left: calc(50% + 100px);
  top: calc(100vh - 140px);
  position: fixed;
  margin-top: 1px;
  border-radius: 0px 10px 10px 0px !important;
  height: 35px;
  padding-bottom: 3px !important;
  width: 50px;
  background-color: rgba(160, 80, 80, 1.0) !important;
}

@media screen and (max-width: 1200px) {
#app .right-pane {
 width:280px !important;
 overflow:hidden!important;
}
}


@media screen and (max-width: 900px) {
  #app .left-pane {
  margin-top:0px!important;
  top: 75%!important;
  z-index:1000!important;
  position:absolute!important;
  width:100%!important;
  padding: 30px 10px 100px 10px!important;
}

  #app .right-pane {
    width: 100% !important;
    padding:0px;
    z-index:10!important;
  }

  #app .mapview-preview {
    padding-top: 70px !important;
  }

  .ui-mode {
    z-index:10001 !important;
  }

  .ui-overlay {
    margin-top: 25px !important;
    margin-left: 0px !important;
    font-size: 120% !important;
    z-index:10001 !important;
  }

  #app .masonry-grid {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    /* Make the grid height responsive */
    z-index: 200;
    background-color: rgb(234, 228, 219);
    padding: 0px 0px 230px 00px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-template-rows: masonry;
    grid-gap: 5px;
    overflow-y: scroll;
  }

  #app .ol-zoom-in {
    left: calc(50% - 50px) !important;
    top: calc(100vh - 320px) !important;
  }

  #app .ol-zoom-out {
    left: calc(50% + 0px);
    top: calc(100vh - 320px);
  }

  .main-title {

  text-align: left;
  margin-top:10px!important;


}

.sub-title {

  text-align: left;

}

}
</style>
