<script setup>
defineProps({
  guplayId: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <img
    :src="`https://vod-cache.kaltura.nordu.net/p/302/sp/30200/thumbnail/entry_id/${guplayId}/version/100002/width/478/height/269/type/3/quality/100`"
  />
</template>
