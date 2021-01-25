import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import common from 'project/SYSTEM/store/modules/common';
import user from 'project/SYSTEM/store/modules/user';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
});
export default new Vuex.Store({
    modules: {
        common,
        user
    },
    plugins: [vuexLocal.plugin]
});
