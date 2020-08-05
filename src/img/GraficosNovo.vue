<template>
    <div>
	<meta charset="utf-8">
        <div class='areaGrafico'> 
            <div class = "grafico grafico1">
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
            <span class="titulo">Diário</span>
            <chart :options="graficoDiario" autoresize></chart>
            </div> 
            
            <div class = "grafico grafico2">
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
            <span class="titulo">Acumulado</span>
            <chart class='preenche' :options="graficoAcumulado" autoresize></chart>
            </div>
        </div>
        <button v-on:click = 'tamanho' class='botao'>{{operacao}}</button>
        </div>
  
</template>



<script>
const math = require('mathjs')
var valores = {}
var periodo = {}

export default {
  data: () => ({
    graficoDiario:{},
    graficoAcumulado:{},
    loading: true,
    operacao: "EXPANDIR"
  }),
  mounted(){
    
    fetch(this.$store.getters.link("graficosNovo", this.$route.params))
    .then(resposta => resposta.json())
    .then(obj => {
        valores = aplicaReajuste(obj) 
        fetch(this.$store.getters.link("periodo",this.$route.params))
        .then(retorno => retorno.json())
        .then(valor => {
            periodo = valor
            this.graficoAcumulado = montarGraficoAcumulado()      
            this.graficoDiario = montarGraficoDiario()
            this.loading = false
        })
    }) //para produção
   /* let json = JSON.parse('{"nomeMes": "Fevereiro","orcado": 680000,"reajuste":1.0462,"data": [[11270.7,7785.48,5096.34,4462.01,8165.41,4980.93,3193.35,15148.12,708.07,14003,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[508.89,1713.9599999999998,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[8411.689999999999,10405.800000000001,8686,2240.98,16589.97,9728.26,12681.439999999999,9710.77,7608.79,18466.35,3752.28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}')
        valores = aplicaReajuste(json) 
        this.loading = false
        this.graficoAcumulado = montarGraficoAcumulado()      
        this.graficoDiario = montarGraficoDiario()*/ //para testes
},
  methods: {
        tamanho: function (){
            this.operacao = this.operacao == 'EXPANDIR' ? 'REDUZIR' : 'EXPANDIR'
            modificarGrafico()
        }
  }
}

 

function modificarGrafico(){
  document.querySelectorAll('.titulo').forEach(span => {
      span.classList.toggle('titulo-expandido')
  })
  const graf1 = document.querySelector('.grafico1')
  const graf2 = document.querySelector('.grafico2')
  if(graf1.classList.contains('graficoExtendido')){
      graf1.classList.remove('graficoExtendido')
      graf2.classList.remove('graficoExtendido')
  }
  else{
      graf1.classList.add('graficoExtendido')
      graf2.classList.add('graficoExtendido')
  }
}

function montarVetorAcumulado(){
    let resultadoDiario = 0.0
    let retorno = []
    for(let index in valores.data[0]){
        for(let categoria of valores.data){
            resultadoDiario+= categoria[index]
        }
        retorno.push(resultadoDiario)
        resultadoDiario = 0.0
    }

    resultadoDiario = retorno[0]
    retorno[0] = 0
    for(let index in retorno){
        retorno[index] = retorno[index] + resultadoDiario
        resultadoDiario = retorno[index]
    }

    return retorno
}

function montarVetorDiario(){
    let resultadoDiario = 0.0
    let retorno = []
    for(let index in valores.data[0]){
        for(let categoria of valores.data){
            resultadoDiario+= categoria[index]
        }
        retorno.push(resultadoDiario)
        resultadoDiario = 0.0
    }
    return retorno
}

function fazerMediaDiario(){
    let ultimoDia = 0
    let somaDiaria = montarVetorDiario()

    for(let i = somaDiaria.length - 1; i>=0; i--){
        if(somaDiaria[i] > 0){
            ultimoDia = i + 1
            break
        }
    }
    
    const somaMes = somaDiaria.reduce((valor1, valor2) =>{return valor1+valor2})

    const media = somaMes/ultimoDia

    return replicarValor(media,somaDiaria.length)

}

function retornarLabel(series){
    
   return (param) => {
       let sum = 0
        series.forEach(item => {
            sum += item[param.dataIndex]
        })
        return Number(sum).toFixed(2)
   }
}


function divisoesParaDiario(vetor,divisao){
    let maior = vetor.reduce((valor, valor2 ) => Math.max(valor,valor2))
    maior = maior > (valores.orcado/10) ? maior : (valores.orcado/10)
    return Math.ceil((maior)/divisao) + 1
}

