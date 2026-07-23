import { createApp } from "vue";
import App from "../App.vue";
import { createPinia } from "pinia";
import router from "./router";
import "ol/ol.css";
import i18n from "../../../src/translations/iconographia";

createApp(App).use(createPinia()).use(i18n).use(router).mount("#app");
