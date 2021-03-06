import {qtRequest} from '../common';

export default {
    strict: true,
    namespaced: true,
    state: {
        activeQuote: {}
    },
    mutations: {
        updateActiveQuote: function(state, payload){
          state.activeQuote = payload;
        }
    },
    actions: {
      getQuote: async (context) => {
        let [qtRequestData, qtRequestError] = await qtRequest(context, "Failed to get quote!", {path: '/randomQt', method: 'GET'});

        if(!qtRequestError){
          context.commit('updateActiveQuote', qtRequestData.data.responseData);
        }
        
      },
      rateQuote: async (context, rateData) => {
        let [qtRequestData, qtRequestError] = await qtRequest(context, "Failed to get new quote!", {path: '/rateQt', method: 'POST', postData: rateData});

        if(!qtRequestError){
          context.commit('updateActiveQuote', qtRequestData.data.responseData);
        }
      }
    },
}