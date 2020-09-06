<template>
  <div id="MED" class="zoom-background" v-if="isLoaded">
    <graficoDiario @zoom="(zoom,unzoom) => {zoomActivator('diario',zoom,unzoom)}" id="diario" />
    <pizzaFuncionarios @zoom="(zoom,unzoom) => {zoomActivator('pizza-funcionarios',zoom,unzoom)}" id="pizza-funcionarios"/>
    <graficoPPU id="PPU"
    @zoom="(zoom,unzoom) => {zoomActivator('PPU',zoom,unzoom)}"
    />
    <graficoAcumulado
      @zoom="(zoom,unzoom) => {zoomActivator('acumulado',zoom,unzoom)}"
      id="acumulado"
    />
    <graficoHistorico
    :obj="obj"
      @zoom="(zoom,unzoom) => {zoomActivator('historico',zoom,unzoom)}"
      id="historico"
    />
    <graficoSetor :obj="obj" @zoom="(zoom,unzoom) => {zoomActivator('setor',zoom,unzoom)}" id="setor" />
    <div id="total">
      <totalContrato :obj="obj"/>
      <div></div>
      <totalFuncionarios :obj="obj"/>
    </div>
    <tabelaArea :obj="obj" id="tabela"/>
    <graficoAnual id="anual" :obj="obj" @zoom="(zoom,unzoom) => {zoomActivator('anual',zoom,unzoom)}" />
    <div class="zoom-full" v-show="zoom">
      <div id="cima" class="blur"></div>
      <div id="esquerda" class="blur"></div>
      <div id="direita" class="blur"></div>
      <div id="baixo" class="blur"></div>
      <div class="background">
        <div class="zoom">
          <div class="box" id="zoom-box">
            <div class="botoes">
              <a href="#" @click="undoZoom"><i class="fas fa-times pad-custom"></i></a>
            </div>
            <div id="zoom-area"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import graficoDiario from "./grafico_diario";
import graficoAcumulado from "./grafico_acumulado";
import graficoHistorico from "./grafico_historico";
import totalContrato from "./total_contrato";
import tabelaArea from "./tabela_area";
import graficoAnual from "./grafico_anual";
import totalFuncionarios from "./total_funcionarios";
import graficoSetor from "./grafico_setor";
import pizzaFuncionarios from './pizza_funcionarios';
import graficoPPU from './grafico_ppu';

export default {
  data() {
    return {
      zoom: false,
      saveMethod: {},
      obj: {},
      isLoaded: false
    }
  },
  components: {
    graficoDiario,
    graficoAcumulado,
    graficoHistorico,
    totalContrato,
    tabelaArea,
    graficoAnual,
    totalFuncionarios,
    graficoSetor,
    pizzaFuncionarios,
    graficoPPU
  },
  methods: {
    objDoMes(mes){
      let obj = {}
      for(let setor of mes){
        obj[setor.setor] = setor
      }

      return obj
    },
    somaArrays(arr1,arr2){
      return arr1.map((valor,index) => {
        return valor + arr2[index]
      })
    },
    somaGrupos(mes,grupo,nome){
      console.log('mes:', mes)
      let filtrado = mes.filter((obj) => {return grupo.includes(obj.setor)})
      //filtrado = Object.values(filtrado)
      const somado = {}
      somado.setor = nome
      somado.valor = filtrado.reduce((soma,setor) => {
        return this.somaArrays(soma,setor.valor)
      },filtrado[0].valor.map(() => { return 0}))
      somado.funcionarios = {}
      somado.funcionarios.total = filtrado.reduce((soma,setor) => {
        return soma + setor.funcionarios.total
      },0)

      somado.funcionarios.diario = filtrado.reduce((soma,setor) =>{
        return this.somaArrays(soma,setor.funcionarios.diario)
      },filtrado[0].funcionarios.diario.map(() => {return 0}))
      return somado
    },
    zoomActivator(id, zoom, unzoom) {
      if (this.zoom) {
        return;
      }
      this.zoom = true;
      const area = document.querySelector("#" + id)
      document.querySelector("#zoom-area").appendChild(area)
      this.saveMethod = unzoom
      console.log(zoom)
      zoom()
    },
    undoZoom() {
      const node = document.querySelector("#zoom-area").firstElementChild
      document.querySelector("#MED").appendChild(node)
      this.zoom = false
      this.saveMethod()
    },
  },
  mounted(){
      //this.$store.getters.link('grafico',this.$route.params)
      //const obj = this.obj
    fetch(this.$store.getters.link('historico',this.$route.params))
      .then((response) => response.json())
      .then((obj) => {
        fetch(this.$store.getters.link('grupo',this.$route.params))
          .then((response) => response.json())
          .then(grupos => {
            const historico = obj.data
            const total = []
            for(let mes of historico){
              let mesGrupo = []
              for(let grupo of Object.keys(grupos)){
                let agrupado = this.somaGrupos(mes,grupos[grupo],grupo)
                mesGrupo.push(agrupado)
              }
              total.push(mesGrupo)
            }

            obj.data = total
            this.obj = obj
            this.isLoaded = true
          })
        // this.obj = obj
        // this.isLoaded = true
      });
  }
};

