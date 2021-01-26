import Vue from 'vue';
import VueRouter, { RouteConfig, RouterOptions } from 'vue-router';
import { AddRoutes, fnCurrentRouteType } from 'utils/utils';
import { COMMON_API } from 'common/api/api';

Vue.use(VueRouter);

const globalRoutes: object[] = [];
const mainRoutes: RouteConfig = {
    path: '/',
    name: 'index',
    component: () => import('src/layout/main/board/board_main.vue'),
    children: []
}

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    isAddDynamicMenuRoutes: false,
    routes: globalRoutes.concat(mainRoutes)
} as RouterOptions);

router.beforeEach((to, from, next) => {
    if (router['options']['isAddDynamicMenuRoutes'] || fnCurrentRouteType(to, globalRoutes) === 'global') {
        return next();
    }
    COMMON_API.NAV_API({
        factory: 'mds_board'
    }).then(({ data }) => {
        if (data && data.code === 200) {
            const AddRoutesClass = new AddRoutes(router, mainRoutes, []);
            AddRoutesClass.fnAddDynamicMenuRoutes(data.data.menuList, []);
            router['options']['isAddDynamicMenuRoutes'] = true;
            sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'));
            sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'));
            return next(Object.assign({}, to, { replace: true }) as object);
        }
        sessionStorage.setItem('menuList', '[]');
        sessionStorage.setItem('permissions', '[]');
        return next();
    });
});

export default router;
