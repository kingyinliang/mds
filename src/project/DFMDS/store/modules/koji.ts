/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-09-17 15:29:26
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-25 16:31:26
 */
export default {
    namespaced: true,
    state: {
        // 大豆库存当前详情所属车间库位信息
        StockSoybeanInfo: {},
        // 麦粉库存当前详情所属车间库位信息
        StockFlourInfo: {},
        // Y158库存当前详情所属车间库位信息
        StockY158Info: {},
        // 首頁发酵罐讯息
        orderKojiInfo: {},
        // 首頁泡豆罐讯息
        orderScInfo: {},
        // 页签状态
        houseTagInfo: {}
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
        },
        updateOrderKojiInfo(state, infoObj) {
            state.orderKojiInfo = infoObj;
        },
        updateOrderScInfo(state, infoObj) {
            state.orderScInfo = infoObj;
        },
        updateHouseTag(state, data) {
            state.houseTagInfo = data;
        }
    }
};