//   #MED {
//     display: grid;
//     height: 100%;
//     grid-template-rows: 10px 200px 10px 460px 10px 460px 10px;
//     grid-template-columns: 10px 200px 10px 200px 10px 200px 10px 200px 10px;
//     grid-template-areas: 
//     "linha linha linha linha linha linha linha linha linha"
//     "nd1 totalContrato nd2 qtdeFuncionarios nd3 valorArea nd4 valorRetencao nd5"
//     "linha2 linha2 linha2 linha2 linha2 linha2 linha2 linha2 linha2"
//     "nd6 diario diario diario nd7 acumulado acumulado acumulado nd8"
//     "linha3 linha3 linha3 linha3 linha3 linha3 linha3 linha3 linha3"
//     "nd9 acumulado acumulado acumulado nd10 tabela tabela tabela nd11"
//     "linha4 linha4 linha4 linha4 linha4 linha4 linha4 linha4 linha4";
//     overflow: auto;
//   }



</script>

<style>

#MED {
  display: grid;
  height: 100vh;
  grid-template-rows: 2px 300px 10px 410px 10px 400px 10px;
  grid-template-columns: 30px 200px 10px 200px 10px 220px 10px 220px 10px 1fr 10px;
  grid-template-areas:
    "nada nada nada nada nada nada nada nada nada nada nada"
    "nd1 total nd2 pizzaFuncionarios nd5 PPU PPU PPU nf tabela nf2"
    "nada2 nada2 nada2 nada2 nada2 nada2 nada2 nada2 nada2 nada2 nada2"
    "espaco diario diario diario nd10 acumulado acumulado acumulado barra4 historico barra5"
    "nd3 nd3 nd3 nd3 nd3 nd3 nd3 nd3 nd3 nd3 nd3"
    "espaco2 anual anual anual barra2 setor setor setor setor setor barra6"
    "nd4 nd4 nd4 nd4 nd4 nd4 nd4 nd4 nd4 nd4 nd4";
  overflow: auto;
}
.background{
  background: white !important;
}


@media (max-width: 600px) {

}
.blur {
  background-color: rgba(121, 120, 120, 0.8);
  filter: blur(90%);
}

#cima {
  grid-area: cima;
}

#pizza-funcionarios{
  grid-area:pizzaFuncionarios
}

#esquerda {
  grid-area: esquerda;
}

#setor{
  grid-area:setor;
}

#PPU{
  grid-area:PPU;
}

#direita {
  grid-area: direita;
}

#baixo {
  grid-area: baixo;
}

#zoom-box {
  grid-area: zoomBox;
}

#diario {
  grid-area: diario;
}

#acumulado {
  grid-area: acumulado;
}

#historico {
  grid-area: historico;
}

#total {
  grid-area: total;
  display: grid;
  grid-template-rows:49% 5px 1fr;
  grid-template-columns:100%;
}

#tabela {
  grid-area: tabela;
}

#total-contrato{
    grid-area: totalContrato;
}

#total-funcionario{
    grid-area: totalFuncionario;
}
#anual {
  grid-area: anual;
}

#zoom-area {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.outer-ring {
  border-style: solid;
  border-radius: 10px;
  border-color: linear-gradient(
    180deg,
    rgba(6, 183, 227, 1) 9%,
    rgba(11, 221, 157, 1) 73%
  );
}

.background{
    width: 100%;
    height: 100%;
    background: linear-gradient(
    180deg,
    rgba(6, 183, 227, 1) 9%,
    rgba(11, 221, 157, 1) 73%
  );
  padding: 2px;
  margin: 0px;
}

.pad-custom{
  padding-right:3px;
}

.zoom-full {
  position: absolute;
  z-index: 2;
  display: grid;
  width: calc(100% - 50px);
  height: 100vh;
  grid-template-rows: 5vh 90vh 5vh;
  grid-template-columns: calc(5% - 20px) 90% 1fr;
  grid-template-areas:
    "cima cima cima"
    "esquerda zoomBox direita"
    "baixo baixo baixo";
}

.box {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 22px 1fr;
}

.zoom {
  height: 100%;
  width: 100%;
  background: whitesmoke;
}

.botoes {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}
</style>