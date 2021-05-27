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
}
