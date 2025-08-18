<template>
  <div id="gallery-container">
    <div class="summary-content">
      <h2>Summary View</h2>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
#gallery-container {
  position: absolute;
  margin-left: 510px;
  width: calc(100% - 510px);
  height: calc(100% - 80px);
  background-color: black;
  color: white;
  opacity: 0.9;
  padding: 20px;
  overflow-y: auto;
}

h2 {
    color: white;
    font-size: 100px;
}

@media screen and (max-width: 900px) {
  #gallery-container {
    margin-left: 0;
    width: 100%;
    height: 100%;
  }
}

.summary-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
