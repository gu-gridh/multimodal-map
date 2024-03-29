import { ref } from "vue";
import { defineStore } from "pinia";

export const jubileumStore = defineStore("jubileum", () => {
  const categories = ref<Array<string>>(["all"]);
  return { categories };
});
