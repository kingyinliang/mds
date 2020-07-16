export default {
    namespaced: true,
    state: {
        Craft: {},
        SemiReceive: {},
        AcceAdd: {},
        Cooking: {} // 煮料
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
        }
    }
};
