<script lang="ts" setup>
import { mapStore } from "@/stores/store";
import { storeToRefs } from "pinia";

const { selectedFeature } = storeToRefs(mapStore());
</script>

<template>
  <div v-if="selectedFeature" class="col-start-6 col-span-1">
    <div class="bg-white rounded-lg shadow-lg mb-4">
      <div class="px-8 py-6">
        {{ selectedFeature.getProperties() }}
      </div>
    </div>
  </div>
</template>
