<script setup lang="ts">
  import { ref, onMounted, defineProps } from "vue";
  import OpenSeadragon from "openseadragon";

  const props = defineProps({
    src: Array as () => string[],
    showReferenceStrip: {
      type: Boolean,
      default: false
    }
  });

  const viewerEl = ref();
  const currentPage = ref(1);  // Define currentPage

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
      fullPageButton: "full-page",
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
      <div class="toolbar-top-mini">

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
      <div class="toolbar-bottom-mini">

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

.interface-area-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: absolute;
    bottom: 15px;
    pointer-events: none;
  }

  .interface-area-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: absolute;
    top: 15px;
    pointer-events: none;
  }

  .toolbar-top-mini {
    position: absolute;
    display: flex;
    justify-content: center;
    z-index: 1000;
    align-items: center;
    background-color: rgb(0, 0, 0, 0.8);
    border-radius: 8px;
    width: auto;
  }

  .toolbar-top-mini span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(35, 35, 35, 0.6);
    color: white;
    text-align: center;
    width: 30px;
    border-radius: 8px;
    font-size: 0.8em;
    font-weight: bold;
    vertical-align: 13px;
    margin-left: 0px;
    margin-right: 0px;
    height: 20px;
  }

  .toolbar-bottom-mini {
    pointer-events: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-left: 6px;
    padding-right: 6px;
    width: auto;
    height: 42px;
    background-color: rgb(0, 0, 0, 0.8);
    border-radius: 8px;
    z-index: 1000;
    cursor: pointer;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: none;
    -ms-touch-action: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0.0rem 0.1rem 1rem rgba(0, 0, 0, 0.3) !important;
    border-style: solid;
    border-color: grey;
    border-width: 0.5px 0px 0px 0px;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
  }

  #Home {
    background: url(https://data.dh.gu.se/ui-icons/frame_small_white.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    overflow: hidden;
  }

  #ZoomIn {
    background: url(https://data.dh.gu.se/ui-icons/zoomin_big_white.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    overflow: hidden;
  }

  #ZoomOut {
    background: url(https://data.dh.gu.se/ui-icons/zoomout_big_white.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    overflow: hidden;
  }

  #FullPage {
    background: url(https://data.dh.gu.se/ui-icons/expand_white.svg);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    width: 26px;
    height: 26px;
    overflow: hidden;
    cursor: pointer;
  }

  .NavButton {
    pointer-events: auto;
    width: 35px;
    height: 35px;
    color: white;
    opacity: 0.8;
    margin-right: 6px;
    margin-left: 6px;
    margin-top: 6px;
    margin-bottom: 6px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .NavButton:hover {
    opacity: 1;
    cursor: pointer;
  }


  #Prev,
  #Next {
    position: relative;
    width: 25px;
    height: 15px;
    background-size: 35px !important;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #Prev {
    background-image: url(https://data.dh.gu.se/ui-icons/arrow_prev_white.png);
  }

  #Next {
    background-image: url(https://data.dh.gu.se/ui-icons/arrow_next_white.png);
    margin-left: 10px;
  }

  #currentpage {
    font-family: "Oswald", sans-serif !important;
    color: white;
    font-size: 0.8em !important;
    font-weight: 100;
    pointer-events: none !important;
  }

  .switch-button {
    pointer-events: auto;
    width: 35px;
    height: 35px;
    color: white;
    opacity: 0.8;
    margin-right: 8px;
    margin-left: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .switch-button:hover {
    opacity: 1;
    cursor: pointer;
  }

  *:focus {
    outline:none!important;
  }
</style>