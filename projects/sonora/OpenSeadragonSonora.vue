<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps({
  src: Array as () => string[],
  downloadUrls: Array as () => string[],
  showReferenceStrip: {
    type: Boolean,
    default: false
  }
});
 
const viewerEl = ref();
const currentPage = ref(1);  // Define currentPage
const isFullscreen = ref(false);

// const downloadImage = () => {
//   const pageIndex = currentPage.value - 1;
//   const iiifFile = props.downloadUrls[pageIndex];
//   const imgId = `image_${pageIndex + 1}`;

//   fetch(iiifFile)
//     .then(response => response.blob())
//     .then(blob => {
//       const url = window.URL.createObjectURL(blob);
//       const filename = `${imgId}`;
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     })
//     .catch(error => {
//       console.error("Could not download the image", error);
//     });
// };

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
    showHomeControl: false,
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

  const downloadButton = document.getElementById('download');
  downloadButton.addEventListener('click', function(event) {
    event.preventDefault();
    downloadImage();
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
      <a id="rotate-left" href="#rotate-left">
        <div id="RotateLeft" class="NavButton"></div>
      </a>
      <a id="rotate-right" href="#rotate-right">
        <div id="RotateRight" class="NavButton"></div>
      </a>
      <a id="download" ref="downloadButton" target="_blank">
        <div id="" class="download-button compact" title="Download image"></div>
      </a>
    </div> 

    <div id="ToolbarHorizontal">
      <a id="prev-button" ref="prevButton">
        <div id="Prev" class="NavButton"></div>
      </a>

      <span id="currentpage">{{ currentPage }} / {{ src ? src.length : 0 }}</span>
       
      <a id="next-button" ref="nextButton">
        <div id="Next" class="NavButton"></div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.download-button {
    pointer-events: auto;
    background: url(@/assets/openseadragon/download.svg);
    background-size: 55%;
    background-repeat: no-repeat;
    background-position: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    overflow: hidden;
    position: absolute;
    top: 230px;
    left: -2px;
    background-color: rgba(35, 35, 35, 0.9) !important;
    border-radius: 50%;
    user-select: none;
    -webkit-user-select: none;
}

.download-button:hover {
    opacity: 0.8;
}

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

#FullPage.minimize {
  background: url(@/assets/openseadragon/compress.svg);
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
  background: url(@/assets/openseadragon/prev.png);
  background-size: 35px 35px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: absolute;
  left:10px;
      }

  
#Next {
  background: url(@/assets/openseadragon/next.png);
  background-size: 35px 35px;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: absolute;
  left:-47px;
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

#RotateLeft {
  background: url(@/assets/openseadragon/rotateleft.svg);
  background-size: 35%;
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
  background: url(@/assets/openseadragon/rotateright.svg);
  background-size: 35%;
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
