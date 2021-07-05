import Vue from 'vue';
import Vuex from 'vuex';
import quotesModule from './modules/quotesModule';
import globalModule from './modules/globalModule';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {
  },
  actions: {
    
  },
  modules: {
    globalModule,
    quotesModule
  }
})
