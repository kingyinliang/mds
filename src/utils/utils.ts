// const importTarget = process.env.NODE_ENV !== 'local' ? file => () => import('' + file + '.vue') : file => require('' + file + '.vue').default

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
    url: string;
    type: string;
    menuId: string;
    name: string;
}
export function fnAddDynamicMenuRoutes(menuList: MenuList[] = [], routes = []) {
    const temp = [];
    for (let i = 0; i < menuList.length; i++) {
        //    循环
    }
    if (temp.length >= 1) {
        fnAddDynamicMenuRoutes(temp, routes);
    }
}
