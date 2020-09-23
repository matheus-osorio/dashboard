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
        criarGrafico(valores,mes){
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

        options.xAxis = {
           data: mes
        }

        options.yAxis = {
           min: 0,
           interval:10
        }

        const media = valores.reduce((soma,atual) => {
            return soma + atual
        })/valores.length

        options.series = [
            {
              name: 'sinistralidade',
              type: 'line',
              areaStyle: {},
              data: valores
           },
           {
              name: 'média',
              type: 'line',
              data: valores.map(() => media.toFixed(2))
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
                const valores = sinistro.map(obj => obj.valor)
                const meses = sinistro.map(obj => obj.mes)
                this.graph = this.criarGrafico(valores,meses)
                this.loading = false
            })
        }
}
</script>

<style>

</style>