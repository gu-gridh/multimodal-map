<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    require: true,
  },
});
</script>

<template>Type "{{ type }}", id "{{ id }}"</template>
