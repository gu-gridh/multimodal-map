<script setup>
defineProps({ visibleAbout: Boolean });
defineEmits(["close"]);
</script>

<template>
  <div v-if="visibleAbout" class="about-overlay" @click.self="$emit('close')">
    <div class="about-dialog">
      <button class="about-close" @click="$emit('close')">×</button>
      <h1>Iconographia Mediaevalis Suetica</h1>
      <p v-html="$t('aboutText1')"></p>
      <h2>{{ $t("aboutUsageTitle") }}</h2>
      <p v-html="$t('aboutText2')"></p>
    </div>
  </div>
</template>

<style scoped>
.about-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-dialog {
  position: relative;
  background: #262626;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  width: calc(100% - 40px);
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 12px;
  padding: 40px 44px;
  line-height: 1.5;
  font-weight: 300;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

.about-dialog h1 {
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 100;
  font-size: 38px;
  line-height: 1;
  margin: 0 0 18px;
  color: white;
}

.about-dialog h2 {
  font-weight: 300;
  font-size: 24px;
  margin: 22px 0 8px;
  color: white;
}

.about-dialog p {
  margin-bottom: 12px;
}

.about-dialog :deep(a) {
  color: rgb(214, 160, 160);
}

.about-close {
  position: absolute;
  top: 12px;
  right: 18px;
  font-size: 28px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.about-close:hover {
  color: white;
}
</style>
