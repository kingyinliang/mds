export default {
    namespaced: true,
    state: {
        Craft: {},
        Cooking: {} // 煮料
    },
    mutations: {
        updateCraft(state, Craft) {
            state.Craft = Craft;
        },
        updateCooking(state, Cooking) {
            state.Cooking = Cooking;
        }
    }
};
