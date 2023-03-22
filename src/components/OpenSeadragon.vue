<script setup lang="ts">
import { ref, onMounted } from "vue";
import OpenSeadragon from "openseadragon";



const props = defineProps({
  src: String,
});

const viewerEl = ref();

onMounted(() =>
  OpenSeadragon({
    /** @see https://openseadragon.github.io/docs/OpenSeadragon.html#.Options */
    element: viewerEl.value,
    immediateRender: false,
    visibilityRatio: 1,
    minZoomImageRatio: 1,
    homeFillsViewer: true,
    showZoomControl: true,
    showHomeControl: false,
    showFullPageControl: true,
    //fullPageButton: "full-page",
      //zoomInButton: "zoom-in",
     // zoomOutButton: "zoom-out",
    prefixUrl: "/openseadragon/",
    // If a proper tileSource is not given, use src prop.
    tileSources: props.src,
  })
);



</script>

<template>
  <div ref="viewerEl" class="osd">
    
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
    <!-- <div id="ToolbarVertical">
      <a id="full-page" href="#full-page">
        <div id="FullPage" class="NavButton"></div>
      </a>
      <a id="zoom-in" href="#zoom-in">
        <div id="ZoomIn" class="NavButton"></div>
      </a>
      <a id="zoom-out" href="#zoom-out">
        <div id="ZoomOut" class="NavButton"></div>
      </a>
    </div> -->
  </div>

</template>

<style scoped>
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
  font-size:18px;
  font-weight: bold;
  vertical-align: 13px;
  margin-left: 10px;
  margin-right: 10px;
}

#ToolbarVertical {
  position: absolute;
  margin-top: 15px;
  width: 60px;
  margin-left: 15px;
  z-index: 1000;
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
}

#Prev {
  background: url(@/assets/openseadragon/prev.png);
  background-size: 35px 35px;
     background-color: rgba(35, 35, 35, 0.9);
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
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

  overflow: hidden;
}
.NavButton {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  color: white;
  opacity: 0.7;
  margin-bottom:3px;
 
}
.NavButton:hover {
  opacity: 1;
}

</style>
