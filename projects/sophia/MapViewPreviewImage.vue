<script setup>
  import { ref, onMounted, defineProps } from "vue";
  import OpenSeadragon from "openseadragon";

  const props = defineProps({
  src: {
    type: Array,
    default: () => [],
  },
  showReferenceStrip: {
    type: Boolean,
    default: false,
  },
});

  const viewerEl = ref();
  const currentPage = ref(1);  //define currentPage

  onMounted(() => {
    const viewer = OpenSeadragon({
      element: viewerEl.value,
      immediateRender: false,
      visibilityRatio: 0.8,
      minZoomImageRatio: 0.8,
      maxZoomPixelRatio: 1,
      homeFillsViewer: false,
      showZoomControl: true,
      showHomeControl: true,
      showFullPageControl: true,
      showNavigator: true,
      navigatorPosition: "TOP_RIGHT",
      navigatorAutoFade: true,
      showRotationControl: true,
      preserveViewport: true,
      fullPageButton: "full-page-button",
      zoomInButton: "zoom-in",
      zoomOutButton: "zoom-out",
      nextButton: "next-button",
      previousButton: "prev-button",
      homeButton: "home",
      rotateLeftButton: "rotate-left",
      rotateRightButton: "rotate-right",
      prefixUrl: "/openseadragon/",
      sequenceMode: true,
      showReferenceStrip: props.showReferenceStrip,
      preload: true,
      tileSources: props.src,
    });
    viewer.addHandler('page', function (event) {
      currentPage.value = event.page + 1;
    });
  });
</script>

<template>
  <div ref="viewerEl" class="osd">
 
    <!--  These are the page switcher and counter -->

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


   <!--  These are the regular controls -->
    <div class="interface-area-bottom">
      <div class="toolbar-bottom">

        <a id="home" href="#home" title="Reset the view">
          <div id="Home" class="NavButton"></div>
        </a>
        <a id="zoom-in" href="#zoom-in">
          <div id="ZoomIn" class="NavButton" title="Zoom in the view"></div>
        </a>
        <a id="zoom-out" href="#zoom-out" title="Zoom out the view">
          <div id="ZoomOut" class="NavButton"></div>
        </a>
        <a id="full-page-button" href="#full-page" title="Toggle full screen">
          <div class="NavButton full-page"></div>
        </a>

      </div>
    </div>

  </div>
</template>

<style scoped>

  
</style>