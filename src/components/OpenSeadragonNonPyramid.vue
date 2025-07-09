<script setup>
import { ref, onMounted } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps({
  src: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['page-changed']);
const viewerEl = ref();
const currentPage = ref(1);
const isFullscreen = ref(false);

onMounted(() => {  

  const tileSources = props.src.map(url => ({
    type: 'image',
    url: url,
    buildPyramid: false  
  }));

  const viewer = OpenSeadragon({
    element: viewerEl.value,
    immediateRender: false,
    visibilityRatio: 1.0,
    minZoomImageRatio: 1.0,
    homeFillsViewer: true,
    showZoomControl: true,
    showFullPageControl: true,
    showNavigator: true,
    navigatorAutoFade: true,
    showHomeControl: true,
    fullPageButton: "full-page",
    zoomInButton: "zoom-in",
    zoomOutButton: "zoom-out",
    nextButton: "next-button",
    previousButton: "prev-button",
    homeButton: "home",
    prefixUrl: "/openseadragon/",
    sequenceMode: true,
    preload: true,
    tileSources: tileSources,
  });

  viewer.addHandler('page', function(event) {
      currentPage.value = event.page + 1;
      emit('page-changed', currentPage.value); // Emit the raw value
  });

  viewer.addHandler('full-page', function(event) {
    isFullscreen.value = viewer.isFullPage(); //update isFullscreen state
  });

});
</script>

<template>
  <div ref="viewerEl" class="osd">
    <!-- <div class="interface-area-top">
      <div class="toolbar-top">

        <a id="prev-button">
          <div id="Prev" class="switch-button"></div>
        </a>
        <span id="currentpage">{{ currentPage }} / {{ src ? src.length : 0 }}</span>
        <a id="next-button">
          <div id="Next" class="switch-button"></div>
        </a>

      </div>
    </div> -->

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
  </div>
</template>


