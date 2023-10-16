import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";
import "@/assets/main.css";
import i18n from '../../src/translations/etruscan';

createApp(App) //
  .use(createPinia())
  .use(i18n)
  .use(router)
  .use(OpenLayersMap)
  .mount("#app");
