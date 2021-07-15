/*
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-06-21 15:24:30
 * @LastEditors: Telliex
 * @LastEditTime: 2021-07-15 11:41:39
 */
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import common from './modules/common';
import user from './modules/user';
import echarts from './modules/echarts';
import track from './modules/track';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
});
export default new Vuex.Store({
    modules: {
        common,
        user,
        echarts,
        track
    },
    plugins: [vuexLocal.plugin]
});
