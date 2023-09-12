<script setup lang="ts">
import { ref, onMounted } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps<{
  src: string[];  // Change this to an array of strings
}>();
 

const viewerEl = ref();



onMounted(() => {  
  OpenSeadragon({
    /** @see https://openseadragon.github.io/docs/OpenSeadragon.html#.Options */
    element: viewerEl.value,
    immediateRender: false,
    visibilityRatio: 1.0,
    minZoomImageRatio: 1.0,
    homeFillsViewer: true,
    showZoomControl: true,
    zoomPerClick: 1,
    showHomeControl: false,
    showFullPageControl: false,
    showNavigator: false,
    //navigatorId: "navigatorDiv",
    navigatorAutoFade: true,
    fullPageButton: "full-page",
    zoomInButton: "zoom-in",
    zoomOutButton: "zoom-out",
    nextButton: "next-button",
    previousButton: "prev-button",
    prefixUrl: "/openseadragon/",
    sequenceMode: true, // Enable sequence mode
    tileSources: props.src,
  });
});
</script>

<template>
  <div ref="viewerEl" class="osd">
    <div id="ToolbarHorizontal">
      <a id="prev-button" href="#prev-button">
        <div id="Prev" class="NavButton"></div>
      </a>
      <span id="currentpage">{{ currentPage }} / {{ src.length }}</span>
       <a id="next-button" href="#next-button">
        <div id="Next" class="NavButton"></div>
      </a>
    </div>
  </div>
</template>

<style>
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
  justify-content: center;  /* Add this line */
  bottom: 10px;
  width: 100%;
  z-index: 1000;
}

#ToolbarHorizontal span {
  display: flex;
  flex-direction:column;
  justify-content: center;  /* Add this line */
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
  top: 20px;
  width: 60px;
  margin-left: 15px;
  z-index: 1000;
  cursor:pointer;
}

#FullPage {
  background: url(@/assets/openseadragon/expand.svg);
  background-size: 100%;
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
  background: url(@/assets/openseadragon/prev.png);
  background-size: 35px 35px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
  margin-right: 0px;
  left:47px;
}

#Next {
  background: url(@/assets/openseadragon/next.png);
  background-size: 35px 35px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
  left:-47px;
  z-index:20;
}

#ZoomIn {
  background: url(@/assets/openseadragon/plus.svg);
  background-size: 100%;
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
  background: url(@/assets/openseadragon/minus.svg);
  background-size: 100%;
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
  opacity: 1;
  margin-bottom: 3px;
  cursor:pointer;
}
.NavButton:hover {
  opacity: 0.8;
  cursor:pointer;
}
</style>
