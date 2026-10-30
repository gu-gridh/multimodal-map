<script setup>
import config from "./settings/config";
</script>

<template>
  <div class="identity-circle"><span>{{ config.titleLines.join("\n") }}</span></div>
</template>

<style scoped>
span { white-space: pre-line; }
</style>
