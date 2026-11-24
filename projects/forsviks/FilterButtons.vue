<template>
  <div class="filter-buttons">
    <template v-for="(marker, key) in types" :key="key" >
      <button v-if="marker.value !== 'textured_model'" type="button" class="filterBtn" :class="{
          selected: marker.value === null ? selectedType.length === 0 : selectedType.includes(marker.value)
        }" 
        :aria-pressed="marker.value === null ? selectedType.length === 0 : selectedType.includes(marker.value)" @click="selectType(marker.value)">
        <span v-if="marker.color" class="markerColor" :style="{ backgroundColor: marker.color}"></span>{{ marker.label }}
      </button>
    </template>
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
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: left;
    /* background-color:rgba(255,255,255,0.4); */
    border-radius:8px;
    padding:10px 0px 0px 0px;
    width:100%;
  }

  .filterBtn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: auto;
    margin-bottom: 8px;
    font-size: 1.0em;
    text-align: center;
    cursor: pointer;
    border-radius: 0px;
    background-color: var(--theme-6);
    padding: 5px 10px 5px 6px;
    margin-right: 10px;
    width:100px;
     border-width:0px 0px 0px 4px;
     border-style:solid;
     border-color:transparent;
  }

  .filterBtn.selected {
   color:var(--theme-3);
    border-color:var(--theme-3);
  }

  .markerColor {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right:5px;
    border-radius: 3px;
    flex-shrink: 0;
    /*  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5); */
  }
</style>