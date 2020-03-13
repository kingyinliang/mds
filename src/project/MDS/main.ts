import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from '@/store/index.ts'
import VueCookie from 'vue-cookie'
import useComponents from '@/components/index'
import httpProxy from '@/net/httpProxy'
import { isAuth } from '@/net/validate'

Vue.config.productionTip = false

Vue.use(VueCookie)
// 自定义全局组件
Vue.use(useComponents)

// 挂载全局
Vue.prototype.$http = httpProxy // ajax请求方法
Vue.prototype.isAuth = isAuth// 权限方法

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
