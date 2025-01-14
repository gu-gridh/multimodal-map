<script setup>
defineProps({
  guplayId: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <iframe
    :src="`https://play.gu.se/embed/secure/iframe/entryId/${guplayId}/uiConfId/23450401`"
    class="mainvisual-video"
    allowfullscreen
    webkitallowfullscreen
    mozAllowFullScreen
    allow="autoplay *; fullscreen *; encrypted-media *"
    sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
  >
  </iframe>
</template>
