<script setup>
defineProps({
  point: { type: Object, required: true },
  order: { type: Number, required: true },
  selected: { type: Boolean, default: false }
});

defineEmits(["select"]);
</script>

<template>
  <div class="forsvik-marker" :class="{ selected }" :style="{ '--marker-delay': `${Math.min(order, 5) * 25}ms` }">
    <button class="marker-pin" type="button" :title="point.name" @click.stop="$emit('select', point)">
      <img v-if="point.icon" :src="point.icon" alt="">
      <span v-else></span>
    </button>
  </div>
</template>

<style scoped>
.forsvik-marker {
  position: relative;
  width: 40px;
  height: 52px;
  transform-origin: 50% 100%;
  animation: marker-pop .45s var(--marker-delay) cubic-bezier(.2, 1.5, .4, 1) both;
}

.marker-pin {
  position: absolute;
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

@media (prefers-reduced-motion: reduce) {
  .forsvik-marker {
    animation: none;
  }
}
</style>
