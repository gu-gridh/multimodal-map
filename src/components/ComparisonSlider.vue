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
    <div ref="split2" class="overflow-hidden no-touch">
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
      class="dragger"
      :style="{ left: `${splitSizes[0]}%` }"
    >
    | |
    </div>
  </figure>
</template>

<style scoped>
:deep(.gutter) {
  background-color: black;
  border-radius:30%;
  cursor: col-resize;
  pointer-events:none;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.dragger{
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  overflow:hidden;
  cursor: col-resize;
  pointer-events:auto;
  display:flex;
  flex-direction:column;
  align-items:center;
  position:absolute;
  margin-top:30%;
  width:30px;
  height:30px;
  padding:5px;
  font-size:0.85em;
  background-color:white;
  background-size:contain;
  margin-left:-12px;
  border-radius:50%;
  color:black;
  box-shadow: 0px 1px 15px 0 rgba(0, 0, 0, 0.5),
    0 0px 0px 0px rgba(0, 0, 0, 0.4);
}
</style>