function divisoesParaAcumulado(vetor,divisao){
    let maior = vetor.reduce((valor, valor2 ) => Math.max(valor,valor2))
    return Math.ceil((maior)/divisao) + 1
}

function gerarDivisoes(divisao = 5000,funcaoRequerida = x => x,funcaoExtra = x => x){
    let retorno = funcaoRequerida(divisao)

    return funcaoExtra(retorno,divisao)
}

function sequenciaParaDias(dias){
   const inicial = parseInt(periodo.range.inicio - 1)
   const fim = parseInt(periodo.range.totalDias)
   dias = dias.map((dia,index) => {
       if(index >= fim){
           return dia - fim
       }
       return parseInt(dia) + parseInt(inicial)
   })
   console.log('dias:',dias)
   return dias
}

function montarGraficoDiario(){
  let titulo = criaTitulo('') //diário
  let totalDias = valores.data[0].length
  let xAxis = []
  adicionarX(xAxis, 'category',false,sequenciaParaDias(acumularValor(replicarValor(1,totalDias),0)))

  let yAxis = []
  
  let divisoes = Math.max(gerarDivisoes(5000,montarVetorDiario, divisoesParaDiario),10)* 5000

  adicionarY(yAxis,'Diario(R$)',true,0,divisoes,'value','left',5000)
  adicionarY(yAxis,'Acumulado(R$)',true,0,divisoes*10,'value','right',50000)


  let tooltip = criarTooltip('axis')
  let dadosLegenda = []
  let series = []
  let cor = ['#4287f5','#e80721','#079125','#c9cc00','#8a0685','#7ca3cc','#565e66','#0e3012']
  let valoresAcumulados = replicarValor(0,totalDias)
  let categoria = 0

  adicionarPonto(series,'Total','scatter',0,0.1,'',montarVetorDiario().map((numero) => {return Number(numero).toFixed(2)}))

  for(let index in valores.data){
     valoresAcumulados = somaDiaria(valoresAcumulados,valores.data[index])
     categoria++
     dadosLegenda.push(`${(categoria)}.x`)
     adicionarBarra(series,`${categoria}.x`,'bar',0,'one',cor[index] == undefined? '':cor[index],(valores.data[index]).map(x => parseFloat(x).toFixed(2))) 
  }

 
  /*series[series.length - 1].label = {
        show: true,
        rotate: 90,
        formatter: retornarLabel(valores.data),
        fontSize: 15,
        color: 'black',
        position: 'top'
  }*/

  

  

  dadosLegenda.push('Acumulado','Orçado','Média','Ideal')
  let legend = criarLegenda(dadosLegenda,'right','right')
  adicionarLinha(series,'Acumulado','line',1,'none','#535154',acumularValor(valoresAcumulados,2)) //Linha valor acumulado
  adicionarLinha(series,'Orçado','line',1,'none','#6B4C9A',replicarValor(valores.orcado,totalDias)) //Linha de valor orçado
  adicionarLinha(series,'Média','line',0,'none','#922428',fazerMediaDiario()) //Linha de média
  adicionarLinha(series,'Ideal','line',0,'none','#948B3D',replicarValor(Number(valores.orcado/31).toFixed(2),totalDias)) //linha de valor ideal(orçado/31)

  let option = criarGrafico(titulo,xAxis,yAxis,legend,tooltip, series)
  return option
}

