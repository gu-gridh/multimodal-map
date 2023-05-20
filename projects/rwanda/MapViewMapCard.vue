<template>
  <button
    class="bg-white px-6 py-4 my-2 hover:bg-slate-200 shadow-md w-full text-left"
  >
    <div class="text-gray-400 text-base my-2">
      {{ place.type.text }} • {{ isIconic(place) }}
    </div>
    <hr />
    <br />
    <div
      class="text-gray-700 text-base my-2"
      v-for="name in place.names"
      v-bind:key="name.id"
    >
      <div
        v-for="language in name.languages"
        v-bind:key="language.id"
        class="bg-slate-400 text-white p-2 mr-2 rounded-md inline-block w-9"
      >
        {{ language.abbreviation }}
      </div>
      {{ name.text }}

      <br />
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Place } from "./types";

defineProps<{
  place: Place;
}>();

function isIconic(place: Place): string {
  return place.is_iconic ? "iconic" : "not iconic";
}
</script>
