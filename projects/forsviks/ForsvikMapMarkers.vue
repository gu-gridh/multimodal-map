<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue";
import { fromLonLat } from "ol/proj";

const props = defineProps({
  markers: { type: Array, default: () => [] },
  types: { type: Object, required: true },
  projection: { type: String, default: "EPSG:3857" },
});

const map = inject("map");
const selectedId = ref(null);

const points = computed(() => props.markers.map((marker, index) => ({
  ...marker,
  index,
  position: fromLonLat(marker.coordinates, props.projection),
  icon: props.types[marker.type]?.icon,
})));

function toggle(point) {
  selectedId.value = selectedId.value === point.id ? null : point.id;
}

function close() {
  selectedId.value = null;
}
</script>

<template>
  <ol-overlay v-for="point in points" :key="point.id" :position="point.position" positioning="bottom-center"
    :stop-event="true">
    <div class="forsvik-marker" :class="{ selected: selectedId === point.id }"
      :style="{ '--marker-index': Math.min(point.index, 14) }">
      <article class="marker-card">
        <button v-if="selectedId === point.id" class="marker-card-close" type="button" title="Stäng"
          @click="close">×</button>
        <div class="marker-card-media">
          <img v-if="selectedId === point.id && point.mediaUrl" :src="point.mediaUrl"
            :alt="point.mediaTitle || point.name">
          <div v-else class="marker-card-placeholder">{{ point.type }}</div>
        </div>
        <div class="marker-card-copy">
          <h2>{{ point.name }}</h2>
          <p>{{ point.areaName }}</p>
        </div>
        <div class="marker-card-footer">
          <a v-if="point.mediaUrl" class="marker-card-action" :href="point.mediaUrl" target="_blank">Utforska</a>
          <span v-else class="marker-card-action disabled">Utforska</span>
        </div>
      </article>
      <button class="marker-pin" type="button" :title="point.name" @click.stop="toggle(point)">
        <img v-if="point.icon" :src="point.icon" alt="">
        <span v-else></span>
      </button>
    </div>
  </ol-overlay>
</template>

<style scoped>
.forsvik-marker {
  position: relative;
  width: 40px;
  height: 52px;
  transform-origin: 50% 100%;
  /* slight wait for marker, then run marker-pop animation */
  animation: marker-pop .6s calc(var(--marker-index) * 55ms) cubic-bezier(.2, 1.5, .4, 1) both;
}

:global(.ol-overlay-container:has(.forsvik-marker.selected)) {
  z-index: 1000 !important;
}

.marker-pin {
  position: absolute;
  z-index: 1;
  inset: 0;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transition: transform .25s ease, filter .25s ease;
}

.marker-pin img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.marker-pin span {
  display: block;
  width: 20px;
  height: 20px;
  margin: 12px auto;
  border: 2px solid white;
  border-radius: 50%;
  background: var(--theme-5);
}

.marker-pin:hover,
.selected .marker-pin {
  transform: translateY(-3px) scale(1.1);
  filter: drop-shadow(0 6px 5px rgba(45, 20, 12, .35));
}

.marker-card {
  position: absolute;
  z-index: 0;
  bottom: 68px;
  left: 50%;
  width: 260px;
  overflow: visible;
  border-radius: 18px 18px 14px 14px;
  background: #fff8ed;
  color: #3d211b;
  box-shadow: 0 10px 18px rgba(45, 20, 12, .18), 0 24px 50px rgba(45, 20, 12, .32);
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(18px) scale(.35);
  transform-origin: 50% 100%;
  transition: opacity .18s ease, transform .35s cubic-bezier(.2, .9, .25, 1.15);
}

.forsvik-marker.selected .marker-card {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
  pointer-events: auto;
}

.marker-card::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 16px;
  height: 16px;
  background: #fff8ed;
  transform: translateX(-50%) rotate(45deg);
}

.marker-card-close {
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: rgba(42, 24, 19, .76);
  color: transparent;
  padding: 0;
  font-size: 0;
  cursor: pointer;
}

.marker-card-close::before,
.marker-card-close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 1px;
  background: white;
  transform: translate(-50%, -50%) rotate(45deg);
}

.marker-card-close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.marker-card-media {
  height: 0;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
  background: var(--panel-background);
  opacity: 0;
  transition: height .38s cubic-bezier(.2, .8, .25, 1), opacity .24s ease;
}

.selected .marker-card-media {
  height: 130px;
  opacity: 1;
}

.marker-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marker-card-placeholder {
  display: grid;
  height: 100%;
  place-items: center;
  color: var(--theme-4);
  text-transform: capitalize;
}

.marker-card-copy {
  padding: 14px 16px 12px;
}

.marker-card-copy p {
  margin: 5px 0 0;
  color: #231915;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.marker-card-copy h2 {
  margin: 0;
  color: var(--theme-3);
  font-size: 21px;
  line-height: 1.1;
}

.marker-card-action {
  display: table;
  margin: 0 auto 16px;
  padding: 4px 12px;
  border-radius: 5px;
  background: var(--theme-3);
  color: white;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.marker-card-action:hover {
  background: var(--theme-4);
}

.marker-card-action.disabled {
  opacity: .65;
}

.marker-card-footer {
  height: 0;
  overflow: hidden;
  opacity: 0;
  transition: height .32s ease, opacity .22s ease;
}

.selected .marker-card-footer {
  height: 46px;
  opacity: 1;
}

/* animation for marker pop */
@keyframes marker-pop {
  0% {
    opacity: 0;
    transform: translateY(-18px) scale(.2);
  }

  70% {
    opacity: 1;
    transform: translateY(3px) scale(1.12);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 600px) {
  .marker-card {
    width: min(250px, calc(100vw - 32px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .forsvik-marker {
    animation: none;
  }

  .marker-card,
  .marker-card-media,
  .marker-card-footer {
    transition: opacity .1s;
  }
}
</style>
