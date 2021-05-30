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
    props:['cargos','media','tipo','tooltip','smooth','loading'],
    data(){
        return {
            titulo: 'Gráfico Salário',
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
        tratarFunc(raw){
            
            raw = raw.map(func => { //coloca um valor pra representar o dia da cotnratação
                func.nadm = func.adm.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/,'$3$2$1')
                func.nadm = parseInt(func.nadm)
                return func
            })

            for(let i=0;i<raw.length;i++){
                for(let j=i+1;j<raw.length;j++){
                    if (raw[i].nadm > raw[j].nadm){
                        [raw[i],raw[j]] = [raw[j],raw[i]]
                    } 
                }
            }



            const repetidos = raw.map(func => {
                return func.historico.map((cargo) => {
                    cargo.nome = func.nome
                    cargo.setor = func.setor
                    cargo.adm = func.adm
                    cargo.desligamento = func.desligamento
                    return cargo
                })
            })

            return repetidos
        },
        criaAxisX(raw){
            const funcTratado = this.tratarFunc(raw) //funciona


            const diferencaDeDias = this.diferencaDeDias(funcTratado[0][0].adm)
            const data = new Date(this.dataParaAmericano(funcTratado[0][0].adm))

            const arr = []

            for(let i=0;i<diferencaDeDias;i++){
                arr.push((data.getDate() < 10? '0':'') + data.getDate() + '/' + (data.getMonth()+1 < 10? '0':'') + (data.getMonth() + 1) + '/' + (1900 + data.getYear()))
                if(this.tipo == 'DIA'){
                    data.setTime(data.getTime() + 1*1000*60*60*24)
                }
                if(this.tipo == 'MES'){
                    data.setMonth(data.getMonth + 1)
                }
                if(this.tipo == 'ANO'){
                    data.setFullYear(data.getYear() + 1)
                }
            }
            
            return arr
        },
        diferencaDeDias(inicio){
            inicio = inicio.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/,'$2/$1/$3')
            const inicioData = new Date(inicio)
            const fimData = new Date()
            
            if(this.tipo  == 'DIA'){
                return parseInt((fimData.getTime() - inicioData.getTime())/(1000*60*60*24))
            }

            if(this.tipo == 'MES'){
                return fimData.getMonth() - inicioData.getMonth() + 12*(fimData.getYear() - inicioData.getYear())
            }

            if(this.tipo == 'ANO'){
                return fimData.getYear() - inicioData.getYear()
            }
            
        },
        dataParaInt(data){
            return parseInt(data.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/,'$3$2$1'))
        },

        dataParaAmericano(data){
            return data.replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/,'$2/$1/$3')
        },
        inicioComZeros(valor){
            const arr = []

            for(let i=0;i<valor;i++){
                arr.push(undefined)
            }

            return arr
        },
        criarDadosFuncionario(funcionario,diferenca,dataInicial){
            const arr = this.inicioComZeros(diferenca)
            const admDATA = new Date(this.dataParaAmericano(funcionario[0].adm))
            const inicioDATA = new Date(this.dataParaAmericano(dataInicial))
            let inicioArr = 0
            if(this.tipo != 'DIA'){
                admDATA.setDate(1)
                inicioDATA.setDate(1)
            }

            while(admDATA - inicioDATA > 0){
                if(this.tipo == 'DIA'){
                    inicioDATA.setTime(inicioDATA.getTime() + 1*1000*60*60*24)
                }
                if(this.tipo == 'MES'){
                    inicioDATA.setMonth(inicioDATA.getMonth + 1)
                }
                if(this.tipo == 'ANO'){
                    inicioDATA.setFullYear(inicioDATA.getYear() + 1)
                }

                inicioArr++
            }
            const finalDATA = funcionario[0].desligamento == '' ? new Date() : new Date(this.dataParaAmericano(funcionario[0].desligamento))
            let casaAtual = 0
            
            while(admDATA - finalDATA < 0){
                if(casaAtual + 1 < funcionario.length){
                    const fimTrab = new Date(this.dataParaAmericano(funcionario[casaAtual + 1].inicio))
                    while(admDATA - fimTrab < 0){
                        if(this.tipo == 'DIA'){
                            admDATA.setTime(admDATA.getTime() + 1*1000*60*60*24)
                        }
                        if(this.tipo == 'MES'){
                            admDATA.setMonth(admDATA.getMonth + 1)
                        }
                        if(this.tipo == 'ANO'){
                            admDATA.setFullYear(admDATA.getYear() + 1)
                        }
                        
                        arr[inicioArr] = funcionario[casaAtual].salario

                        inicioArr++
                    }

                    casaAtual++
                }
                else{
                    for(let i=0;i< (finalDATA-admDATA)/(1*1000*60*60*24);i++){
                        arr[inicioArr] = funcionario[casaAtual].salario
                        inicioArr++
                    }

                    break
                }                
            }

        
            return arr
        },

        criarDados(raw){

            const funcTratado = this.tratarFunc(raw) //funciona

            const diferencaDeDias = this.diferencaDeDias(funcTratado[0][0].adm)
            const primeiraData = funcTratado[0][0].adm
            return funcTratado.map(f => {
                return {nome: f[0].nome,dados: this.criarDadosFuncionario(f,diferencaDeDias,primeiraData)}
            })

        },
        montarGrafico(dados,raw){
            const option = {}
            option.xAxis = {
                type:'category',
                data: this.criaAxisX(raw)
            }
            option.yAxis = {
                type: 'value',
                min:0
            }
            option.series = []
            option.legend = {
                type:'scroll',
                data: []
            }

            if(this.tooltip){
                option.tooltip = {
                    trigger: 'axis'
                }
            }

            option.toolbox = {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            }
            
            option.dataZoom = [{
                type: 'inside',
                start: 80,
                end: 100
            }, {
                start: 0,
                end: 20
            }]
            option.legend.data.push('Média')

            const media = []
            const mediaArr = []
            console.log('smooth', this.smooth)
            for(let f of dados){
                option.legend.data.push(f.nome)
                option.series.push({
                    name: f.nome,
                    type:'line',
                    data: f.dados,
                    smooth: this.smooth
                })

                media.push(f.dados)
            }

            for(let i=0;i < media[0].length;i++){
                let total = 0
                let validos = 0
                for(let valor of media){
                    total += valor[i] != undefined ? valor[i]: 0
                    validos += valor[i] != undefined ? 1:0
                }

                mediaArr.push(total/validos)
            }

            
            option.series.push({
                    name: 'Média',
                    type:'line',
                    data: mediaArr
             })
            return option
        }
    },
    
    mounted(){
        const graph = this.criarDados(this.cargos)
        this.graph = this.montarGrafico(graph,this.cargos)
    }

}
</script>

<style>

.tamanho{
  height:100%
}
</style>