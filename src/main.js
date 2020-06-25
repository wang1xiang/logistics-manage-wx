import Vue from 'vue'
import App from './App'
import hxNavbar from './components/hx-navbar/hx-navbar.vue'
import api from '@/vmeitime-http/'

Vue.component('hx-navbar', hxNavbar)
Vue.prototype.$api = api
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
