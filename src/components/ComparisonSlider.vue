<script setup lang="ts">
import { onMounted, ref } from "vue";
import Split from "split.js";
import { useElementSize } from "@vueuse/core";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/20/solid";

const props = defineProps<{
  locked?: boolean;
}>();

const el = ref();
const { width, height } = useElementSize(el);

const split = ref();
const split1 = ref();
const split2 = ref();
const dragger = ref();
const splitSizes = ref<number[]>([50, 50]);

onMounted(() => {
  split.value = Split([split1.value, split2.value], {
    minSize: 0,
    snapOffset: 0,
    gutterSize: props.locked ? 0 : 5,
    onDrag: (sizes) => {
      splitSizes.value = sizes;
    },
  });

  if (dragger.value) {
    // Forward events from the dragger button to the Split.js gutter.
    for (const type of ["mousedown", "mouseup"]) {
      type ConstructableEvent = Event & { constructor: any };
      dragger.value.addEventListener(type, (e: ConstructableEvent) =>
        split.value.pairs[0].gutter.dispatchEvent(new e.constructor(type, e))
      );
    }
  }
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
    <div
      v-if="!locked"
      ref="dragger"
      class="absolute w-6 h-6 -ml-3 -mt-3 top-1/2 rounded-full bg-black text-white z-10 cursor-col-resize flex justify-around items-center"
      :style="{ left: `${splitSizes[0]}%` }"
    >
      <ChevronLeftIcon class="" />
      <ChevronRightIcon class="" />
    </div>
  </figure>
</template>

<style scoped>
:deep(.gutter) {
  background-color: black;
  cursor: col-resize;
}
</style>
