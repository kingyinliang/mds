/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-11-24 16:28:48
 * @LastEditors: Telliex
 * @LastEditTime: 2020-11-27 16:00:52
 */
/**
 * 发酵
 */
export default {
    namespaced: true,
    state: {
        // 盐水发料发酵罐讯息
        brineInfo: {},
        fermentBucketDetail: {},
        applyForObj: {}
    },
    mutations: {
        updateBrineInfo(state, infoObj) {
            state.brineInfo = infoObj;
        },
        updatefermentBucket(state, item) {
            state.fermentBucketDetail = item;
        },
        updateapplyForObj(state, item) {
            state.applyForObj = item;
        }
    }
};
