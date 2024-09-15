import { createRouter, createWebHistory } from "vue-router";
import MapView from "../MapView.vue";
import PlaceView from "../PlaceView.vue";
import ObjectView from "../ObjectView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
      path: "/place/:id",
      name: "place",
      component: PlaceView,
      props: true
    },
    {
      path: "/detail/:type/:id",
      name: "detail",
      component: ObjectView,
      props: true,
    },
  ],
});

export default router;
