import { createRouter, createWebHistory } from "vue-router";
import MapView from "./MapView.vue";
import PlaceView from "./PlaceView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
      path: "/:type-:id",
      name: "type-id",
      component: PlaceView,
    }    
  ],
});

export default router;
