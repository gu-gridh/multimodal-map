import { createRouter, createWebHistory } from "vue-router";
import MapView from "../MapView.vue";
import PlaceView from "../PlaceView.vue";
//import ObjectView from "../ObjectView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
      path: "/:name",
      name: "place",
      component: PlaceView,
      props: route => {
        const name = Array.isArray(route.params.name) ? route.params.name[0] : route.params.name;
        // Replace underscores with spaces
        return { name: name.replace(/_/g, ' ') };
      }
    },
  ],
});

export default router;
