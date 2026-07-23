<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import MapPane from "./MapPane.vue";
import MapViewMarkers from "./MapViewMarkers.vue";
import MapViewControls from "./MapViewControls.vue";
import About from "./About.vue";
import { iconographiaStore } from "./settings/store";

const iconographia = iconographiaStore();
const { placeId, placeName } = storeToRefs(iconographia);

const visibleAbout = ref(false);

function clearPlace() {
  placeId.value = null;
  placeName.value = "";
}

onMounted(() => {
  const visited = sessionStorage.getItem("visited") === "true";
  if (!visited) {
    visibleAbout.value = true;
    sessionStorage.setItem("visited", "true");
  }
});
</script>

<template>
  <About :visibleAbout="visibleAbout" @close="visibleAbout = false" />

  <div class="search-panel">
    <header class="data-header">
      <div id="main-title">Iconographia Mediaevalis Suetica</div>
      <button class="about-link" @click="visibleAbout = true">
        {{ $t("about") }}
      </button>
    </header>

    <MapViewControls />

    <div v-if="placeId" class="place-filter">
      <button class="filter-box filter-box-active" @click="clearPlace">
        {{ placeName }} ✕
      </button>
    </div>

    <div class="map-wrap">
      <MapPane>
        <MapViewMarkers :zIndex="20" />
      </MapPane>
      <div class="map-info">{{ $t("mapInfo") }}</div>
    </div>
  </div>
</template>

<style scoped>
.search-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 24px 28px 0;
}

.data-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

#main-title {
  color: white;
  font-size: clamp(34px, 3.2vw, 52px);
  font-weight: 100;
  line-height: 0.85;
  letter-spacing: 0.02em;
  margin-bottom: 14px;
}

.about-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
  font-size: 15px;
  white-space: nowrap;
  padding-top: 6px;
}

.about-link:hover {
  color: white;
}

.place-filter {
  margin-top: 8px;
}

.map-wrap {
  position: relative;
  flex: 1;
  min-height: 220px;
  margin: 12px -28px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.map-info {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  font-weight: 300;
  padding: 8px 14px;
  border-radius: 8px;
  border-top: 0.5px solid white;
  pointer-events: none;
  font-size: 14px;
  white-space: nowrap;
  z-index: 10;
}

@media screen and (max-width: 900px) {
  .search-panel {
    padding: 14px 16px 0;
  }

  .map-wrap {
    margin: 10px -16px 0;
  }
}
</style>
