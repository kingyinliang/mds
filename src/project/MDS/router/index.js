import Vue from 'vue';
import Router from 'vue-router';
import { fnCurrentRouteType, AddRoutes } from 'utils/utils';
import { COMMON_API } from '../../../common/api/api';

Vue.use(Router);
/* eslint-disable @typescript-eslint/no-var-requires */
const importTarget = process.env.NODE_ENV !== 'local' ? file => () => import('@/views/' + file + '.vue') : file => require('@/views/' + file + '.vue').default;
const importWidet = process.env.NODE_ENV !== 'local' ? file => () => import('project/' + file + '.vue') : file => require('project/' + file + '.vue').default;
/* eslint-enable @typescript-eslint/no-var-requires */
// const importTarget = import('./import-' + process.env.NODE_ENV);
// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
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
const mainRoutes = {
    path: '/',
    component: () => import('src/layout/main/main.vue'),
    children: [
        { path: '/', redirect: '/home' },
        {
            path: '/home',
            component: () => import('src/project/MDS/views/common/home.vue'),
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

router.beforeEach((to, from, next) => {
    if (router['options']['isAddDynamicMenuRoutes'] || fnCurrentRouteType(to, globalRoutes) === 'global') {
        return next();
    }
    COMMON_API.NAV_API({
        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
    }).then(({ data }) => {
        if (data && data.code === 200) {
            const AddRoutesClass = new AddRoutes(router, mainRoutes, []);
            AddRoutesClass.fnAddDynamicMenuRoutes(data.data.menuList, []);
            router['options']['isAddDynamicMenuRoutes'] = true;
            sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'));
            sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'));
            return next(Object.assign({}, to, { replace: true }));
        }
        sessionStorage.setItem('menuList', '[]');
        sessionStorage.setItem('permissions', '[]');
        return next();
    });
});

export default router;
