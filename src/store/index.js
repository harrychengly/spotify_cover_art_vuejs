import Vuex from 'vuex'
import Vue from 'vue'

import actions from './actions'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

const home = {
  namespaced: true,
  actions,
  state,
  mutations
}

export default new Vuex.Store({
  modules: { home }
})