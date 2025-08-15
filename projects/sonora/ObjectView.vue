<script setup>
import { ref, onMounted } from "vue";
import ObjectViewImage from "./ObjectViewImage.vue";
import i18n from '../../src/translations/sonora';

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

const fetchObjectData = async () => {
  try {
    const currentLocale = localStorage.getItem('sonoraLanguage') || i18n.global.locale;
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/document1.php?id=${props.id}&lang=${currentLocale}`);
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

onMounted(fetchObjectData);

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
