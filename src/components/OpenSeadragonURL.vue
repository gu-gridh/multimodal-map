<script setup>
import { ref, onMounted } from "vue";
import OpenSeadragon from '@/external/bookmark-url.js';

const props = defineProps({
  src: String,
});

const viewerEl = ref();
let viewer = ref();

const toggleFullScreenPageMode = (bool) => {
  OpenSeadragon.supportsFullScreen = bool;
  OpenSeadragon.supportsFullPage = !bool;
};

onMounted(() => {
  toggleFullScreenPageMode(false);

  viewer.value = OpenSeadragon({
    /** @see https://openseadragon.github.io/docs/OpenSeadragon.html#.Options */
     element: viewerEl.value,
     preserveViewport: true,
   immediateRender: false,
          visibilityRatio: 0.6,
          minZoomImageRatio: 0.5,
          homeFillsViewer: true,
          showZoomControl: true,
          showHomeControl: true,
          //defaultZoomLevel:0.6,
          showFullPageControl: true,
          showNavigator: true,
          navigatorAutoFade: true,
          //navigatorId:   "navigator-div",
          fullPageButton: "full-page",
          zoomInButton: "zoom-in",
          zoomOutButton: "zoom-out",
          homeButton: "home",
    prefixUrl: "/openseadragon/",
    // If a proper tileSource is not given, use src prop.
    tileSources: props.src,
  });

  viewer.value.addHandler('full-page');
 
  // Use the bookmark plugin
  viewer.value.bookmarkUrl({
    trackPage: true, // or false, depending on whether you want to track the current page
  });
});

</script>

<template>
  <div ref="viewerEl" class="osd">
    <div class="interface-area">
      <div class="toolbar-bottom-mini">

        <a id="home" href="#home">
          <div id="Home" class="NavButton" title="Fit image to view"></div>
        </a>
        <a id="zoom-in" href="#zoom-in">
          <div id="ZoomIn" class="NavButton"></div>
        </a>
        <a id="zoom-out" href="#zoom-out">
          <div id="ZoomOut" class="NavButton"></div>
        </a>
        <a id="full-page" class="full-screen-option" href="#full-page">
          <div id="FullPage" class="NavButton"></div>
        </a>

      </div>
    </div>
  </div>
</template>

<style>
.openseadragon-canvas {
    background-color: #000 !important;
}

#navigatorDiv{
  position:absolute;
  width:80px;
  height:80px;
  margin-top:10px;
  margin-right:10px;

}






 /*      DigiCure Look */

</style>
