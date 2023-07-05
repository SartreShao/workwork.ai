import { createRouter, createWebHistory } from "vue-router";
import TaskView from "../views/TaskView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "task",
      component: TaskView
    }
    // {
    //   path: "/task",
    //   name: "task",
    //   component: () => import("../views/TaskView.vue")
    // }
  ]
});

export default router;
