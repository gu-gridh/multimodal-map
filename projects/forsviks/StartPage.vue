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
        <div class="about-article-sub fullopacityui">
          <p>{{ config.about }}</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?</p>
        </div>
        <router-link class="category-button fullopacityui" to="/map">Explore</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped src="../etruscan/styles/about.css"></style>

<style scoped>
.about-article-sub p + p { margin-top: 1em; }
</style>
