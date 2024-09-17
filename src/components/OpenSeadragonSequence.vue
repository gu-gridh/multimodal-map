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
const isFullscreen = ref(false);

onMounted(() => {  
  const viewer = OpenSeadragon({
    element: viewerEl.value,
    immediateRender: false,
    visibilityRatio: 1.0,
    minZoomImageRatio: 0.5,
    maxZoomPixelRatio: 4,
    homeFillsViewer: true,
    showZoomControl: true,
    showHomeControl: false,
    showFullPageControl: true,
    showNavigator: true,
    navigatorAutoFade: true,
    navigatorPosition:   "BOTTOM_RIGHT",
    showRotationControl: true,
    fullPageButton: "full-page",
    zoomInButton: "zoom-in",
    zoomOutButton: "zoom-out",
    nextButton: "next-button",
    previousButton: "prev-button",
    rotateLeftButton: "rotate-left",
    rotateRightButton: "rotate-right",
    prefixUrl: "/openseadragon/",
    sequenceMode: true,
    showReferenceStrip: props.showReferenceStrip,
    preload: true,
    tileSources: props.src,
  });

  viewer.addHandler('page', function(event) {
    currentPage.value = event.page + 1;
  });

  viewer.addHandler('full-page', function(event) {
    isFullscreen.value = viewer.isFullPage(); //update isFullscreen state
  });
});
</script>

<template>
  <div ref="viewerEl" class="osd">
    <div id="ToolbarVertical">
      <a id="full-page" href="#full-page">
        <div :class="{ 'minimize': isFullscreen }" id="FullPage" class="NavButton"></div>
      </a>
      <a id="zoom-in" href="#zoom-in">
        <div id="ZoomIn" class="NavButton"></div>
      </a>
      <a id="zoom-out" href="#zoom-out">
        <div id="ZoomOut" class="NavButton"></div>
      </a>
      
    </div> 

    <div id="ToolbarHorizontal">
      
      <a id="prev-button">
        <div id="Prev" class="NavButton"></div>
      </a>

      <span id="currentpage">{{ currentPage }} / {{ src ? src.length : 0 }}</span>
       
      <a id="next-button">
        <div id="Next" class="NavButton"></div>
      </a>
    </div>
  </div>
</template>

<style scoped>
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

#ToolbarHorizontal {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 10px;
  width: 100%;
  z-index: 1000;
}

#ToolbarHorizontal span {
  display: flex;
  flex-direction:column;
  justify-content: center;
  background-color: rgba(35, 35, 35, 0.6);
  color: white;
  text-align: center;
  width:120px;
  border-radius: 8px;
  font-size:15px;
  font-weight: bold;
  vertical-align: 13px;
  margin-left: 10px;
  margin-right: 10px;
  height:35px
}

#ToolbarVertical {
  position: absolute;
  top: 10px;
  width: 60px;
  margin-left: 10px;
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

#FullPage.minimize {
  background: url(https://data.dh.gu.se/ui-icons/compress_white.svg);
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

#Prev {
  background: url(https://data.dh.gu.se/ui-icons/arrow_prev_white.png);
  background-size: 35px 35px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: absolute;
  left:10px;
      }

  
#Next {
  background: url(https://data.dh.gu.se/ui-icons/arrow_next_white.png);
  background-size: 35px 35px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: absolute;
  left:-47px;
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

#RotateLeft {
  background: url(https://data.dh.gu.se/ui-icons/rotate_left_white.png);
  background-size: 45%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor:pointer;
  overflow: hidden;
  margin-top:10px;
}

#RotateRight {
  background: url(https://data.dh.gu.se/ui-icons/rotate_right_white.png);
  background-size: 45%;
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
  color: white;
  opacity: 1;
  cursor:pointer;
  overflow:hidden;
  outline: none;
}
.NavButton:hover {
  opacity: 0.8;
  cursor:pointer;
}


      *:focus {
        outline:none!important;
      }
</style>
