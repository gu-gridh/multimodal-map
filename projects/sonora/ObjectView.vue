<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ObjectViewImage from "./ObjectViewImage.vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true,
  },
});

const object = ref({});
const route = useRoute();
const { locale } = useI18n({ useScope: 'global' });

const fetchObjectData = async () => {
  try {
    const lang = route.query.lang || locale.value;
    if (route.query.lang && route.query.lang !== locale.value) {
      locale.value = route.query.lang;
    }
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/document1.php?id=${props.id}&lang=${lang}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();

    Object.keys(data).forEach(key => {
      //check if the value for this key contains a semicolon
      if (typeof data[key] === 'string' && data[key].includes(';')) {
        const firstSemicolonIndex = data[key].indexOf(';');
        const label = data[key].substring(0, firstSemicolonIndex).trim();
        const remainingData = data[key].substring(firstSemicolonIndex + 1).trim();
        data[key] = { label, data: remainingData };
      }
    });

    object.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => fetchObjectData());

const objectComponent = {
  image: ObjectViewImage,
}[props.type];
</script>

<template>

  <component :is="objectComponent" :object="object" :id="Number(id)" />

</template>

<style>
.metadata {
  float: left;
  width: 450px;
  height: 100vh;
  background-color: black;
  color: white;
}

.illustration {
  float: left;
  width: calc(100% - 450px);
  background-color: black;
  height: 100vh;
}
</style>
