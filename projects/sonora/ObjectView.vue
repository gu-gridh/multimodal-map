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

const currentPage = ref(Number(route.query.page) || 1);
const totalPages = ref(1);

const fetchObjectData = async (page = currentPage.value) => {
  try {
    const lang = route.query.lang || locale.value;
    if (route.query.lang && route.query.lang !== locale.value) {
      locale.value = route.query.lang;
    }
    const response = await fetch(`https://orgeldatabas.gu.se/webgoart/goart/document1.php?id=${props.id}&lang=${lang}&page=${page}`);
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
    totalPages.value = Number(data.no_facs) || 1;
    currentPage.value = page;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => fetchObjectData());

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  fetchObjectData(page);
};

const handleNext = () => goToPage(currentPage.value + 1);
const handlePrev = () => goToPage(currentPage.value - 1);

const objectComponent = {
  image: ObjectViewImage,
}[props.type];
</script>

<template>

  <component
    :is="objectComponent"
    :object="object"
    :id="Number(id)"
    :page="currentPage"
    :total-pages="totalPages"
    @next="handleNext"
    @prev="handlePrev"
  />

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
