import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SingleProperty from "../views/SingleProperty.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/property/id/:id",
    name: "SingleProperty",
    component: SingleProperty
  }
];

const router = new VueRouter({
  routes
});

export default router;
