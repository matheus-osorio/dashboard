<template>
<div class="area-total tamanho" :class="{'background':zoomBtn}">
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
          return cores.reduce((obj,cor) => {
            obj[cor.name] = cor
            return obj
          },{})
      },
      construirGrafico(dados,cores){
         const options = {}
         options.legend = {
           type: 'scroll',
           data: Object.values(cores).map((obj) => {
             return obj.fullName
           })
         }
         options.legend.data.push('Total')
         options.tooltip = {
           trigger: 'item',
           axisPointer: {
            type: 'shadow'
        }
         }

         options.xAxis = {
           data:['']
         }

         options.yAxis = {
           splitNumber: 10
         }
         const chaves = Object.keys(dados)
         const series = chaves.reduce((arr, tag) => {
           const obj = {
              name: cores[tag].fullName,
              type: 'bar',
              data: [dados[tag]]
           }
           arr.push(obj)
           return arr
         },[])
          series.push({
            name:'Total',
            type:'bar',
            data: [Object.values(dados).reduce((total,valor) => {
              return total + valor
            })]
          })
         options.series = series

         return options
      }
  },
  mounted() {
    fetch(this.$store.getters.link('hoje',this.$route.params))
      .then((response) => response.json())
      .then((obj) => {
        const dados = this.pegarStatus(obj)
        fetch(this.$store.getters.link('cor',this.$route.params))
        .then(response => {return response.json()})
        .then(cores => {
            this.graph = this.construirGrafico(dados,this.pegarCores(cores))
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
.tamanho{
  height:100%
}
</style>