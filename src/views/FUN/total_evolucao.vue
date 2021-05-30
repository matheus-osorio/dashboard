<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Tempo por Função</div>
      <div class="number">{{valor.toFixed(2)}} Dias<br/>({{(valor/365).toFixed(2)}} Ano(s))</div>
    </div>
  </div>
</template>


<script>

export default {
    props:['cargos','media','tipo'],
    data(){
        return {
            valor:0,
            graph: {},
            zoomBtn: true
        }
    },
    components:{
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
            raw = raw.map(f => {
                const valores = f.historico.reduce((dados,prof) => {
                    if(dados[prof.cargo] == undefined){
                        dados[prof.cargo] = dados.num
                        prof.num = dados.num
                        dados.num++
                    }
                    else{
                        prof.num = dados[prof.cargo]
                    }

                    dados.arr.push(prof)

                    return dados
                },{num:1,arr:[]})

                f.historico = valores.arr

                return f
            })
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
                        
                        arr[inicioArr] = funcionario[casaAtual].num

                        inicioArr++
                    }

                    casaAtual++
                }
                else{
                    for(let i=0;i< (finalDATA-admDATA)/(1*1000*60*60*24);i++){
                        arr[inicioArr] = funcionario[casaAtual].num
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
        criaAxisX(raw){
            const funcTratado = this.tratarFunc(raw) //funciona


            const diferencaDeDias = this.diferencaDeDias(funcTratado[0][0].adm)
            const data = new Date(this.dataParaAmericano(funcTratado[0][0].adm))

            const arr = []

            for(let i=0;i<diferencaDeDias;i++){
                arr.push((data.getDate() < 10? '0':'') + data.getDate() + '/' + (data.getMonth()+1 < 10? '0':'') + (data.getMonth()+1) + '/' + (1900 + data.getYear()))
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
        montarGrafico(dados,raw){
            const option = {}
            option.xAxis = {
                type:'category',
                data: this.criaAxisX(raw)
            }
            option.yAxis = {
                type: 'value',
                min: 0
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
            
            for(let f of dados){
                option.legend.data.push(f.nome)
                option.series.push({
                    name: f.nome,
                    type:'line',
                    data: f.dados
                })

            }

            
            return option
        }
    },
    
    mounted(){
        const graph = this.criarDados(this.cargos)
        const promo = []
        const dias = []
        for(let pessoa of graph){
            let filt = pessoa.dados.filter((d) => {
                return d != undefined
            })
            let pos =( Array.from(new Set(filt))).length
            promo.push(pos)
            dias.push(filt.length)
        }
        const sum = (s,p) => s + p
        this.valor = 1/(promo.reduce(sum)/(dias.reduce(sum)))
    }

}
</script>


<style>

</style>