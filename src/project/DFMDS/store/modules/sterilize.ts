export default {
    namespaced: true,
    state: {
        Craft: {},
        Cooking: {}, // 煮料
        dissolveBucketDetail: {},
        SemiReceive: {},
        AcceAdd: {},
        auditDetail: {}
    },
    mutations: {
        updateAcceAdd(state, AcceAdd) {
            state.AcceAdd = AcceAdd;
        },
        updateSemiReceive(state, SemiReceive) {
            state.SemiReceive = SemiReceive;
        },
        updateCraft(state, Craft) {
            state.Craft = Craft;
        },
        updateCooking(state, Cooking) {
            state.Cooking = Cooking;
        },
        updateDissolveBucket(state, item) {
            state.dissolveBucketDetail = item;
        },
        updateAuditDetail(state, auditDetail) {
            state.auditDetail = auditDetail;
        }
    }
};
