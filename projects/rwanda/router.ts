import { createRouter, createWebHistory } from "vue-router";
import MapView from "./MapView.vue";
import ObjectView from "./ObjectView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
      path: "/:type/:id",
      name: "detail",
      component: ObjectView,
      props: true,
    },
    
  ],
});

export default router;
