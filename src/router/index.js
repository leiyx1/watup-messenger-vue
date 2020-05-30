import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}
function loadComponent(component) {
  return () => import(`@/components/${component}.vue`);
}
function loadLayout(component) {
  return () => import(`@/components/layout/${component}.vue`);
}
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: loadView("SignIn"),
  },
  {
    path: "/index",
    name: "Index",
    component: loadView("Index"),
    children: [
      {
        path: "/index",
        name: "Page1",
        component: loadComponent("Page1"),
      },
      {
        path: "/index/chatpanel",
        name: "ChatPanel",
        component: loadLayout("ChatPanel"),
      },
      {
        path: "/index/page3",
        name: "Page3",
        component: loadComponent("Page3"),
      },
      {
        path: "/index/setting",
        name: "Setting",
        component: loadLayout("Setting"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
