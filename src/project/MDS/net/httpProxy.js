import Vue from 'vue';
import axios from 'axios';
import router from '@/router';
import { HTTP_METHOD } from './http';
// import {Message, Loading} from 'element-ui'
// import ElementUI from 'element-ui'
import { Notification, Loading } from 'element-ui';
// import storage, { AUTHORIZATION_KEY } from '@/storage/storage'
const http = axios.create({
    timeout: 1000
});
let loading;
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
    if (Vue.prototype.lodingState) {
        needLoadingRequestCount++;
    }
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    // console.log(needLoadingRequestCount)
    // console.log(Vue.prototype.lodingState)
    if (needLoadingRequestCount === 0 && Vue.prototype.lodingState) {
        endLoading();
    }
}

/**
 * 请求拦截
 */
http.interceptors.request.use(
    config => {
        config.headers['Authorization'] = Vue.cookie.get('token'); // 请求头带上token
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
        if (response.data && response.data.code === 401) {
            // 401, token失效
            Vue.cookie.delete('token');
            router.options.isAddDynamicMenuRoutes = false;
            window.location.href = `${process.env.VUE_APP_HOST}`;
        }
        if (response.data && response.data.code === 500) {
            // Vue.prototype.$log.writeErrorLog(new Error(`接口错误：${url}`), `msg:${response.data.msg},data: ${JSON.stringify(data)}`)
        }
        if (response.data && response.data.code === 110) {
            Vue.prototype.$warningToast(response.data.msg);
            tryHideFullScreenLoading(); // 关闭遮罩
            return Promise.resolve(response);
        }
        tryHideFullScreenLoading(); // 关闭遮罩
        return response;
    },
    error => {
        // Vue.prototype.$log.writeErrorLog(new Error(`网络请求失败，接口：${url}`), `${error}`)
        Notification({ title: '服务器错误', message: '网络连接请求失败，请稍后刷新重试', type: 'error' });
        endLoading(); // 关闭遮罩
        return Promise.reject(error);
    }
);

/*
 * @method httpProxy
 * @param {string} url{string} api地址 data{object} 参数 ContentType{boole} post拼接路径 responseType{boole}下载文件流 londingstatus{boole}加载遮罩
 * @param {string} [method] {@link module:constants/http method}
 * */
export default (url, method = HTTP_METHOD.GET, data = {}, ContentType = false, responseType = false, londingstatus = true) => {
    // export default (url, method = HTTP_METHOD.GET, data = {}, login = false, ContentType = false) => {
    //   let cancel, promiseArr = {}
    //   const CancelToken = axios.CancelToken
    const options = {
        url,
        method,
        headers: {
            // 'Access-token': storage.getData(AUTHORIZATION_KEY) || 'token will be here'
        },
        // cancelToken: new CancelToken(c => {
        //   cancel = c
        // }),
        timeout: 1000 * 60 * 20,
        withCredentials: false
    };
    if (responseType) {
        options.responseType = 'blob';
    }
    if (ContentType) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // options.transformRequest = [function (data) {
        //   let ret = ''
        //   for (let it in data) {
        //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        //   }
        //   return ret
        // }]
    }
    Vue.prototype.lodingState = londingstatus;

    if (method !== HTTP_METHOD.GET) {
        options.data = data;
    }
    if (method === HTTP_METHOD.GET) {
        options.params = data;
    }

    return http(options);
};
