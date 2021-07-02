import {qtRequest} from './common';

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
            let [data, error] = await qtRequest(context, "Failed to get quote!", {path: '/randomQt', method: 'GET'});
      
            if(!error){
              let newState = JSON.parse(JSON.stringify(data.data.responseData));
              context.commit('updateActiveQuote', newState);
            }
            
          },
          rateQuote: async (context, rateData) => {
            let [data, error] = await qtRequest(context, "Failed to get new quote!", {path: '/rateQt', method: 'POST', postData: rateData});
      
            if(!error){
              console.log(data, 'storeVal');
            }
      
          }
    },
}