import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase/app";
import "firebase/auth";
import Home from "../views/Home.vue";
import SingleProperty from "../views/SingleProperty.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiredAuth: true
    }
  },
  {
    path: "/property/id/:id",
    name: "SingleProperty",
    component: SingleProperty,
    meta: {
      requiredAuth: true
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiredAnon: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiredAnon: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user && to.matched.some(record => record.meta.requiredAnon)) {
      next({
        path: "/"
      });
    } else if (!user && to.matched.some(record => record.meta.requiredAuth)) {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  });
});

export default router;
