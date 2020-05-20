import Vue from 'vue';
import axios from 'axios';
import router from '@/router';
import { HTTP_METHOD, HTTP_RESPONSE_STATE } from './http';
import { Notification, Loading } from 'element-ui';
const http = axios.create({
    timeout: 1000
});
const HOST = process.env.VUE_APP_BASE_API + process.env.VUE_APP_API_V;

let loading:any;// eslint-disable-line
// 使用Element loading-start 方法
function startLoading() {
    loading = Loading.service({
        lock: true,
        spinner: 'loadingGif',
        text: '加载中……',
        background: 'rgba(255, 255, 255, 0.7)'
    });
}

let needLoadingRequestCount = 0;
// 使用Element loading-close 方法
function endLoading() {
    needLoadingRequestCount = 0;
    loading.close();
}
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0 && Vue.prototype.lodingState) {
        startLoading();
    }
    needLoadingRequestCount++;
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0 && Vue.prototype.lodingState) {
        endLoading();
    }
}

/**
 * 请求拦截
 */
http.interceptors.request.use(
    config => {
        if (Vue['cookie'].get('token')) {
            config.headers['Authorization'] = Vue['cookie'].get('token'); // 请求头带上token
        }
        showFullScreenLoading(); // 显示遮罩
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
/**
 * 响应拦截
 */
http.interceptors.response.use(
    response => {
        if (response.data && response.data.code === HTTP_RESPONSE_STATE.SUCCESS) {
            //    成功
            tryHideFullScreenLoading(); // 关闭遮罩
            return Promise.resolve(response);
        } else if (response.data && response.data.code === HTTP_RESPONSE_STATE.EXPIRED_TOKEN) {
            Vue['cookie'].delete('token');
            router.options.isAddDynamicMenuRoutes = false;
            window.location.href = `${process.env.VUE_APP_HOST}`;
            tryHideFullScreenLoading(); // 关闭遮罩
            return Promise.reject(response);
        } else if (response.data && response.data.code === HTTP_RESPONSE_STATE.WARNING) {
            Vue.prototype.$warningToast(response.data.msg)
            tryHideFullScreenLoading(); // 关闭遮罩
            return Promise.reject(response);
        }
        Vue.prototype.$errorToast(response.data.msg)
        tryHideFullScreenLoading(); // 关闭遮罩
        return Promise.reject(response);
    },
    error => {
        // Vue.prototype.$log.writeErrorLog(new Error(`网络请求失败，接口：${url}`), `${error}`)
        Notification({ title: '错误', message: '网络请求失败，请刷新重试', type: 'error' });
        endLoading(); // 关闭遮罩
        return Promise.reject(error);
    }
);

/**
 * @method httpProxy
 * @param {string} url{string} api地址 data{object} 参数 ContentType{boole} post拼接路径 responseType{boole}下载文件流 londingstatus{boole}加载遮罩
 * @param {string} [method] {@link module:constants/http method}
 * */
export default (url: string, method: any = HTTP_METHOD.GET, data = {}, londingstatus = true) => { // eslint-disable-line
    const options = {
        url: HOST + url,
        method,
        headers: {},
        timeout: 1000 * 60 * 20,
        withCredentials: false
    };
    Vue.prototype.lodingState = londingstatus;
    if (method !== HTTP_METHOD.GET) {
        options['data'] = data;
    }
    if (method === HTTP_METHOD.GET) {
        options['params'] = data;
    }

    return http(options);
};
