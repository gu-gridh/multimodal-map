<template>
  <div class="map-view-archive-overlay">
    <div class="archive-content">
      <input type="text" placeholder="Search in Archive" class="archive-search-box"/>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue';

const searchQuery = ref('');

</script>

<style>
.map-view-archive-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10; 
}

.archive-content {
  position: absolute;
  top: 20%;
  padding: 20px;
  border-radius: 8px;
  left: 37%;
}

.archive-search-box {
  width: 800px;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
