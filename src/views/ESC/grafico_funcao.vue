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
    props:['funcionarios'],
    data(){
        return {
            titulo: 'Gráfico Função',
            graph: {},
            zoomBtn: true
        }
    },
    components:{
    btn
    },
    methods:{
        onZoom(){
          this.zoomBtn = false
        },
        onUnzoom(){
          this.zoomBtn = true
        },
        zoom(){
          this.$emit('zoom',this.onZoom,this.onUnzoom)
        },
        criarGrafico(funcoes){
           const options = {}
           options.legend = {
           type: 'scroll',
           data: funcoes
            }

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

            const series = funcoes.map(funcao => {
                return {
                    name: funcao,
                    type: 'bar',
                    data: [this.funcionarios.filter(obj => {return obj.job == funcao}).length]
                }
            })


            options.series = series

            return options
        }
    },
    mounted(){
        let funcoes = this.funcionarios.map((obj) => obj.job)
        funcoes = Array.from(new Set(funcoes)).sort()
        console.log(funcoes)
        this.graph = this.criarGrafico(funcoes)
    }

}
</script>

<style>

.tamanho{
  height:100%
}
</style>