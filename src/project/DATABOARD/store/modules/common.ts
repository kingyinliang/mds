export default {
    namespaced: true,
    state: {
        menuActiveName: '',
        menuList: [],
        dynamicMenuRoutes: []
    },
    mutations: {
        updateMenuActiveName(state, name) {
            state.menuActiveName = name;
        },
        updateMenuList(state, list) {
            state.menuList = list;
        },
        updateDynamicMenuRoutes(state, list) {
            state.dynamicMenuRoutes = list;
        }
    }
};
