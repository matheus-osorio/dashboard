<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Média Salário</div>
      <div class="number">{{valor}} %</div>
    </div>
  </div>
</template>
<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Média Sinistralidade</div>
      <div class="number">R${{valor}}</div>
    </div>
  </div>
</template>


<script>
export default {
    props:['cargos','media','tipo'],
    data(){
        return {
            titulo: 'Gráfico Salário',
            graph: {},
            zoomBtn: true,
            valor:0
        }
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
                arr.push(-10000)
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
            console.log(admDATA)
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
                return {nome: f.nome,dados: this.criarDadosFuncionario(f,diferencaDeDias,primeiraData)}
            })

        },
        pegaMedia(dados){
            
            const media = []
            const mediaArr = []
            for(let f of dados){
                media.push(f.dados)
            }

            for(let i=0;i < media[0].length;i++){
                let total = 0
                let validos = 0
                for(let valor of media){
                    total += valor[i]
                    validos += valor[i] > 0? 1:0
                }

                mediaArr.push(total/validos)
            }

            console.log('media: ',mediaArr)
            return mediaArr[mediaArr.length-1]
        }
    },
    
    mounted(){
        const graph = this.criarDados(this.cargos)
        this.valor = this.pegaMedia(graph)
    }

}
</script>

<style>

</style>