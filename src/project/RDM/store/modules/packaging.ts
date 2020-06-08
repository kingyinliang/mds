export default {
    namespaced: true,
    state: {
        packDetail: {},
        packCheckData: {}
    },
    mutations: {
        updatePackDetail(state, packDetail) {
            state.packDetail = packDetail;
        },
        updatePackCheckData(state, packCheckData) {
            state.packCheckData = packCheckData;
        }
    }
};
