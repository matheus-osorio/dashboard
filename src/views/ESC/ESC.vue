<template>
  <div id="ESC" v-if="isLoaded">
    <graficoSetores @zoom="(zoom,unzoom) => {zoomActivator('grafico-setores',zoom,unzoom)}" id="grafico-setores"/>
    <tabelaMedias :funcionarios='funcionarios'  id="tabela-medias"/>
    <tabelaPorcentagem :funcionarios='funcionarios' id="tabela-porcentagem"/>
    <graficoFuncao :funcionarios='funcionarios' @zoom="(zoom,unzoom) => {zoomActivator('grafico-funcao',zoom,unzoom)}" id="grafico-funcao"/>
    <graficoSinistro @zoom="(zoom,unzoom) => {zoomActivator('grafico-sinistro',zoom,unzoom)}" id="grafico-sinistro"/>
    
    <div id="subdivisao">
      <totalValidos @zoom="(zoom,unzoom) => {zoomActivator('quadro1',zoom,unzoom)}" id="quadro1"/>
      <totalSinistro id="quadro2"/>
      <totalRotatividade id="rotatividade" :total="numeroTotal" :funcionarios="funcionarios"/>
      <totalAbsenteismo id="absenteismo" :funcionarios="funcionarios"/>
      <aniversarioMes :funcionarios="funcionarios" id="aniversario"/>
    </div>
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

import graficoSetores from './grafico_setores'
import tabelaMedias from './tabela_medias'
import tabelaPorcentagem  from './tabela_porcentagem'
import graficoFuncao from './grafico_funcao'
import graficoSinistro from './grafico_sinistro'
import totalValidos from './total_validos'
import totalSinistro from './total_sinistro'
import aniversarioMes from './tabela_aniversariante'
import totalRotatividade from './total_rotatividade.vue'
import totalAbsenteismo from './total_absenteismo'

export default {
  data(){
    return{
      zoom:false,
      saveMethod: undefined,
      funcionarios: {},
      isLoaded: false,
      numeroTotal: 0
    }
  },
  components:{
    graficoSetores,
    tabelaMedias,
    tabelaPorcentagem,
    graficoFuncao,
    graficoSinistro,
    totalValidos,
    totalSinistro,
    aniversarioMes,
    totalRotatividade,
    totalAbsenteismo 
  },
  methods:{
    zoomActivator(id, zoom, unzoom) {
      if (this.zoom) {
        return;
      }
      this.zoom = true;
      const area = document.querySelector("#" + id)
      document.querySelector("#zoom-area").appendChild(area)
      this.saveMethod = unzoom
      zoom()
    },
    undoZoom() {
      const node = document.querySelector("#zoom-area").firstElementChild
      document.querySelector("#ESC").appendChild(node)
      this.zoom = false
      this.saveMethod()
    },
  },
  
  mounted(){
    fetch(this.$store.getters.link('escala',this.$route.params))
    .then((response) => response.json())
    .then(funcionarios => {
      this.numeroTotal = funcionarios.length
      funcionarios = funcionarios.filter((f) => f.setor != '')
      fetch(this.$store.getters.link('grupo',this.$route.params))
      .then(response => response.json())
      .then(grupos => {

        const chaves = Object.keys(grupos)
        for(let chave of chaves){
          funcionarios = funcionarios.map((obj) => {
            if(grupos[chave].grupo.includes(obj.setor)){
              obj.setor = chave
            }
            return obj
          })
        }
        this.funcionarios = funcionarios
        this.isLoaded = true
      })
    })
  }
}
</script>

<style>
#ESC{
  display: grid;
  height: 100vh;
  /* overflow: auto; */
  grid-template-rows: 10px calc(50% - 15px) 10px calc(50% - 15px) 10px;
  grid-template-columns: 10px 1fr 10px 1fr 10px 1fr 10px; /*7 itens*/
  grid-template-areas: 
  "nada nada nada nada nada nada nada"
  "nada2 tabelaMedias nada3 graficoSinistro nada4 tabelaPorcentagem nada5"
  "linha2 linha2 linha2 linha2 linha2 linha2 linha2"
  "nada6 graficoFuncao nada0 subdivisao nada7 graficoSetores nada8"
  "tst tst tst tst tst tst tst"
  ;
}

@media(max-width: 1200px){
  #ESC{
  display: grid;
  height: 100%;
  /* overflow: auto; */
  grid-template-rows: 10px 320px 10px 320px 10px 320px; /*6 itens*/
  grid-template-columns: 10px 1fr 10px 1fr 10px; /*5 itens*/
  grid-template-areas: 
  "nada nada nada nada nada"
  "nada2 tabelaMedias nada3 graficoSinistro nada4"
  "espaco espaco espaco espaco espaco"
  "nada5 graficoFuncao nada6 tabelaPorcentagem nada7"
  "espaco2 espaco2 espaco2 espaco2 espaco2"
  "nada8 graficoSetores nada9 subdivisao nada10"
  ;
}
}

@media(max-width: 600px){
  #ESC{
  display: grid;
  height: 1980px;
  /* overflow: auto; */
  grid-template-rows: 10px 320px 10px 320px 10px 320px 10px 320px 10px 320px 10px 320px ; /*12 itens*/
  grid-template-columns: 1fr; 
  grid-template-areas: 
  "nada "
  "subdivisao"
  "nada2"
  "graficoFuncao"
  "nada3"
  "tabelaMedias"
  "nada4"
  "graficoSetores"
  "nada5"
  "tabelaPorcentagem"
  "nada6"
  "graficoSinistro"
  ;
}
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

#zoom-area {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#cima {
  grid-area: cima;
}

#grafico-setores{
  grid-area:graficoSetores
}

#grafico-funcao{
  grid-area: graficoFuncao;
  page-break-after: always;
}

#tabela-medias{
  grid-area: tabelaMedias;
}

#tabela-porcentagem{
  grid-area: tabelaPorcentagem;
  page-break-after: always;
}

#grafico-sinistro{
  grid-area: graficoSinistro
}

#subdivisao{
  grid-area: subdivisao;
  display: grid;
  height: 100%;
  grid-template-rows: 1fr 10px 1fr 10px 1fr;
  grid-template-columns: 1fr 10px 1fr;
  grid-template-areas: 
  "quadro1 coluna quadro2"
  "nada nada nada"
  "rotatividade nada2 aniversario"
  "nada3 nada2 aniversario"
  "absenteismo nada2 aniversario";
}

#absenteismo{
  grid-area:absenteismo;
}

#rotatividade{
  grid-area: rotatividade;
}

#quadro1{
  grid-area: quadro1;
}

#quadro2{
  grid-area: quadro2;
}

#aniversario{
  grid-area: aniversario;
}

#esquerda {
  grid-area: esquerda;
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

.background{
  background: white !important;
}


.print-page #ESC{
  display: grid;
  height: 100%;
  /* overflow: auto; */
  grid-template-rows: 10px 320px 10px 320px 100px 320px 400px; /*6 itens*/
  grid-template-columns: 10px 1fr 10px 1fr 10px; /*5 itens*/
  grid-template-areas: 
  "nada nada nada nada nada"
  "nada2 tabelaMedias nada3 graficoSinistro nada4"
  "espaco espaco espaco espaco espaco"
  "nada5 graficoFuncao nada6 tabelaPorcentagem nada7"
  "espaco2 espaco2 espaco2 espaco2 espaco2"
  "nada8 graficoSetores nada9 subdivisao nada10"
  "nada8 nada11 nada11 subdivisao nada10"
  ;
}
</style>