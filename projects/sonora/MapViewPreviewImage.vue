<script setup>
import { ref, onMounted, defineProps } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps({
  src: Array, 
  downloadUrls: Array,
  showReferenceStrip: {
    type: Boolean,
    default: false
  }
});
 
const viewerEl = ref();
const currentPage = ref(1);  //define currentPage
const isFullscreen = ref(false);

//open in new tab
const downloadImage = () => {
  const pageIndex = currentPage.value - 1;
  const iiifFile = props.downloadUrls[pageIndex];

  window.open(iiifFile, '_blank');
};

onMounted(() => {  
  const viewer = OpenSeadragon({
    element: viewerEl.value,
    immediateRender: false,
    visibilityRatio: 1.0,
    minZoomImageRatio: 0.5,
    maxZoomPixelRatio: 4,
    homeFillsViewer: true,
    showZoomControl: true,
    showHomeControl: true,
    showFullPageControl: true,
    showNavigator: true,
    navigatorAutoFade: true,
    showRotationControl: true,
    fullPageButton: "full-page",
    zoomInButton: "zoom-in",
    zoomOutButton: "zoom-out",
    nextButton: "next-button",
    previousButton: "prev-button",
    rotateLeftButton: "rotate-left",
    rotateRightButton: "rotate-right",
    homeButton: "home",
    prefixUrl: "/openseadragon/",
    sequenceMode: true,
    showReferenceStrip: props.showReferenceStrip,
    referenceStripPosition: "right",
    preload: true,
    tileSources: props.src,
  });

  viewer.addHandler('page', function(event) {
    currentPage.value = event.page + 1;
  });

  viewer.addHandler('full-page', function(event) {
    isFullscreen.value = viewer.isFullPage(); //update isFullscreen state
  });

  const downloadButton = document.getElementById('download');
  downloadButton.addEventListener('click', function(event) {
    event.preventDefault();
    downloadImage();
  });
});
</script>

<template>
  <div ref="viewerEl" class="osd">
     <div class="interface-area-top">
      <div class="toolbar-top">

        <a id="prev-button">
          <div id="Prev" class="switch-button"></div>
        </a>
        <span id="currentpage">{{ currentPage }} / {{ src ? src.length : 0 }}</span>
        <a id="next-button">
          <div id="Next" class="switch-button"></div>
        </a>

      </div>
    </div>

    <div class="interface-area-bottom">
      <div class="toolbar-bottom">

        <a id="home" href="#home">
          <div id="Home" class="NavButton"></div>
        </a>
        <a id="zoom-in" href="#zoom-in">
          <div id="ZoomIn" class="NavButton"></div>
        </a>
        <a id="zoom-out" href="#zoom-out">
          <div id="ZoomOut" class="NavButton"></div>
        </a>
        <a id="full-page" class="full-screen-option" href="#full-page">
          <div id="FullPage" class="NavButton full-page"></div>
        </a>

      </div>
    </div>

     <div id="ToolbarVertical">
           <a id="rotate-left" href="#rotate-left">
        <div id="RotateLeft" class="NavButton"></div>
      </a>
      <a id="rotate-right" href="#rotate-right">
        <div id="RotateRight" class="NavButton"></div>
      </a>
   
    </div> 
       <a id="download" ref="downloadButton" target="_blank">
        <div id="" class="download-button NavButton" title="Download image"></div>
      </a>
  </div>
</template>

<style scoped>

</style>
