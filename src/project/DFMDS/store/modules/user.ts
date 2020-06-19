export default {
    namespaced: true,
    state: {
        id: 0,
        name: '',
        realName: '',
        gender: 'M'
    },
    mutations: {
        updateId(state, id) {
            state.id = id;
        },
        updateName(state, name) {
            state.name = name;
        },
        updateGender(state, gender) {
            state.gender = gender;
        },
        updaterealName(state, realName) {
            state.realName = realName;
        }
    }
};
