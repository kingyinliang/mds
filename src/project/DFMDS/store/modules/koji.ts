export default {
    namespaced: true,
    state: {
        // 大豆库存当前详情所属车间库位信息
        StockSoybeanInfo: {},
        // 麦粉库存当前详情所属车间库位信息
        StockFlourInfo: {},
        // Y158库存当前详情所属车间库位信息
        StockY158Info: {}
    },
    mutations: {
        updateStockSoybeanInfo(state, infoObj) {
            state.StockSoybeanInfo = infoObj;
        },
        updateStockFlourInfo(state, infoObj) {
            state.StockFlourInfo = infoObj;
        },
        updateStockY158Info(state, infoObj) {
            state.StockY158Info = infoObj;
        }
    }
};
