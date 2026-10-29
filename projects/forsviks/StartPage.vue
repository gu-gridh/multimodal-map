<script setup>
import IdentityCircle from "./IdentityCircle.vue";
import config from "./settings/config";
</script>

<template>
  <section class="about-container fullopacity">
    <div class="about-layout">
      <IdentityCircle />
      <div class="about-copy red-content">
        <p class="about-article-main fullopacityui">{{ config.about }}</p>
        <p class="about-article-sub fullopacityui">{{ config.about }}</p>
        <router-link class="category-button fullopacityui" to="/map">Explore</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped src="../etruscan/styles/about.css"></style>
