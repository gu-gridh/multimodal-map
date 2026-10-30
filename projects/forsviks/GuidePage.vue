<script setup>
import config from "./settings/config";
const features = [
  { title: "Explore the map", text: "Drag to move around the map. Use the + and − buttons or pinch to zoom.", icon: "zoomin_big_black.png" },
  { title: "Plan and drone", text: "Switch between Plan and Drone using the toggle at the top of the map.", icon: "inspect_black.png" },
  { title: "About the project", text: "Select About in the left pane to learn more about the project.", icon: "search_black.png" },
];
</script>

<template>
  <section class="instructions-container fullopacity">
    <router-link to="/map" class="close-instructions-button fullopacityui" title="Close guide">+</router-link>
    <div class="instructions-flex">
      <div class="content-columns">
        <div class="content-column1">
          <div class="title-fields">
            <div class="instructions-main-title" style="white-space: pre-line">{{ config.titleLines.join("\n") }}</div>
            <h1 class="instructions-sub-title">User guide</h1>
            <p class="instructions-article-main">Explore {{ config.title }} through the map, site plan and drone view.</p>
          </div>
          <div class="buttons">
            <div class="explore-button"><router-link class="category-button fullopacityui" to="/map">Close</router-link></div>
          </div>
        </div>
        <div class="content-column2">
          <h1>Features</h1>
          <article v-for="feature in features" :key="feature.title" class="instructions-item">
            <div class="instructions-item-icon" :style="{ backgroundImage: `url(https://data.dh.gu.se/ui-icons/${feature.icon})` }"></div>
            <div class="instructions-item-description">
              <h2 class="instructions-item-title">{{ feature.title }}</h2>
              <p>{{ feature.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped src="../etruscan/styles/instructions.css"></style>