function montarGraficoAcumulado(){
  let valor = 0
   
  let totalDias = valores.data[0].length
  let dias = acumularValor(replicarValor(1,totalDias),0)
  let diario = replicarValor(0,totalDias)
  let cor = ['#4287f5','#e80721','#079125','#c9cc00','#8a0685','#7ca3cc','#565e66','#0e3012']
  let acumulado_separado = []
  for(let barras of valores.data){
      acumulado_separado.push(acumularValor(barras,2))
      diario = somaDiaria(diario,barras)
  }
  
  

  let acumulado = acumularValor(diario,2).map((x) => parseFloat(x).toFixed(2))
  
  let projecaoDiaMedio = resolveDiaMedio(diario)
  
 
  let diasParaResolver = []
  let projecaoNaoNula = []
  let maximo = Math.max.apply(null,acumulado)
  let i=-1
  do{
     i++
     projecaoNaoNula.push(acumulado[i])
     diasParaResolver.push(i+1)
  }while(acumulado[i]!=maximo)
 
  let p_solve = resolvePolinomio(diasParaResolver,projecaoNaoNula)
  let l_solve = resolveLinear(diasParaResolver,projecaoNaoNula)
  let proj_linear = []
  let proj_polinomial = []

  while(projecaoNaoNula.length<totalDias){
      projecaoNaoNula.push(0.0)
  }
 
  let title = criaTitulo('') //acumulado
  
  let divisoes = Math.max(gerarDivisoes(100000,montarVetorAcumulado,divisoesParaAcumulado),8)* 100000

  let xAxis = []
  adicionarX(xAxis,'category',false,sequenciaParaDias(dias))

  let yAxis = []
  adicionarY(yAxis,'Bruto(R$)',true,0,null,'value','left',100000)
  let legenda_template = ['Projeção Linear','Projeção Polinomial','Projeção Média','Projeção Dia Médio','Total']

  let tooltip = criarTooltip('axis')
   
 
  let series = []
  let categorias = []
  for(let index in acumulado_separado){
      let atual = parseInt(index) + 1
      categorias.unshift(atual + '.x')
      adicionarBarra(series,atual + '.x','bar',0,'one',index >= cor.length? '': cor[index],(acumulado_separado[index]).map((x) => parseFloat(x).toFixed(2))) //grafico do acumulado
      
  }
  
  for(let t of categorias){
      legenda_template.unshift(t)
  }
  let legend = criarLegenda(legenda_template,'right','right')
  if(l_solve){
      proj_linear = dias.map((x) =>x*l_solve[0][0] + l_solve[1][0])
      adicionarLinha(series,'Projeção Linear','line',0,'none','#922428',transformaFloat(proj_linear,2).map((x) => parseFloat(x).toFixed(2))) //linha da projeção linear
  }
  if(p_solve){
      proj_polinomial = dias.map((x) => x*x*p_solve[0][0] + x*p_solve[1][0] + p_solve[2][0])
      adicionarLinha(series,'Projeção Polinomial','line',0,'none','#535154',transformaFloat(proj_polinomial,2).map((x) => parseFloat(x).toFixed(2))) //linha da projeção polinomial
      
  }
 
  if(l_solve && p_solve){
      adicionarLinha(series,'Projeção Média','line',0,'none','#DA7C30',operacaoVetor(proj_linear,proj_polinomial,(x,y) => (x+y)/2).map((x) => parseFloat(x).toFixed(2))) //linha da projeção média
  }
 
  adicionarLinha(series,'Projeção Dia Médio','line',0,'none','',projecaoDiaMedio)


  adicionarPonto(series,'Total','scatter',0,0.1,'',acumulado)


  let option = criarGrafico(title,xAxis,yAxis,legend,tooltip,series)
  return option
}

function somaDiaria(vetor1,vetor2){
    let resultado = []
    {
        for(let index in vetor1){
            resultado.push((vetor1[index] + vetor2[index]))
        }
    }
    return resultado
}

function criarGrafico(title,xAxis,yAxis,legend,tooltip,series){
    return {title,xAxis,yAxis,legend,tooltip,series}
}

function criaTitulo(text){
    return {text}
}

function adicionarX(xAxis,type,silent,data){
    xAxis.push({type,silent,data})
}


function adicionarY(yAxis,name, scale, min, max, type, position, interval){
    yAxis.push({name,scale,min, max,type, position, interval})
}


function criarLegenda(data, align, position){
    return {data, align, position}
}

function criarTooltip(trigger){return {trigger}}

function adicionarBarra(series, name, type, yAxisIndex,stack,color,data){
    series.push({name,type,yAxisIndex,stack,color, data})
}

function adicionarLinha(series,name,type,yAxisIndex,symbol,color,data){
    series.push({name,type,yAxisIndex,symbol,color,data})
}

function adicionarPonto(series,name,type,yAxisIndex,symbolSize,color,data){
    series.push({name,type,yAxisIndex,symbolSize,color,data})
}


function transformaFloat(vetor,fixed){
    return vetor.map((x) => parseFloat(x).toFixed(fixed))
}

function operacaoVetor(vet1, vet2, funcaoParametro){
    let resultado = []
    for(let index in vet1){
        resultado.push(funcaoParametro(vet1[index],vet2[index]))
    }
    return resultado
}

function somatorio(vet1, vet2, funcaoParametro){
    let resultado = 0.0
    for(let index in vet1){
        resultado += funcaoParametro(vet1[index],vet2[index])
    }
    return resultado
}


