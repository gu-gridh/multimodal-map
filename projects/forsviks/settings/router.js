import { createRouter, createWebHistory } from "vue-router";
import StartPage from "../StartPage.vue";
import GuidePage from "../GuidePage.vue";

const MapPage = { render: () => null };

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: MapPage },
    { path: "/about", component: StartPage },
    { path: "/guide", component: GuidePage },
    { path: "/map", redirect: "/" },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
