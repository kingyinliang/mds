import Vue from 'vue'
import App from './App.vue'
import $ from 'jquery'
import VueCookie from 'vue-cookie'
import httpProxy from 'utils/net/httpProxy'
import elementUi from './elementUi'
import { Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'common/icon/iconfont.css'

Vue.config.productionTip = false

Vue.use(VueCookie)

elementUi()

// 挂载全局
Vue.prototype.$http = httpProxy // ajax请求方法
Vue.prototype.$ = $
// 警告通知
Vue.prototype.$warningToast = (str) => {
    Notification({ title: '警告', message: str, type: 'warning' })
}
// 错误通知
Vue.prototype.$errorToast = (str) => {
    Notification({ title: '错误', message: str, type: 'error', duration: 0 })
}
// 成功通知
Vue.prototype.$successToast = (str) => {
    Notification({ title: '成功', message: str, type: 'success' })
}


new Vue({
  render: h => h(App)
}).$mount('#app')
