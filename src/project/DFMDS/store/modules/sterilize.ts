export default {
    namespaced: true,
    state: {
        Craft: {}
    },
    mutations: {
        updateCraft(state, Craft) {
            state.Craft = Craft;
        }
    }
};
