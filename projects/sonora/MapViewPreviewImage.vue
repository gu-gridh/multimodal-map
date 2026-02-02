<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from "vue";
import OpenSeadragon from "openseadragon";

const props = defineProps({
  src: Array,
  downloadUrls: Array,
  page: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  showReferenceStrip: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['next', 'prev']);

const viewerEl = ref();
const viewer = ref(null);
const currentPage = computed(() => props.page || 1);
//open in new tab
const downloadImage = () => {
  const iiifFile = props.downloadUrls && props.downloadUrls[0];
  if (!iiifFile) return;

  window.open(iiifFile, '_blank');
};

onMounted(() => {
  viewer.value = OpenSeadragon({
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
    rotateLeftButton: "rotate-left",
    rotateRightButton: "rotate-right",
    homeButton: "home",
    prefixUrl: "/openseadragon/",
    sequenceMode: false,
    showReferenceStrip: props.showReferenceStrip,
    referenceStripPosition: "right",
    preload: true,
    tileSources: props.src.map(url => ({
      type: 'image',
      url: url
    })),
  });

});

watch(() => props.src, (newVal) => {
  if (viewer.value && newVal && newVal.length > 0) {
    viewer.value.open(newVal.map(url => ({ type: 'image', url })));
  }
});

onUnmounted(() => {
  if (viewer.value) {
    viewer.value.destroy();
    viewer.value = null;
  }
});
</script>

<template>
  <div ref="viewerEl" class="osd">
    <div class="interface-area-top">
      <div class="toolbar-top">

        <a id="prev-button" @click.prevent="emit('prev')">
          <div id="Prev" class="switch-button"></div>
        </a>
        <span id="currentpage">{{ currentPage }} / {{ totalPages }}</span>
        <a id="next-button" @click.prevent="emit('next')">
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
      <div id="" class="download-button NavButton" title="Download image" @click.prevent="downloadImage"></div>
    </a>
  </div>
</template>

<style scoped></style>
