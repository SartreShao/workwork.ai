import { createRouter, createWebHistory } from "vue-router";
import TaskView from "../views/TaskView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "task",
      component: TaskView
    },
    {
      path: "/invite",
      name: "invite",
      component: () => import("../views/InviteView.vue")
    },
    ,
    {
      path: "/book",
      name: "book",
      component: () => import("../views/BookView.vue")
    }
  ]
});

export default router;
