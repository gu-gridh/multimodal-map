import { createApp } from "vue";
import { createPinia } from "pinia";
import OpenLayersMap from "vue3-openlayers";
import "ol/ol.css";
import "vue3-openlayers/vue3-openlayers.css";
import App from "../App.vue";
import router from "./router";
import "@/assets/main.css";
import "../../etruscan/theme.css";
import "../theme.css";

createApp(App).use(createPinia()).use(router).use(OpenLayersMap).mount("#app");
