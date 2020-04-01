import Vue from 'vue'
import App from './App.vue'
import $ from 'jquery'
import VueCookie from 'vue-cookie'
import httpProxy from 'utils/net/httpProxy'
import elementUi from './elementUi'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(VueCookie)

elementUi()

// 挂载全局
Vue.prototype.$http = httpProxy // ajax请求方法
Vue.prototype.$ = $

new Vue({
  render: h => h(App)
}).$mount('#app')
