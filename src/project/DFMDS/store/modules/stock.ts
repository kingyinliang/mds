/**
 * 发酵
 */
 export default {
    namespaced: true,
    state: {
        stockInfo: {}
    },
    mutations: {
        updateStockInfo(state, infoObj) {
            state.stockInfo = infoObj;
        }
    }
}
