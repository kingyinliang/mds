export default {
    namespaced: true,
    state: {
        packDetail: {},
        packCheckData: {},
        auditDetail: {},
        pickingDetail: {},
        auditDetailDetail: {},
        packageInfo: {}
    },
    mutations: {
        updatePackDetail(state, packDetail) {
            state.packDetail = packDetail;
        },
        updatePickingDetail(state, pickingDetail) {
            state.pickingDetail = pickingDetail;
        },
        updatePackCheckData(state, packCheckData) {
            state.packCheckData = packCheckData;
        },
        updateAuditDetail(state, auditDetail) {
            state.auditDetail = auditDetail;
        },
        updateAuditDetailDetail(state, auditDetail) {
            state.auditDetailDetail = auditDetail;
        },
        updatePackageInfo(state, packageInfo) {
            state.packageInfo = packageInfo;
        }
    }
};
