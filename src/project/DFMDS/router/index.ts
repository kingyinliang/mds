import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router';
import { fnCurrentRouteType, fnAddDynamicMenuRoutes } from 'utils/utils'
import { COMMON_API } from 'common/api/api';

Vue.use(VueRouter);

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes: object[] = [];
const mainRoutes: object[] = [
    {
        path: '/',
        name: 'index',
        component: () => import('src/layout/main/main.vue'),
        children: [
            {
                path: '/OrgStructure',
                name: 'OrgStructure',
                component: () => import('common/pages/OrgStructure/index.vue'),
                meta: {
                    menuId: 1,
                    title: '组织架构',
                    isTab: true
                }
            }
        ]
    }
];

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
        factory: 'zzz'
    }).then(({ data }) => {
        console.log(data);
        fnAddDynamicMenuRoutes(data.menuList);
        router['options'].isAddDynamicMenuRoutes = true;
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'));
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'));
    })
});

export default router
