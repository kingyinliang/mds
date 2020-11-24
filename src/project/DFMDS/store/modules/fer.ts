/**
 * 发酵
 */
export default {
    namespaced: true,
    state: {
        // 盐水发料发酵罐讯息
        brineInfo: {}
    },
    mutations: {
        updateBrineInfo(state, infoObj) {
            state.brineInfo = infoObj;
        }
    }
};
