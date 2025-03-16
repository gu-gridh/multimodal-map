<script setup>
import { provide } from "vue";
import config from "./settings/config";
import Footer from "./Footer.vue";
import { DianaClient } from "@/assets/diana";

const endpoint = new DianaClient("rephotography");

provide("config", config);
provide("diana", endpoint);
</script>

<template>
  <Footer />
  <router-view />
</template>

<style>
html,
body {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color: rgb(200, 200, 200) !important;
}

.theme-color {
  color: orange;
}

.main-title {
  line-height: 0.9;
  font-weight: 100;
  margin-bottom: 15px;
  font-size: 4.2vw !important;
  width:auto!important;
}

@media screen and (max-width: 1500px) {
  .main-title {
    font-size: 80px !important;
    width: 75%;
  }
}

.about {
  display: none;
}

#app .left-pane {
  background: url("@/assets/gradient-rephotography.png");
  background-size: contain;
}

.left-pane-layer {
  padding: 0px 420px 0px 0px !important;
}

.left-pane-content {
  overflow-y: scroll  !important; /* Add vertical scrollbar */
}

.theme-button {
  border-radius: 5px;
  padding: 5px 10px;
  color: white;
}

#app .mapview-preview {
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.85);
  width: 75%;
  margin-left: 25%;
  color: white;
  backdrop-filter: blur(7px);
}

.close-button {
  width: 40px;
  height: 40px;
  margin-left: -10px;
  margin-top: -5px;
  padding: 16px 15px 10px 9px;
  line-height: 1px;
  font-size: 50px;
  font-weight: 100;
  border-radius: 50%;
  background-color: rgb(100, 100, 100);
  color: white;
  transform: rotate(45deg);
  cursor: pointer;
  pointer-events: auto;
  margin-bottom: 30px;
}

.close-button:hover {
  background-color: rgb(140, 140, 140);
}

#app .right-pane {

    z-index: 9 !important;

  }

@media screen and (max-width: 900px) {
  #app .left-pane {
    margin-top:0px!important;
    top: 76%!important;
    z-index:1000!important;
    position:absolute!important;
    width:100%!important;
    padding: 30px 10px 100px 10px!important;
    min-width: 300px !important;
  }

  #app .right-pane {
    width: 100% !important;
    left: 0px !important;
    margin-left: 0px !important;
    margin-right: 0px !important;
    padding: 0px !important;
 
    height: calc(100% + 50px) !important;
    padding-bottom: 0px !important;
  }

  #app .mapview-preview {
    width: 100% !important;
    height: 100% !important;
    padding: 20px !important;
    padding-top: 5px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    padding-bottom: 1000px !important;
    z-index: 0 !important;
  }

  #app .image-card {
    border-radius: 8px !important;
  }

  #app .image-container {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px !important;
    width: 100%;
    height: auto !important;
    border-radius: 8px !important;
    content: contain;
    padding: 0px;
  }

  #app .left-pane-container {
    width: 100%;
  }

  .atlas-gradient {
    background: linear-gradient(180deg, rgba(220, 220, 220, 0) 0px, rgba(220, 220, 220, 1) 300px) !important;
  }
}
</style>
