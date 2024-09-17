import { createApp } from "vue";
import App from "../App.vue";
import { createPinia } from "pinia";
import router from "./router";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";
import "@/assets/main.css";
import VueMatomo from 'vue-matomo'

createApp(App) //
  .use(createPinia())
  .use(router)
  .use(OpenLayersMap)
  .use(VueMatomo, {
    host: import.meta.env.VITE_MATOMO_URL,
    siteId: import.meta.env.VITE_MATOMO_SITE_ID,
    router: router,
    enableLinkTracking: true,
    trackInitialView: true,
    debug: false
  })
  .mount("#app");
 