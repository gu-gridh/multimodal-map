<script setup>
defineProps({
  article: { type: Object, default: null },
  articles: { type: Array, default: () => [] }
});

defineEmits(["close", "select"]);
</script>

<template>
  <div v-if="articles.length" class="cluster-list">
    <div class="cluster-list-header">
      <strong>{{ articles.length }} artiklar</strong>
      <button class="cluster-close" type="button" @click.stop="$emit('close')">×</button>
    </div>
    <button v-for="item in articles" :key="item.id" class="cluster-list-item" type="button"
      @click.stop="$emit('select', item)">
      <img v-if="item.icon" :src="item.icon" alt="">
      <span>{{ item.name }}</span>
    </button>
  </div>

  <article v-if="article" class="marker-card">
    <button class="marker-card-close" type="button" title="Stäng" @click.stop="$emit('close')">×</button>
    <div class="marker-card-media">
      <img v-if="article.previewUrl || article.mediaUrl" :src="article.previewUrl || article.mediaUrl"
        :alt="article.mediaTitle || article.name">
      <div v-else class="marker-card-placeholder">{{ article.type }}</div>
    </div>
    <div class="marker-card-copy">
      <h2>{{ article.name }}</h2>
      <p>{{ article.areaName }}</p>
    </div>
    <div class="marker-card-footer">
      <a v-if="article.mediaUrl || article.previewUrl" class="marker-card-action"
        :href="article.mediaUrl || article.previewUrl" target="_blank" rel="noopener noreferrer">
        Utforska
      </a>
      <span v-else class="marker-card-action disabled">Utforska</span>
    </div>
  </article>
</template>

<style scoped>
.marker-card,
.cluster-list {
  position: relative;
  width: 100%;
  border-radius: 18px 18px 14px 14px;
  background: #fff8ed;
  color: #3d211b;
  box-shadow: 0 10px 18px rgba(45, 20, 12, .18), 0 24px 50px rgba(45, 20, 12, .32);
  animation: card-appear .35s cubic-bezier(.2, .9, .25, 1.15);
}

.cluster-list {
  max-height: 320px;
  overflow-y: auto;
  border-radius: 14px;
}

.cluster-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

.cluster-close {
  border: 0;
  background: transparent;
  color: #3d211b;
  font-size: 22px;
  cursor: pointer;
}

.cluster-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: 0;
  background: transparent;
  color: #3d211b;
  text-align: left;
  cursor: pointer;
}

.cluster-list-item:hover {
  background: #eadbca;
}

.cluster-list-item img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.marker-card::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 16px;
  height: 16px;
  background: #fff8ed;
  transform: translateX(-50%) rotate(45deg);
}

.marker-card-close {
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: rgba(42, 24, 19, .76);
  color: transparent;
  padding: 0;
  font-size: 0;
  cursor: pointer;
}

.marker-card-close::before,
.marker-card-close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 1px;
  background: white;
  transform: translate(-50%, -50%) rotate(45deg);
}

.marker-card-close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.marker-card-media {
  height: 130px;
  overflow: hidden;
  border-radius: 18px 18px 0 0;
  background: var(--panel-background);
}

.marker-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marker-card-placeholder {
  display: grid;
  height: 100%;
  place-items: center;
  color: var(--theme-4);
  text-transform: capitalize;
}

.marker-card-copy {
  padding: 14px 16px 12px;
}

.marker-card-copy h2 {
  margin: 0;
  color: var(--theme-3);
  font-size: 21px;
  line-height: 1.1;
}

.marker-card-copy p {
  margin: 5px 0 0;
  color: #231915;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.marker-card-footer {
  height: 46px;
}

.marker-card-action {
  display: table;
  margin: 0 auto 16px;
  padding: 4px 12px;
  border-radius: 5px;
  background: var(--theme-3);
  color: white;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.marker-card-action:hover {
  background: var(--theme-4);
}

.marker-card-action.disabled {
  opacity: .65;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(18px) scale(.35);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {

  .marker-card,
  .cluster-list {
    animation: none;
  }
}
</style>
