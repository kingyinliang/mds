import Vue from 'vue';
import App from './App.vue';
import $ from 'jquery';
import router from './router/index';
import store from './store/index';
import { isAuth } from 'utils/utils';
import useComponents from 'src/components/index';
import elementUi from './elementUi';
import httpProxy from 'utils/net/httpProxy';
import VueCookie from 'vue-cookie';
import * as socketApi from 'utils/net/WebSocketConnect';

// common
import 'element-ui/lib/theme-chalk/index.css';
import 'common/scss/index.scss';
import 'common/icon/iconfont.css';
import { Notification } from 'element-ui';

elementUi();
Vue.use(VueCookie);
Vue.use(useComponents);

Vue.config.productionTip = false;

// 挂载全局
Vue.prototype.$http = httpProxy; // ajax请求方法
Vue.prototype.$ = $;
Vue.prototype.isAuth = isAuth; // 权限方法
// 警告通知
Vue.prototype.$warningToast = str => {
    Notification({ title: '警告', message: str, type: 'warning' });
};
// 错误通知
Vue.prototype.$errorToast = str => {
    Notification({ title: '错误', message: str, type: 'error', duration: 0 });
};
// 成功通知
Vue.prototype.$successToast = str => {
    Notification({ title: '成功', message: str, type: 'success' });
};
// 提示
Vue.prototype.$infoToast = str => {
    Notification({ title: '提示', message: str, type: 'info' });
};

Vue.prototype.socketApi = socketApi;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
