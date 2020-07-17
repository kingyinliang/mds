export default {
    namespaced: true,
    state: {
        Craft: {},
        Cooking: {}, // 煮料
        dissolveBucketDetail: {}
    },
    mutations: {
        updateCraft(state, Craft) {
            state.Craft = Craft;
        },
        updateCooking(state, Cooking) {
            state.Cooking = Cooking;
        },
        updateDissolveBucket(state, item) {
            state.dissolveBucketDetail = item;
        }
    }
};
