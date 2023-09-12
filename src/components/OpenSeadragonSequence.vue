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
    homeFillsViewer: false,
    showZoomControl: true,
    showHomeControl: false,
    showFullPageControl: true,
    showNavigator: true,
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
       <a id="next-button" href="#next-button">
        <div id="Next" class="NavButton"></div>
      </a>
    </div>
  </div>
    <!-- <div ref="viewerEl" class="osd"> </div> -->
 
     <!-- <div id="ToolbarHorizontal" v-show="src.length > 1">
      <div id="CenterNav">
        <a id="previous" href="#previous-page">
          <div id="Prev" class="NavButton"></div>
        </a>
        <span id="currentpage">{{ currentImg + 1 }} / {{ src.length }}</span>
        <a id="next" href="#next-page">
          <div id="Next" class="NavButton"></div>
        </a>
      </div>
    </div> -->
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
  background-color: rgba(35, 35, 35, 0.9);
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
  margin-right: 50px;
}

#Next {
  background: url(@/assets/openseadragon/next.png);
  background-size: 35px 35px;
  background-color: rgba(35, 35, 35, 0.9);
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
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
  opacity: 0.7;
  margin-bottom: 3px;
  cursor:pointer;
}
.NavButton:hover {
  opacity: 1;
  cursor:pointer;
}
</style>
