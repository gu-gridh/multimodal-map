<script setup>
import { ref, onMounted } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps({
  src: String,
});

const viewerEl = ref();
const viewer = ref();

const toggleFullScreenPageMode = (bool) => {
  OpenSeadragon.supportsFullScreen = bool;
  OpenSeadragon.supportsFullPage = !bool;
};

onMounted(() => {
  toggleFullScreenPageMode(false);

  viewer.value = OpenSeadragon({
    element: viewerEl.value,
    immediateRender: false,
    visibilityRatio: 0.6,
    minZoomImageRatio: 0.5,
    homeFillsViewer: true,
    showZoomControl: true,
    showHomeControl: true,
    showFullPageControl: true,
    showNavigator: true,
    navigatorAutoFade: true,
    fullPageButton: 'full-page',
    zoomInButton: 'zoom-in',
    zoomOutButton: 'zoom-out',
    homeButton: "home",
    prefixUrl: '/openseadragon/',
    tileSources: props.src,
  });

  viewer.value.addHandler('full-page');
});
</script>

<template>
  <div ref="viewerEl" class="osd">
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

<style scoped>
#FullPage:focus {
  outline: none;
}

a:visited {
  outline: none;
}

a:focus {
  outline: none;
}

a:active {
  outline: none;
}

:deep(.openseadragon-canvas) {
  background-color: #000 !important;
}

#navigatorDiv {
  position: absolute;
  width: 80px;
  height: 80px;
  margin-top: 10px;
  margin-right: 10px;
}
</style>
