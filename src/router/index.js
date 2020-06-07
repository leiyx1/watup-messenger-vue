import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}
function loadComponent(component) {
  return () => import(`@/components/${component}.vue`);
}
const routes = [
  {
    path: "/",
    redirect: "/Index",
  },
  {
    path: "/index",
    name: "Index",
    component: loadView("Index"),
    children:[
      {
        path: "/index/Friend",
        name: "Friend",
        component: loadComponent("Friend"),
      },
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
