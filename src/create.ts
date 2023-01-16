import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";
import OpenLayersMap from 'vue3-openlayers';
import type { Project } from "./types/project";

import 'vue3-openlayers/dist/vue3-openlayers.css';
import "@/assets/main.css";

export default function create(rootProps: { config: Project }) {
  const app = createApp(App, rootProps);

  app.use(createPinia());
  app.use(router);
  app.use(OpenLayersMap);

  app.mount("#app");
}