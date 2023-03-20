<script setup lang="ts">
defineProps({
  title: String,
  back: String,
});
</script>

<template>
  <div>
    <header class="flex flex-row-reverse pt-4">
      <div class="flex-1"></div>
      <div class="container">
        <slot name="title">
          <h1 class="text-4xl">{{ title }}</h1>
        </slot>
      </div>
      <div class="flex-1 text-center">
        <router-link
          v-if="back"
          :to="back"
          class="block border-4 rounded-full aspect-square w-10 text-lg mx-auto"
        >
          ←
        </router-link>
      </div>
    </header>

    <main class="container mx-auto py-4">
      <slot />
    </main>
  </div>
</template>
