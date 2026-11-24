<template>
  <div class="filter-buttons">
    <button v-for="(marker, key) in types" :key="key" type="button" class="filterBtn" :class="{
        selected: marker.value === null
          ? selectedType.length === 0
          : selectedType.includes(marker.value)
      }" :aria-pressed="marker.value === null
        ? selectedType.length === 0
        : selectedType.includes(marker.value)" @click="selectType(marker.value)">
      {{ marker.label }}
    </button>

  </div>
</template>

<script setup>

  const props = defineProps({
    types: {
      type: Object,
      required: true
    },
    selectedType: {
      type: Array,
      default: () => []
    }
  });


  const emit = defineEmits(["update:selectedType"]);

  const selectType = (type) => {
    if (type === null) {
      emit("update:selectedType", []);
      return;
    }
    const selected = props.selectedType;
    const updated = selected.includes(type)
      ? selected.filter(t => t !== type)
      : [...selected, type];

    emit("update:selectedType", updated);
  }
</script>

<style scoped>
  .filter-buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color:rgba(255,255,255,0.4);
    border-radius:8px;
    padding:10px 0px 10px 10px;
  }

  .filterBtn {
    display: block;
    width: auto;
    margin-bottom: 8px;
    text-align: center;
    cursor: pointer;
    border: 0px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
    padding: 5px 10px;
    margin-right: 10px;
  }

  .filterBtn.selected {
    background-color: var(--theme-3);
    color: white;
  }
</style>