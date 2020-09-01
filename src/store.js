import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    urls: {
      grafico: "/medicao/graficoNovoAPI.rule?sys=MDC&mes={{mes}}&contrato={{contrato}}", //validado
      periodo: "/medicao/periodoAPI.rule?sys=MDC&mes={{mes}}&contrato={{contrato}}", //validado
      hoje: "/medicao/statusHojeAPI.rule?sys=MDC&estab={{estab}}", //validado
      cor: "/medicao/colorAPI.rule?sys=MDC&estab={{estab}}", //validado
      historico: "/medicao/historicoAPI.rule?sys=MDC&contrato={{contrato}}" //validado
    }
  },
  mutations: {

  },

  getters: {
    link: (state) => (id, params) => {
      let link = state.urls[id]
      for(let key of Object.keys(params)){
          link = link.replace('{{' + key + '}}',params[key])
      }
      return link
    }
  
  },

  actions: {

  }
})