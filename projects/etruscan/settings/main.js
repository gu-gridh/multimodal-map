import { createApp } from "vue";
import App from "../App.vue";
import { createPinia } from "pinia";
import router from "./router";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";
import "@/assets/main.css";
import i18n from '../../../src/translations/etruscan';
import VueMatomo from 'vue-matomo';

createApp(App)
  .use(VueMatomo, {
    host: import.meta.env.VITE_MATOMO_URL,
    siteId: import.meta.env.VITE_MATOMO_ID,
    router: router,
    enableLinkTracking: true,
    trackInitialView: true,
    debug: false
  })
  .use(createPinia())
  .use(i18n)
  .use(router)
  .use(OpenLayersMap)
  .mount("#app");
