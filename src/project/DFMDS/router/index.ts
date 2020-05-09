import Vue from 'vue';
import VueRouter, { RouteConfig, RouterOptions } from 'vue-router';
import { fnCurrentRouteType, AddRoutes } from 'utils/utils';
import { COMMON_API } from 'common/api/api';

const importTarget = process.env.NODE_ENV !== 'local' ? file => () => import('project/' + file + '.vue') : file => require('project/' + file + '.vue').default;

Vue.use(VueRouter);

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes: object[] = [];
const mainRoutes: RouteConfig = {
    path: '/',
    name: 'index',
    component: () => import('src/layout/main/main.vue'),
    children: [
        { path: '/', redirect: '/home' },
        {
            path: '/home',
            component: importTarget('MDS/views/common/home'),
            name: 'home',
            meta: { title: '首页' }
        },
        {
            path: '/404',
            component: importTarget('COMMON/404'),
            name: '404',
            meta: { title: '404' }
        },
        {
            path: '/500',
            component: importTarget('COMMON/500'),
            name: '500',
            meta: { title: '500' }
        },
        {
            path: '/ProIn',
            component: importTarget('COMMON/Audit/ProInStore'),
            name: 'ProIn',
            meta: {
                menuId: 2,
                title: 'ProIn',
                isTab: true
            }
        },
        {
            path: '/org',
            component: importTarget('COMMON/BasicData/OrgStructure/index'),
            name: 'org',
            meta: {
                menuId: 1,
                title: 'org',
                isTab: true
            }
        },
        {
            path: '/Location',
            component: importTarget('COMMON/BasicData/Location/index'),
            name: 'Location',
            meta: { title: 'Location' }
        },
        {
            path: '/ProIssue',
            component: importTarget('COMMON/Audit/ProIssue/index'),
            name: 'ProIssue',
            meta: { title: 'ProIssue' }
        }
    ],
    beforeEnter(to, from, next) {
        const token = Vue['cookie'].get('token');
        if (!token || !/\S/.test(token)) {
            window.location.href = `${process.env.VUE_APP_HOST}`;
        }
        next();
    }
};

const router = new VueRouter({
    // mode: 'history',
    mode: 'hash',
    base: process.env.BASE_URL,
    isAddDynamicMenuRoutes: false,
    routes: globalRoutes.concat(mainRoutes)
} as RouterOptions);

router.beforeEach((to, from, next) => {
    if (router['options'].isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
        return next();
    }
    COMMON_API.NAV_API({
        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
    }).then(({ data }) => {
        if (data && data.code === 200) {
            const AddRoutesClass = new AddRoutes(router, mainRoutes, []);
            AddRoutesClass.fnAddDynamicMenuRoutes(data.data.menuList, []);
            router['options'].isAddDynamicMenuRoutes = true;
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
