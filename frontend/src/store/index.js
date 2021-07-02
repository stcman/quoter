import Vue from 'vue';
import Vuex from 'vuex';
import quotesModule from './quotesModule';
import globalModule from './globalModule';

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
