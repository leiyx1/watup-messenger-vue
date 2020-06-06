import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';



Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)



new Vue({
  render: h => h(App)
}).$mount('#app')
