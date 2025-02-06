import { ref } from "vue";
import { defineStore } from "pinia";

export const jubileumStore = defineStore("jubileum", () => {
  const categories = ref(["all"]);
  return { categories };
});
