import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}
// function loadComponent(component) {
//   return () => import(`@/components/${component}.vue`);
// }
const routes = [
  {
    path: "/",
    name: "SignIn",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/index",
    name: "Index",
    component: loadView("Index"),
    // children: [
    //   {
    //     path: "/",
    //     name: "ChatBox",
    //     component: loadComponent("ChatBox"),
    //   },
    //   {
    //     path: "/correspondence",
    //     name: "Correspondence",
    //     component: loadComponent("UserBox"),
    //   },
    //   {
    //     path: "/setting",
    //     name: "Setting",
    //     component: loadComponent("Setting"),
    //   },
    // ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
