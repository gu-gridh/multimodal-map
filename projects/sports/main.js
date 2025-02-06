import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";
import "@/assets/main.css";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(OpenLayersMap)
  .mount("#app");
