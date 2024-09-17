import { createRouter, createWebHistory } from "vue-router";
import Grid from "../Grid.vue";
import ObjectViewImage from "../ObjectViewImage.vue";
import Document from "../Document.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Grid,
    },
    {
      path: "/place/:placeId",
      name: "place",
      component: Grid,
      props: true
    }, 
    {
      path: "/image/:id",
      name: "image",
      component: ObjectViewImage,
      props: true
    },
    {
      path: "/document/:id",
      name: "document",
      component: Document,
      props: true
    }
  ],
});

export default router;
