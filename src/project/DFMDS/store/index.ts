import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import common from './modules/common';
import user from './modules/user';
import packaging from './modules/packaging';
import sterilize from './modules/sterilize';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
});
export default new Vuex.Store({
    modules: {
        common,
        user,
        packaging,
        sterilize
    },
    plugins: [vuexLocal.plugin]
});
