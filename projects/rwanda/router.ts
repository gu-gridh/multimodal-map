import { createRouter, createWebHistory } from "vue-router";
import MapView from "./MapView.vue";
import ObjectView from "./ObjectView.vue";
import Grid from "./Grid.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Grid,
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
