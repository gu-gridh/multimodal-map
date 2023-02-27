import { createRouter, createWebHistory } from "vue-router";
import MapView from "./MapView.vue";
import DetailView from "./DetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
      path: "/detail/:type/:id",
      name: "detail",
      component: DetailView,
      props: true,
    },
  ],
});

export default router;
