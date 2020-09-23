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
          {{titulo}} - {{atual}}
          <div class="caixa-icones">
            <btn
              classes="teal darken-2 btn-arrow borda"
              frase
              evento="anterior"
              modo="icone"
              icone="fas fa-arrow-left"
              :show="true"
              @anterior="trocarGrafico(-1)"
            />
            <btn
              classes="teal darken-2 btn-arrow borda"
              frase
              evento="proximo"
              modo="icone"
              icone="fas fa-arrow-right"
              :show="true"
              @proximo="trocarGrafico(1)"
            />
            <btn
              classes="btn-zoom blue lighten-2 borda"
              frase
              evento="zoom"
              modo="icone"
              icone="fas fa-search-plus"
              @zoom="zoom()"
              :show="zoomBtn"
            />
          </div>
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
      setores: [],
      index: 0,
      grupos: [],
      atual: '',
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
    juntarGrupo(obj,grupos){
      // console.log('obj:',obj)
      const chaves = Object.keys(grupos)
      const retorno = chaves.reduce((novo,chave) => {
        const arr = grupos[chave].grupo
        novo[chave] = arr.reduce((val, nome) => {
          if(obj[nome] != undefined){
            val = val.concat(obj[nome])
          }
          return val
        },[])
        return novo
      },{})
      return retorno
    }, 
    contagemEliminacao(arrSetor){
      const nomesFuncoes = arrSetor.map(setor => setor.funcao)
      const semRepeticoes = Array.from(new Set(nomesFuncoes))
      if(nomesFuncoes.length == semRepeticoes.length){
        return arrSetor
      }

      arrSetor  = semRepeticoes.map((funcao) => {
        const arr = arrSetor.filter((obj) => obj.funcao == funcao)
        console.log('arr:',arr)
        if(arr.length == 1){
          return arr[0]
        }
        let valor = arr[0]
        for(let i=1;i<arr.length;i++){
          valor.data = valor.data.concat(arr[i].data)
        }
        return valor
      })

      return arrSetor
    },

    eliminarRepetidos(obj){
      // console.log('repetidos:', obj)
      const setores = Object.keys(obj)

      setores.forEach(setor => {
        obj[setor] = this.contagemEliminacao(obj[setor])
      })

      return obj
    },

    pegarCores(cores){
      return cores.reduce((obj,cor) => {
        obj[cor.name] = cor
            return obj
        },{})
    },
    criaGraficoUnico(chave,grupo,cor){
      const options = {}
      let cores = grupo.reduce((arr,obj) => {
        return arr.concat(obj.data)
      },[])
      
      cores = Array.from(new Set(cores))
      
      //console.log("cores:",cores)

      options.legend = {
        data: cores.map(tag => {
          return cor[tag].fullName
        })
      }

      options.tooltip = {
        trigger: 'axis'
      }  
      options.xAxis = {
        interval: 0,
        type:'category',
        // axisLabel:{
        //   rotate:1
        // },
        data: grupo.map(obj => {return {value: obj.funcao,fontSize:5}})
      }

      options.yAxis = {
        min:0,
        splitNumber:10
      }

      let valores = grupo.map((funcao) => {
        return cores.map((tag) => {
          return funcao.data.filter((valor) => valor==tag).length 
        })
      })

      const resultado = []
      
      for(let i in valores[0]){
        let linha = []
        for(let j in valores){
          linha.push(valores[j][i])
        }
        resultado.push(linha)
      }

      const series = cores.map((tag,index) => {
        return {
          name: cor[tag].fullName,
          type:'bar',
          data: resultado[index]
        }
      })


      options.series = series
      console.log(JSON.stringify(options))
      return options
    },
    
    criarGraficos(grupo,cor){
      return Object.keys(grupo).reduce((arr,chave) => {
        if(grupo[chave].length > 0){
          arr.push(this.criaGraficoUnico(chave,grupo[chave],cor))
        }
        return arr
      },[])
    },

    trocarGrafico(numero){
      const tam = this.setores.length
      this.index = (this.index + numero)%tam
      this.atual = this.grupos[this.index]
      this.graph = this.setores[this.index]
    }
  },
  async mounted(){
    const obj = await fetch(this.$store.getters.link('hoje',this.$route.params)).then((response) => response.json())
    
    const color = await fetch(this.$store.getters.link('cor',this.$route.params)).then((response) => response.json())
    
    const grupos = await fetch(this.$store.getters.link('grupo',this.$route.params)).then((response) => response.json())
    
    const corObj = this.pegarCores(color)
    
    let grupoModificado = this.juntarGrupo(obj,grupos)
    grupoModificado = this.eliminarRepetidos(grupoModificado)

    this.setores = this.criarGraficos(grupoModificado,corObj)
    this.grupos = Object.keys(grupos)
    this.loading = false

    this.trocarGrafico(0)
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