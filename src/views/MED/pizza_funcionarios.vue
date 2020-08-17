<template>
<div class="area-total" :class="{'background':zoomBtn}">
  <div class="grafico grafico1">
    <div class="center-align container loader" v-if="loading">
      <h5>Carregando dados</h5>
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
     <div class="area">
       <div class="cabecalho">
        {{titulo}}
        <btn classes="btn-zoom blue lighten-2" frase="" evento="zoom" modo="icone" icone="fas fa-search-plus" @zoom="zoom()" :show="zoomBtn" />
      </div>
     <e-chart :options="graph" autoresize></e-chart>
     </div>
  </div>
</div>
</template>

<script>
import btn from './botao.vue'


export default {
  data() {
    return {
      graph: {},
      loading: true,
      titulo: "Funcionarios x Setor",
      zoomBtn:true
    }
  },
  components:{
    btn
    },
  methods: {
      onZoom(){
      this.zoomBtn = false
    },
    onUnzoom(){
      this.zoomBtn = true
    },
    zoom(){
      this.$emit('zoom',this.onZoom,this.onUnzoom)
    },
      pegarStatus(obj){
          const dados = obj.status
          const resultado = {}
          dados.forEach(dado => {
              if(!resultado[dado]){
                  resultado[dado] = 1
              }
              else{
                  resultado[dado] += 1
              }
          })

          return resultado
      },
      pegarCores(cores){
          return cores.reduce((obj,atual) => {
              obj[atual.name] = atual.color
              return obj
          },{})
      },
      construirGrafico(dados,cores){
          const keys = Object.keys(dados)
          const data = []
          for(let sigla of keys){
              let obj = {
                  color: cores[sigla],
                  value: dados[sigla],
                  name: sigla
              }
              data.push(obj)
          }

        const options = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: keys
            },
            series: [
                {
                    name: 'Funcionários Hoje',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        return options
      }
  },
  mounted() {
    fetch("http://localhost:3000/hoje")
      .then((response) => response.json())
      .then((obj) => {
        const dados = this.pegarStatus(obj)
        fetch('http://localhost:3000/color')
        .then(response => {return response.json()})
        .then(cores => {
            const objCores = this.pegarCores(cores)
            this.graph = this.construirGrafico(dados,objCores)
            this.loading = false
        })
      })
  },
}
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.grafico {
  width: 100%;
  height: 100%;
  background: white;
}
.area-total{
  width: 100%;
  height: 100%;
}

.background{
    background: linear-gradient(
    180deg,
    rgba(6, 183, 227, 1) 9%,
    rgba(11, 221, 157, 1) 73%
  );
  padding: 2px;
}

.area{
  height: 100% !important;
  width: 100% !important;
  display: grid;
  grid-template-rows: 30px 1fr;
  grid-template-columns: 1fr;
}


.cabecalho{
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 2px;
  padding-left: 5px;
}
</style>