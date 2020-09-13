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
        <div class="overflow-graph" :style="contados">
            <e-chart :options="graph" autoresize></e-chart>
        </div>
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
        titulo: "Itens PPU",
        zoomBtn:true,
        contados: {}
        }
    },
    components:{
        btn
    },
    methods:{
        onZoom() {
            this.zoomBtn = false;
        },
        onUnzoom() {
            this.zoomBtn = true;
        },
        zoom() {
            this.$emit("zoom", this.onZoom, this.onUnzoom);
        },
        criaGraph(obj){
            const option = {}
            option.legend = {
                data: Object.keys(obj),
                type: 'scroll'
            }

            option.yAxis = [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: ['']
                }
            ]

            option.xAxis = [
                {
                    type:'value',
                    min: 0,
                    max: 100,
                    splitNumber:5,
                    label:{
                        position: 'top',
                        rotate: 90
                    }
                }
            ]
            
            option.tooltip = {}

            option.series = Object.keys(obj).map((ppu) => {
                return {
                    name: ppu,
                    type: 'bar',
                    data: [parseFloat(obj[ppu].atual*100/obj[ppu].total).toFixed(2)],
                    label:{
                        show: true,
                        position: 'right',
                        formatter: '{c}% - {a}'
                    }
                }
            })
            return option
        }
    },
    mounted(){
        fetch(this.$store.getters.link('PPU',this.$route.params))
        .then((resp) => resp.json())
        .then(obj => {
            this.contados = {
                height: Object.values(obj).length*50 + 'px'
            }
            this.graph = this.criaGraph(obj)




            this.loading = false
        })
    }
}
</script>

<style>
.grafico {
  width: 100%;
  height: 100%;
  background: white;
  margin: 0 auto;
}

.area-total {
  width: 100%;
  height: 100%;
}

.overflow-graph{
    width: 100%;
    overflow: hidden;
}


.background {
  background: linear-gradient(
    180deg,
    rgba(6, 183, 227, 1) 9%,
    rgba(11, 221, 157, 1) 73%
  );
  padding: 2px;
}

.area {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 30px 1fr;
  overflow: auto;
}

.echarts {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 2px;
  padding-left: 5px;
}

canvas {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>