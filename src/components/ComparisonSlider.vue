<script setup lang="ts">
import { onMounted, ref } from "vue";
import Split from "split.js";
import { useElementSize } from "@vueuse/core";

const props = defineProps<{
  locked?: boolean;
}>();

const el = ref();
const { width, height } = useElementSize(el);

const split1 = ref();
const split2 = ref();
const splitSizes = ref<number[]>([50, 50]);

onMounted(() => {
  Split([split1.value, split2.value], {
    minSize: 0,
    snapOffset: 0,
    gutterSize: props.locked ? 0 : 5,
    onDrag: (sizes) => (splitSizes.value = sizes),
  });
});
</script>

<template>
  <figure class="flex relative" ref="el">
    <div ref="split1">
      <div :style="{ width: `${width}px` }">
        <slot name="left" />
      </div>
    </div>
    <div ref="split2" class="overflow-hidden">
      <div
        :style="{
          width: `${width}px`,
          marginLeft: `-${(splitSizes[0] / 100) * width}px`,
        }"
      >
        <slot name="right" />
      </div>
    </div>
  </figure>
</template>

<style scoped>
:deep(.gutter) {
  background-color: black;
  cursor: col-resize;
}
</style>
