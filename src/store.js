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
      //historico: "/medicao/historicoAPI.rule?sys=MDC&contrato={{contrato}}" //validado
      historico: "/medicao/historicoCacheAPI.rule?sys=MDC&contrato={{contrato}}",
      grupo: "/medicao/gruposAPI.rule?sys=MDC&contrato={{contrato}}",
      PPU: "/medicao/ppuTotalAPI.rule?sys=MDC&contrato={{contrato}}"
    }
    /*urls: {
      grafico: "http://localhost:3000/grafico_medicao",
      periodo: "http://localhost:3000/periodo",
      hoje: "http://localhost:3000/hoje",
      cor: "http://localhost:3000/color",
      historico: "http://localhost:3000/historico",
      grupo: "http://localhost:3000/grupos",
      PPU: "http://localhost:3000/PPU"
    }*/
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