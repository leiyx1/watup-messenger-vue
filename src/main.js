import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import {ZegoClient} from 'webrtc-zego'

Vue.config.productionTip = false
Vue.use(VueRouter)



new Vue({
  render: h => h(App)
}).$mount('#app')
