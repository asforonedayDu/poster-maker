import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'
import system from './modules/system'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {...getters},
  modules: {
    d2admin,
    system,
  }
})
