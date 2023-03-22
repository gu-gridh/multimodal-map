<script setup lang="ts">
defineProps({
  title: String,
  back: String,
});
</script>

<template>
  <div>
    <header class="flex flex-row-reverse pt-8 ">
      <div class="flex-1 "></div>
      <div class="container">
        <slot name="title">
          <h1 class="meta-title">{{ title }}</h1>
        </slot>
      </div>
      <div class="flex-1 text-center">
        <router-link
          v-if="back"
          :to="back"
          class="block border-4 rounded-full aspect-square w-10 text-lg mx-5"
        >
          ←
        </router-link>
      </div>
    </header>

    <main class="container py-5 mx-20">
      <slot />
    </main>
  </div>
</template>
