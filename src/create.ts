import { createApp, type Component } from "vue";
import { createPinia } from "pinia";

import router from "@/router";
import OpenLayersMap from "vue3-openlayers";

import "vue3-openlayers/dist/vue3-openlayers.css";
import "@/assets/main.css";

export default function create(App: Component) {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(OpenLayersMap);

  app.mount("#app");
}
