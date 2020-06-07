import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}
<<<<<<< HEAD
function loadComponent(component) {
  return () => import(`@/components/${component}.vue`);
=======
// function loadComponent(component) {
//   return () => import(`@/components/${component}.vue`);
// }
function loadLayout(component) {
  return () => import(`@/components/layout/${component}.vue`);
>>>>>>> Hu
}
const routes = [
  {
    path: "/",
<<<<<<< HEAD
    redirect: "/Index",
=======
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: loadView("SignIn"),
>>>>>>> Hu
  },
  {
    path: "/index",
    name: "Index",
    component: loadView("Index"),
<<<<<<< HEAD
    children:[
      {
        path: "/index/Friend",
        name: "Friend",
        component: loadComponent("Friend"),
      },
    ]
=======
    children: [
      // {
      //   path: "/index",
      //   name: "Page1",
      //   component: loadComponent("Page1"),
      // },
      {
        path: "/index/chatpanel",
        name: "ChatPanel",
        component: loadLayout("ChatPanel"),
      },
      {
        path: "/index/friends",
        name: "FriendsPanel",
        component: loadLayout("FriendsPanel"),
      },
      {
        path: "/index/setting",
        name: "Setting",
        component: loadLayout("Setting"),
      },
    ],
>>>>>>> Hu
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
