import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import common from './modules/common';
import user from './modules/user';
import packaging from './modules/packaging';
import sterilize from './modules/sterilize';
import koji from './modules/koji';
import fer from './modules/fer';
import stock from './modules/stock';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage
});
export default new Vuex.Store({
    modules: {
        common,
        user,
        packaging,
        sterilize,
        koji,
        fer,
        stock
    },
    plugins: [vuexLocal.plugin]
});
