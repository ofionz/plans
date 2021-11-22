import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/main",
  },

  {
    path: "/main",
    name: "main",
    component: () => import(/* webpackChunkName: "Main" */ "../pages/Main.vue"),
  },


];

const router = new VueRouter({
  routes,
});

export default router;
