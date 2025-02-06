<template>
  <div class="observation-card">
    <div class="observation">Observation</div>
    <div class="date">{{ observation.date }}</div>
    <div class="title">{{ observation.title }}</div>
    <p class="description" v-html="observation.description"></p>

  </div>
</template>

<script setup>
const props = defineProps({
  observation: Object,
});
</script>

<style scoped>
.observation-card {
  float: left;
  height: auto;
  width: 100%;
  color: black;
  background-color: rgb(230, 230, 230);
  margin-bottom: 30px;
  padding: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease-in-out;
  border-radius: 10px !important;
}

.observation-card:hover {
  cursor: pointer;
  transform: scale(1.05);
}

.observation {
  font-size: 1.0em;
  line-height: 1.0;
  font-weight: 400;
  padding-bottom: 0px;
}

.title {
  margin-top: 20px;
  font-size: 1.3em;
  line-height: 1.0;
  font-weight: 400;
}

.description {
  margin-top: 10px;
  font-size: 1.0em;
  line-height: 1.2;
}

.date {
  font-size: 1.0em;
  color: rgb(200, 0, 0);
}
</style>
