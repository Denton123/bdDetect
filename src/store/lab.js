import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // projectPrice: 0,
    // projectName: '',
    detectionStep: 0,
    detectionStep2ItemClicked: false,
    pageSize: 10,
    loginRedirect: 0,
    // item: {
    //   id: '',
    //   amount: 0,
    //   name: '',
    // },
  },
  mutations: {
    setLoginRedirect(state, payload) {
      state.loginRedirect = payload
    },
    setDetectionStep(state, payload) {
      state.detectionStep = payload
    },
    setDetectionStep2ItemClicked(state, payload) {
      state.detectionStep2ItemClicked = payload
    }
  },
  actions: {

  },
  modules: {
    i18n: vuexI18n.store
  }
})
