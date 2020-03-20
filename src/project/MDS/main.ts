import Vue from 'vue'
import router from './router'
import $ from 'jquery'
import App from './App.vue'
import store from '@/store/index.ts'
import VueCookie from 'vue-cookie'
import useComponents from '@/components/index'
import install from '@/views/components/install'
import httpProxy from '@/net/httpProxy'
import { isAuth } from '@/net/validate'
import { Notification } from 'element-ui'
import elementUi from './elementUi'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/index.scss'

Vue.config.productionTip = false

Vue.use(VueCookie)
elementUi()

// 自定义全局组件
Vue.use(useComponents)
Vue.use(install)

// 挂载全局
Vue.prototype.$http = httpProxy // ajax请求方法
Vue.prototype.isAuth = isAuth// 权限方法
Vue.prototype.$ = $
// 警告通知
Vue.prototype.$warningTost = (str) => {
    Notification({ title: '警告', message: str, type: 'warning' })
}
// 错误通知
Vue.prototype.$errorTost = (str) => {
    Notification({ title: '错误', message: str, type: 'error', duration: 0 })
}
// 成功通知
Vue.prototype.$successTost = (str) => {
    Notification({ title: '成功', message: str, type: 'success' })
}
// 生成uuid
Vue.prototype.uuid = function(len: number, radixs: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid: Array<string> = []
    let i
    const radix = (radixs || chars.length)
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
        // rfc4122, version 4 form
        let r
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    return uuid.join('')
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
