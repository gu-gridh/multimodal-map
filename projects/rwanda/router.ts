import { createRouter, createWebHistory } from "vue-router";
import ObjectView from "./ObjectView.vue";
import Grid from "./Grid.vue";
import ObjectViewImage from "./ObjectViewImage.vue";

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
      props: router => ({id: router.params.id, type: router.params.type})
    },
/*     {
      path: "/image/:id",
      name: "image",
      component: ObjectView,
      props: router => ({id: router.params.id})
    } */
    
  ],
});

export default router;
