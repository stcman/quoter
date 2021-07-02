export default {
    strict: true,
    namespaced: true,
    state: {
        isLoading: false,
        showSnack: false,
        globalErrMsg: ""
    },
    mutations: {
        updateIsLoading: (state, payload) => {
            state.isLoading = payload;
        },
        updateShowSnack: function(state, payload){
            state.showSnack = payload;
        },
        updateGlobalErrMsg: function(state, payload){
            state.globalErrMsg = payload;
        }
    },
    actions: {
    },
}