<template>
    <div class="main-title">{{ "Maritime Encounters" }}</div>
    <div class="about">{{ "The portal is published by GRIDH at the University of Gothenburg in close collaboration with InfraVis." }}</div>
    <button class="item" @click="$emit('toggle-about')">
      <div class="p-1 px-2 clickable category-button about-button">
        {{ "About the portal" }}</div>
    </button>
</template>

<script>
export default {
  name: "Title",
  methods: {
  },
  setup() {},
  emits: ['toggle-about'],
};
</script>

<style>
</style>