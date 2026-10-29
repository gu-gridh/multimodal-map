<script setup>
import { provide } from "vue";
import config from "./settings/config";
import MapView from "./MapView.vue";
import Footer from "./Footer.vue";

provide("config", config);
</script>

<template>
  <div class="site-shell">
    <MapView />
    <router-view v-slot="{ Component, route }">
      <Transition name="page-fade" appear>
        <component :is="Component" v-if="route.path !== '/map'" :key="route.path" />
      </Transition>
    </router-view>
    <Footer />
  </div>
</template>