function somaVetor(vetor, funcaoParametro, ...extras){
    let resultado = 0.0
    for(let valor of vetor){
        resultado += parseFloat(funcaoParametro(valor, extras))
    }
    return resultado
}

function resolveDiaMedio(valores){
    let diasNaoNulos = 0.0
    let media = 0.0
    valores = valores.map((x) => parseFloat(x))
    for(let valor of valores){
        media += parseFloat(valor)
        diasNaoNulos += parseFloat(valor)!=0.0?1.0:0.0
    }
    media = media/diasNaoNulos
    let resultado = []
    for(let index in valores){
        if(index == 0){
            resultado.push(valores[index])
        }
        else{
            resultado.push(valores[index] == 0.0? resultado[index-1] + media: resultado[index-1] + valores[index])
        }
    }
    resultado = resultado.map(x => x.toFixed(2))
    return resultado
}

function resolvePolinomio(dias, valores){
    let x1 = somaVetor(dias,(x)=>x)
    let x2 = somaVetor(dias,(x)=>x*x)
    let x3 = somaVetor(dias,(x)=>x*x*x)
    let x4 = somaVetor(dias,(x)=>x*x*x*x)
    let yi = somaVetor(valores,(x)=>x)
    let xiyi = somatorio(dias,valores,(x,y)=>x*y)
    let x2yi = somatorio(dias,valores,(x,y) => x*x*y)
    let resultado = null
    let diasNaoNulos = somaVetor(dias,(x)=> x>0?1:0)
    
    if(math.det([[x4,x3,x2], [x3,x2,x1], [x2,x1,diasNaoNulos]]) != 0){
        resultado =  math.lusolve([[x4,x3,x2], [x3,x2,x1], [x2,x1,diasNaoNulos]], [x2yi, xiyi, yi])
    }
    return resultado
}

function resolveLinear(dias, valores){
    let x1 = somaVetor(dias,(x)=>x)
    let x2 = somaVetor(dias,(x)=>x*x)
    let yi = somaVetor(valores,(x)=>x)
    let xiyi = somatorio(dias,valores,(x,y)=>x*y)
    let diasNaoNulos = somaVetor(dias,(x)=> x>0?1:0)
    let resultado = null
    if(math.det([[x2, x1], [x1, diasNaoNulos]]) != 0){
        resultado = math.lusolve([[x2, x1], [x1, diasNaoNulos]], [xiyi, yi])
    } 
    return resultado
}

function replicarValor(valor, quantidade){
    let retorno = []
    while(quantidade>0){
        retorno.push(valor)
        quantidade--
    }
    return retorno
}

function acumularValor(valores,toFixed){
    let retorno = []
    let soma = 0
    for(let val of valores){
        soma += val
        retorno.push(Number(soma).toFixed(toFixed))
    }
    return retorno
}

function aplicaReajuste(obj){
    let parametro = obj.reajuste
    let resultado = []
    for(let barra of obj.data){
        resultado.push(barra.map((x) => x*parametro)) 
    }
    obj.data = resultado
    return obj
}

</script>


<style scoped>


canvas{
    width: 100%;
    height: 100%;
}

body {
    padding: 0px;
    margin: 0px;
}


.botao{
    height: 32px;
    position: relative;
    box-sizing: border-box;
    background-color: #229EC1;
    border-color: black;
    border-radius:2px;
    font-size:1.2em;
    margin-top: 40px;
    margin-left: 47%;
    border:1px;
    border-style: solid;
    z-index: 100;
}

.botao:hover{
    background-color: #1DCCFD;
}

.botao:active{
    border-color: #229EC1;
}

.grafico{
    padding: 0px;
    display: inline-block;
    width: 50%;
    height: 530px;
}

.areaGrafico{
    padding: 0px;
    margin: 0px;
    display: block;
}


.graficoExtendido{
    width: calc(100% - 1px) !important;
    margin: 0 auto;
    height: 900px;
}

 .grafico1{
    margin-left: 0px;
    border-right: 100px;
    text-align: left;
  }

  .grafico2{
    border-left: 100px;
  }

  .echarts{
    width: 100%;
    height:100%;
  }


  .titulo{
    display: block;
    text-align: center;
    font-size: 1.5em;
 }

 .titulo-expandido{
     position: relative;
     font-size: 2.5em;
     margin-bottom: 10px;
 }

@media (max-width: 1000px) {
    .grafico{
        display: block;
        width: calc(100% - 1px) !important;
        margin: 0 auto;
        height: 800px;
    }
    
}
</style>