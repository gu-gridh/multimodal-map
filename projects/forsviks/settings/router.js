import { createRouter, createWebHistory } from "vue-router";
import StartPage from "../StartPage.vue";
import GuidePage from "../GuidePage.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: StartPage },
    { path: "/about", component: StartPage },
    { path: "/guide", component: GuidePage },
    { path: "/map", component: { render: () => null } },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
