export default {
    namespaced: true,
    state: {
        packDetail: {},
        packCheckData: {},
        auditDetail: {},
        auditDetailDetail: {}
    },
    mutations: {
        updatePackDetail(state, packDetail) {
            state.packDetail = packDetail;
        },
        updatePackCheckData(state, packCheckData) {
            state.packCheckData = packCheckData;
        },
        updateAuditDetail(state, auditDetail) {
            state.auditDetail = auditDetail;
        },
        updateAuditDetailDetail(state, auditDetail) {
            state.auditDetailDetail = auditDetail;
        }
    }
};
