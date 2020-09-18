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
    data(){
        return {
            loading: true,
            graph: {},
            titulo: "Gráfico Sinistralidade",
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
        criarGrafico(sinistro){
            const options = {}

            options.legend = {
                data: ['sinistralidade','média']
            }

            options.tooltip = {
           trigger: 'axis',
           axisPointer: {
            type: 'shadow'
           }
        }
        let mes = 1
        const xAxis = []
        while(xAxis.length < sinistro.length){
            xAxis.push(mes)
            mes++
        }

        options.xAxis = {
           data: xAxis
        }

        options.yAxis = {
           splitNumber: 10,
           max:100
        }

        const media = sinistro.reduce((soma,atual) => {
            return soma + atual
        })/sinistro.length

        options.series = [
            {
              name: 'sinistralidade',
              type: 'line',
              areaStyle: {},
              data: sinistro
           },
           {
              name: 'média',
              type: 'line',
              data: sinistro.map(() => media.toFixed(2))
           }
        ]

        return options
        }
    },
    mounted(){
            fetch(this.$store.getters.link('sinistro',this.$route.params))
            .then(response => response.json())
            .then(sinistro => {
                console.log('sinistro: ',sinistro)
                if(sinistro.length > 12){
                    sinistro = sinistro.slice(sinistro.length - 12)
                }

                this.graph = this.criarGrafico(sinistro)
                this.loading = false
            })
        }
}
</script>

<style>

</style>