import { createRouter, createWebHistory } from "vue-router";
import SearchPanel from "../SearchPanel.vue";
import DetailPanel from "../DetailPanel.vue";

// The router only swaps the right-hand data pane; the gallery pane
// stays mounted in App.vue (as in the original mb-frontend).
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: SearchPanel,
    },
    {
      // type is "object" or "ir_motive"
      path: "/:type(object|ir_motive)/:id(\\d+)",
      name: "detail",
      component: DetailPanel,
      props: true,
    },
  ],
});

export default router;
