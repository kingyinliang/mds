/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-06-21 15:24:30
 * @LastEditors: Telliex
 * @LastEditTime: 2021-07-15 11:38:17
 */
/**
 * 物料追溯
 */


export default {
    namespaced: true,
    state: {
        searchInfo: {}
    },
    mutations: {
        updateSearchInfo(state, infoObj) {
            state.searchInfo = infoObj;
        }
    }
};
