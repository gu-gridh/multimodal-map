import { createApp} from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import OpenLayersMap from "vue3-openlayers";
import 'ol/ol.css';
import 'vue3-openlayers/vue3-openlayers.css';
import "@/assets/main.css";

export default function create(App) {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(OpenLayersMap);

  app.mount("#app");
}
