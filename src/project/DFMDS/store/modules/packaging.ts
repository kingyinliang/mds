export default {
    namespaced: true,
    state: {
        packDetail: {},
        packCheckData: {},
        auditDetail: {}
    },
    mutations: {
        updatePackDetail(state, packDetail) {
            state.packDetail = packDetail;
        },
        updatePackCheckData(state, packCheckData) {
            state.packCheckData = packCheckData;
        },
        Audit(state, auditDetail) {
            state.auditDetail = auditDetail;
        }
    }
};
