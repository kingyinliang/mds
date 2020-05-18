import { RouteConfig } from 'vue-router';
import { VueRouter } from 'vue-router/types/router';
import { COMMON_API } from 'common/api/api';

const importTarget = process.env.NODE_ENV !== 'local' ? file => () => import('project/' + file + '.vue') : file => require('project/' + file + '.vue').default;

/**
 * 函数节流方法 只加定时器叫防抖
 * @param Function fn 延时调用函数
 * @param Number delay 延迟多长时间
 * @param Number atleast 至少多长时间触发一次
 * @return Function 延迟执行的方法
 */
export function throttle(fn: Function, delay: number, atleast: number) {
    let timer: number|undefined;
    let previous: number | null = null;
    return function() {
        const now = Number(new Date());
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
            fn();
            previous = now;
            clearTimeout(timer);
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn();
                previous = null;
            }, delay);
        }
    };
}
/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
export function fnCurrentRouteType(route, globalRoutes) {
    let temp = [];
    for (let i = 0; i < globalRoutes.length; i++) {
        if (route.path === globalRoutes[i].path) {
            return 'global';
        } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
            temp = temp.concat(globalRoutes[i].children);
        }
    }
    return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main';
}
/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
interface MenuList {
    menuUrl: string;
    type: string;
    id: string;
    menuName: string;
    list: MenuList[];
}
export class AddRoutes {
    router: VueRouter
    mainRoutes: RouteConfig
    SSRoutes: RouteConfig[]

    constructor(router: VueRouter, mainRoutes: RouteConfig, SSRoutes?: RouteConfig[]) {
        this.router = router
        this.mainRoutes = mainRoutes
        this.SSRoutes = SSRoutes || []
    }

    fnAddDynamicMenuRoutes(menuList: MenuList[] = [], routes: RouteConfig[] = []) {
        let temp: MenuList[] = [];
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].list && menuList[i].list.length >= 1) {
                temp = temp.concat(menuList[i].list);
            }
            if (menuList[i].menuUrl && /\S/.test(menuList[i].menuUrl)) {
                menuList[i].menuUrl = menuList[i].menuUrl.replace(/^\//, '');
                const route: RouteConfig = {
                    path: menuList[i].menuUrl.replace(/\//g, '-'),
                    name: menuList[i].menuUrl.replace(/\//g, '-'),
                    meta: {
                        menuId: menuList[i].id,
                        title: menuList[i].menuName,
                        isDynamic: true,
                        isTab: true,
                        iframeUrl: ''
                    }
                };
                // url以http[s]://开头, 通过iframe展示
                if (/^http[s]?:\/\/.*/.test(menuList[i].menuUrl)) {
                    route['path'] = `i-${menuList[i].id}`;
                    route['name'] = `i-${menuList[i].id}`;
                    route['meta']['iframeUrl'] = menuList[i].menuUrl;
                } else {
                    try {
                        route['component'] = importTarget(`${menuList[i].menuUrl}`) || null;
                    } catch (e) {
                        //
                    }
                }
                routes.push(route);
                this.SSRoutes.push(route);
            }
        }
        if (temp.length >= 1) {
            this.fnAddDynamicMenuRoutes(temp, routes);
        } else {
            this.mainRoutes['name'] = 'main-dynamic';
            this.mainRoutes['children'] = routes;
            this.router.addRoutes([this.mainRoutes, { path: '*', redirect: { path: '/404' } }]);
            sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(this.SSRoutes || '[]'));
            console.log('\n');
            console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue');
            console.log(this.mainRoutes.children);
            console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue');

        }
    }
}
/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
    const res: object[] = [];
    const temp = {};
    for (let i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i];
    }
    for (let k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = [];
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1;
            }
            data[k]['_level'] = temp[data[k][pid]]['_level'] + 1;
            temp[data[k][pid]]['children'].push(data[k]);
        } else {
            res.push(data[k]);
        }
    }
    return res;
}
/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
    return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false;
}
/**
 * 生成id
 * @param {*} len长度 radix
 */
export function generateUuid(len: number, radix: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid: Array<string> = [];
    let i: number;
    const radixWrap = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radixWrap)];
    } else {
        // rfc4122, version 4 form
        let r: number;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/**
 * 获取对象的路径 函数柯里化
 * @param path 传入路径返回获取这个路径的方法
 * @param obj 获取哪个对象的参数
 */
/* eslint-disable */
export function creatGetPath(path) {
    let paths = path.split('.');
    return function getPath(obj) {
        let res = obj;
        let prop;
        while ((prop = paths.shift())) {
            res = res[prop];
        }
        return res;
    };
}
/* eslint-enable */

/**
 * S3获取文件路径
 * @param {string} arrData 数组形式数据
 * @param {string} imgPath key
 */
export function getS3Img(arrData, imgPath) {
    const getPath = creatGetPath(imgPath);
    arrData.forEach(item => {
        COMMON_API.DOWNLOADFILE_API({
            key: getPath(item)
        }).then(({ data }) => {
            item.img = data.data.url
            arrData.splice(arrData.length, 0, {});
            arrData.splice(arrData.length - 1, 1);
        })
    })
}
/**
 * S3获取文件路径
 * @param {date} date 时间对象
 * @param {string} fmt 时间格式
 */
export function dateFormat(date, fmt) {
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
    };
    let fmtTemp;
    if (/(y+)/.test(fmt)) fmtTemp = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmtTemp)) {
            fmtTemp = fmtTemp.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
        }
    }
    return fmtTemp;
}
// 浮点型加法函数
export function accAdd(arg1, arg2) {
    let r1, r2, argTemp1, argTemp2;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    const c = Math.abs(r1 - r2);
    const m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        const cm = Math.pow(10, c);
        if (r1 > r2) {
            argTemp1 = Number(arg1.toString().replace('.', ''));
            argTemp2 = Number(arg2.toString().replace('.', '')) * cm;
        } else {
            argTemp1 = Number(arg1.toString().replace('.', '')) * cm;
            argTemp2 = Number(arg2.toString().replace('.', ''));
        }
    } else {
        argTemp1 = Number(arg1.toString().replace('.', ''));
        argTemp2 = Number(arg2.toString().replace('.', ''));
    }
    return (argTemp1 + argTemp2) / m;
}
// 浮点型乘法
export function accMul(arg1, arg2) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
        m += s1.split('.')[1].length;
    } catch (e) {
        //
    }
    try {
        m += s2.split('.')[1].length;
    } catch (e) {
        //
    }
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}
// 浮点型减法
export function accSub(arg1, arg2) {
    let r1;
    let r2;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    const m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度
    const n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
// 浮点型除法函数
export function accDiv(arg1, arg2) {
    let t1 = 0;
    let t2 = 0;
    try {
        t1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        //
    }
    try {
        t2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        //
    }
    const r1 = Number(arg1.toString().replace('.', ''));
    const r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
// 深克隆
export function DeepClone(str) {
    return JSON.parse(JSON.stringify(str));
}
