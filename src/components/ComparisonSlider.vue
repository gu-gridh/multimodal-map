<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Split from "split.js";
import { useElementSize } from "@vueuse/core";

const props = defineProps<{
  srcLeft: string;
  srcRight: string;
  locked?: boolean;
}>();

const el = ref();
const split1 = ref();
const split2 = ref();
const split = ref<Split.Instance | undefined>();

const { width, height } = useElementSize(el);

onMounted(() => {
  split.value = Split([split1.value, split2.value], {
    minSize: 0,
    snapOffset: 0,
    gutterSize: props.locked ? 0 : 5,
  });
});

const splitSizes = computed(() =>
  split.value
    ? split.value.getSizes().map((perc) => (perc / 100) * width.value)
    : [undefined, undefined]
);
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
          marginLeft: `-${splitSizes[1]}px`,
        }"
      >
        <slot name="right" />
      </div>
    </div>
  </figure>
</template>
