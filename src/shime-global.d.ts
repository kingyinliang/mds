import VueRouter, { Route } from 'vue-router';

declare module 'vue/types/vue' {
    interface Vue {
        $router: VueRouter;
        $route: Route;
        $http: Function;
        isAuth: Function;
        $: any;// eslint-disable-line
        $warningToast: Function;
        $errorToast: Function;
        $successToast: Function;
    }
}
