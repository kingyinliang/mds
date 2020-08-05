import VueRouter, { Route } from 'vue-router';

declare module 'vue/types/vue' {
    interface Vue {
        $router: VueRouter;
        $route: Route;
        $http: Function;
        isAuth: Function;
        getIndexMethod: Function;
        $: any; // eslint-disable-line
        $warningToast: Function;
        $errorToast: Function;
        $successToast: Function;
        $infoToast: Function;
    }
}

declare let WebSocket: {
    prototype: WebSocket;
    new (url: string, protocols?: string | string[]): WebSocket;
    readonly CLOSED: number;
    readonly CLOSING: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
};
