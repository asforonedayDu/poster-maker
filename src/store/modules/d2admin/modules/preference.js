import setting from '@/setting.js'

export default {
  namespaced: true,
  state: {
    showTabs: false,
    asideCollapse: false,
    pageTransition: false,
    asideTransition: false,
    showHeaderButtons: false,
    showHeaderMenus: setting.showAsideHeader,
    flat: false,
  },
  mutations: {
    setShowTabs: function ({state}, payload) {
      state.showTabs = payload
    },
    setAsideCollapse: function ({state}, payload) {
      state.asideCollapse = payload
    },
    setPageTransition: function ({state}, payload) {
      state.pageTransition = payload
    },
    setAsideTransition: function ({state}, payload) {
      state.asideTransition = payload
    },
    setFlat: function ({state}, payload) {
      state.flat = payload
    },
  }
}
