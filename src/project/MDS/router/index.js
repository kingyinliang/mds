import Vue from 'vue';
import Router from 'vue-router';
import httpProxy from '@/net/httpProxy';
import { MAIN_API } from '@/api/api';
import { isURL } from '@/net/validate';

Vue.use(Router);
/* eslint-disable @typescript-eslint/no-var-requires */
const importTarget = process.env.NODE_ENV !== 'local' ? file => () => import('@/views/' + file + '.vue') : file => require('@/views/' + file + '.vue').default;
const importWidet = process.env.NODE_ENV !== 'local' ? file => () => import('project/' + file + '.vue') : file => require('project/' + file + '.vue').default;
/* eslint-enable @typescript-eslint/no-var-requires */
// const importTarget = import('./import-' + process.env.NODE_ENV);
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
    // {
    //     path: '/login',
    //     component: importTarget('common/login'),
    //     name: 'login',
    //     meta: { title: '登录' }
    // },
    {
        path: '/echarts',
        component: importTarget('common/demo-echarts'),
        name: 'echarts',
        meta: { title: 'echarts' }
    },
    {
        path: '/lookEcharts',
        component: importTarget('common/LookEcharts'),
        name: 'lookEcharts',
        meta: { title: 'lookEcharts' }
    }
];

// 主入口路由(需嵌套上左右整体布局)
const ssroutes = [];
const mainRoutes = {
    path: '/',
    component: importTarget('main'),
    children: [
        { path: '/', redirect: '/home' },
        {
            path: '/home',
            component: importWidet('COMMON/home'),
            name: 'home',
            meta: { title: '首页' }
        },
        {
            path: '/404',
            component: importWidet('COMMON/404'),
            name: '404',
            meta: { title: '404' }
        },
        {
            path: '/500',
            component: importWidet('COMMON/500'),
            name: '500',
            meta: { title: '500' }
        }
    ],
    beforeEnter(to, from, next) {
        const token = Vue.cookie.get('token');
        // let menuList = Vue.$store.state.common.menuList
        // console.log(menuList)
        // if (to.meta.title) document.title = to.meta.title
        if (!token || !/\S/.test(token)) {
            window.location.href = `${process.env.VUE_APP_HOST}`;
        }
        next();
    }
};
// 看板路由
const DataEchartsRoutes = {
    path: '/DataEcharts',
    component: importTarget('page/DataEcharts/Layout/index'),
    children: [],
    beforeEnter(to, from, next) {
        const token = Vue.cookie.get('token');
        if (!token || !/\S/.test(token)) {
            window.location.href = `${process.env.VUE_APP_HOST}`;
        }
        next();
    }
};

const router = new Router({
    // mode: 'history',
    mode: 'hash',
    isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
    routes: globalRoutes.concat(mainRoutes).concat(DataEchartsRoutes)
});

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = [], EchartsRoutes = []) {
    let temp = [];
    for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].type === '0' && menuList[i].url && /\S/.test(menuList[i].url)) {
            const route0 = {
                path: menuList[i].url.replace(/\//g, '-'),
                component: null,
                name: menuList[i].url.replace(/\//g, '-'),
                meta: {
                    menuId: menuList[i].menuId,
                    title: menuList[i].name,
                    isDynamic: true,
                    isTab: true,
                    iframeUrl: ''
                }
            };
            route0['component'] = importTarget(`page/${menuList[i].url}`) || null;
            routes.push(route0);
            ssroutes.push(route0);
        }
        if (menuList[i].type === '4' && menuList[i].url && /\S/.test(menuList[i].url)) {
            menuList[i].url = menuList[i].url.replace(/^\//, '');
            const EchartsRoute = {
                path: `/DataEcharts/${menuList[i].url.slice(12).replace(/\//g, '-')}`,
                component: importTarget(`page/${menuList[i].url}`),
                name: menuList[i].url.replace(/\//g, '-'),
                meta: {
                    menuId: menuList[i].menuId,
                    title: menuList[i].name,
                    isDynamic: true,
                    isTab: true,
                    iframeUrl: ''
                }
            };
            EchartsRoutes.push(EchartsRoute);
            ssroutes.push(EchartsRoute);
        }
        if (menuList[i].list && menuList[i].list.length >= 1) {
            temp = temp.concat(menuList[i].list);
        } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
            if (menuList[i].remark) {
                const router2 = {
                    path: menuList[i].remark.replace(/\//g, '-'),
                    component: null,
                    name: menuList[i].remark.replace(/\//g, '-'),
                    meta: {
                        menuId: menuList[i].menuId,
                        title: menuList[i].name,
                        isDynamic: true,
                        isTab: true
                    }
                };
                router2['component'] = importTarget(`page/${menuList[i].remark}`) || null;
                routes.push(router2);
                ssroutes.push(router2);
            }
            menuList[i].url = menuList[i].url.replace(/^\//, '');
            const route = {
                path: menuList[i].url.replace(/\//g, '-'),
                component: null,
                name: menuList[i].url.replace(/\//g, '-'),
                meta: {
                    menuId: menuList[i].menuId,
                    title: menuList[i].name,
                    isDynamic: true,
                    isTab: true,
                    iframeUrl: ''
                }
            };
            // url以http[s]://开头, 通过iframe展示
            if (isURL(menuList[i].url)) {
                route['path'] = `i-${menuList[i].menuId}`;
                route['name'] = `i-${menuList[i].menuId}`;
                route['meta']['iframeUrl'] = menuList[i].url;
            } else {
                try {
                    route['component'] = importTarget(`page/${menuList[i].url}`) || null;
                } catch (e) {
                    //
                }
            }
            routes.push(route);
            ssroutes.push(route);
        }
    }
    if (temp.length >= 1) {
        fnAddDynamicMenuRoutes(temp, routes, EchartsRoutes);
    } else {
        mainRoutes.name = 'main-dynamic';
        mainRoutes.children = routes;
        DataEchartsRoutes.children = EchartsRoutes;
        router.addRoutes([mainRoutes, DataEchartsRoutes, { path: '*', redirect: { path: '/404' } }]);
        sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(ssroutes || '[]'));
        console.log('\n');
        console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue');
        console.log(mainRoutes.children);
        console.log(DataEchartsRoutes.children);
        console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue');
    }
}

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route) {
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

router.beforeEach((to, from, next) => {
    // 添加动态(菜单)路由
    // 1. 已经添加 or 全局路由, 直接访问
    // 2. 获取菜单列表, 添加并保存本地存储
    if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to) === 'global') {
        return next();
    }
    httpProxy(`${MAIN_API.NAV_API}`, 'GET', {})
        .then(({ data }) => {
            if (data && data.code === 0) {
                fnAddDynamicMenuRoutes(data.menuList);
                router.options.isAddDynamicMenuRoutes = true;
                sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'));
                sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'));

                return next({ ...to, replace: true });
            }
            sessionStorage.setItem('menuList', '[]');
            sessionStorage.setItem('permissions', '[]');
            return next();
        })
        .catch(error => {
            console.log(error);
        });
});

export default router;
