<script setup lang="ts">
import { ref, onMounted } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps({
  src: String,
});

const viewerEl = ref();
const viewer = ref();

const toggleFullScreenPageMode = (bool: boolean) => {
  // @ts-ignore 
  OpenSeadragon.supportsFullScreen = bool;
  // @ts-ignore 
  OpenSeadragon.supportsFullPage = !bool;
};

onMounted(() => {
  toggleFullScreenPageMode(false);

  viewer.value = OpenSeadragon({
    element: viewerEl.value,
    immediateRender: false,
    visibilityRatio: 0.7,
    minZoomImageRatio: 0.5,
    homeFillsViewer: true,
    showZoomControl: true,
    showHomeControl: false,
    showFullPageControl: true,
    showNavigator: true,
    navigatorAutoFade: true,
    fullPageButton: 'full-page',
    zoomInButton: 'zoom-in',
    zoomOutButton: 'zoom-out',
    prefixUrl: '/openseadragon/',
    tileSources: props.src,
  });

  viewer.value.addHandler('full-page');
});
</script>

<template>
  <div ref="viewerEl" class="osd">
    <div id="ToolbarVertical">
      <a id="full-page" href="#full-page">
        <div id="FullPage" class="NavButton"></div>
      </a>
      <a id="zoom-in" href="#zoom-in">
        <div id="ZoomIn" class="NavButton"></div>
      </a>
      <a id="zoom-out" href="#zoom-out">
        <div id="ZoomOut" class="NavButton"></div>
      </a>
    </div>
  </div>
</template>

<style scoped>
#FullPage:focus {
  outline: none;
}

a:visited{
  outline:none;
}
a:focus{
  outline:none;
}
a:active{
  outline:none;
}

::v-deep .openseadragon-canvas {
    background-color: #000 !important;
}

#navigatorDiv{
position:absolute;
  width:80px;
  height:80px;
  margin-top:10px;
  margin-right:10px;
}

#ToolbarHorizontal {
  position: absolute;
  display: flex;
  bottom: 10px;
  width: 100%;
  z-index: 1000;
}

#CenterNav {
  margin: auto;
}

#ToolbarHorizontal span {
  background-color: rgba(35, 35, 35, 0.6);
  color: white;
  text-align: center;
  padding: 5px 10px 5px 10px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  vertical-align: 13px;
  margin-left: 10px;
  margin-right: 10px;
}

#ToolbarVertical {
  position: absolute;
  top: 20px;
  width: 60px;
  margin-left: 15px;
  z-index: 1000;
  cursor:pointer;
}

#FullPage {
  background: url(https://data.dh.gu.se/ui-icons/expand_white.svg);
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  cursor:pointer;
}

#Prev {
  background: url(https://data.dh.gu.se/ui-icons/arrow_prev_white.png);
  background-size: 35px 35px;
  background-color: rgba(35, 35, 35, 0.9);
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
}

#Next {
  background: url(https://data.dh.gu.se/ui-icons/arrow_next_white.png);
  background-size: 35px 35px;
  background-color: rgba(35, 35, 35, 0.9);
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
}

#ZoomIn {
  background: url(https://data.dh.gu.se/ui-icons/zoomin_big_white.png);
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  margin-top: 10px;
  cursor:pointer;
  overflow: hidden;
}

#ZoomOut {
  background: url(https://data.dh.gu.se/ui-icons/zoomout_big_white.png);
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor:pointer;
  overflow: hidden;
}
.NavButton {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: white;
  opacity: 0.8;
  margin-bottom: 3px;
  cursor:pointer;
}
.NavButton:hover {
  opacity: 1;
  cursor:pointer;
}
</style>
