import { createRouter, createWebHistory } from "vue-router";
import MapView from "../MapView.vue";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/inscriptions/id/:id",
      name: "inscriptionById",
      component: MapView,
    },
    {
      path: "/summary/:panel?",
      name: "summary",
      component: MapView,
    },
    {
      path: "/surfaces/:panel?",
      name: "surfaces",
      component: MapView,
    },
    {
      path: "/inscriptions/:panel?",
      name: "inscriptions",
      component: MapView,
    },
    {
      path: "/",
      name: "home",
      component: MapView,
    },
    {
      path: "/:panel",
      name: "plan",
      component: MapView,
    },
  ],
});

export default router;
