import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
var axios = require("axios");
//var Peer = require("simple-peer")
// axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.baseURL = "http://106.13.123.20:8080/";

Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
