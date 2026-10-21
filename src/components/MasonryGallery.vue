<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import Masonry from "masonry-layout";

const props = defineProps({
  items: { type: Array, default: () => [] },
  columnWidth: { type: Number, default: 250 },
  gap: { type: Number, default: 0 },
});
const gallery = ref(null);
let masonry;
let observer;
let width = -1;

function layout() {
  const container = gallery.value;
  if (!masonry || !container) return;
  const columns = Math.max(1, Math.round((container.clientWidth + props.gap) / (props.columnWidth + props.gap)));
  const itemWidth = (container.clientWidth - props.gap * (columns - 1)) / columns;
  container.style.setProperty("--masonry-item-width", `${itemWidth}px`);
  masonry.options.columnWidth = itemWidth;
  masonry.options.gutter = props.gap;
  masonry.reloadItems();
  masonry.layout();
}

onMounted(() => {
  masonry = new Masonry(gallery.value, {
    itemSelector: ".masonry-entry",
    transitionDuration: 0,
    resize: false,
  });
  observer = new ResizeObserver(() => {
    if (width === gallery.value.clientWidth) return;
    width = gallery.value.clientWidth;
    layout();
  });
  observer.observe(gallery.value);
  layout();
});

watch(() => [props.items, props.columnWidth, props.gap], layout, { deep: true, flush: "post" });
onBeforeUnmount(() => {
  observer?.disconnect();
  masonry?.destroy();
});
</script>

<template>
  <div class="masonry-wall">
    <div ref="gallery" @load.capture="layout" @error.capture="layout">
      <div v-for="item in items" :key="item.uuid || item.id" class="masonry-entry" :style="{ marginBottom: `${gap}px` }">
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.masonry-entry {
  width: var(--masonry-item-width, 100%);
}
.masonry-entry :deep(.grid-item) {
  width: 100%;
}
.masonry-entry :deep(img) {
  display: block;
}
</style>
