<template>
<div class="area-total" :class="{'background':zoomBtn}">
  <div class="grafico grafico2">
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
     <e-chart class="preenche" :options="graficoAcumulado" autoresize></e-chart>
     </div>
  </div>
</div>
</template>



<script>
import btn from './botao.vue'

const math = require("mathjs");
var valores = {};
var periodo = {};

export default {
  data: () => ({
    graficoAcumulado: {},
    loading: true,
    operacao: "EXPANDIR",
    titulo: "Gráfico Acumulado",
    zoomBtn: true
  }),
  components:{
    btn
  },
  mounted() {
    console.log("acumulado OK!")
    fetch(this.$store.getters.link('grafico',this.$route.params))
      .then((resposta) => resposta.json())
      .then((obj) => {
        console.log('testando')
        valores = aplicaReajuste(obj);
        fetch(this.$store.getters.link('periodo',this.$route.params))
          .then((retorno) => retorno.json())
          .then((valor) => {
            periodo = valor;
            this.graficoAcumulado = montarGraficoAcumulado();
            this.loading = false;
          });
      }); //para produção
    /* let json = JSON.parse('{"nomeMes": "Fevereiro","orcado": 680000,"reajuste":1.0462,"data": [[11270.7,7785.48,5096.34,4462.01,8165.41,4980.93,3193.35,15148.12,708.07,14003,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[508.89,1713.9599999999998,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[8411.689999999999,10405.800000000001,8686,2240.98,16589.97,9728.26,12681.439999999999,9710.77,7608.79,18466.35,3752.28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}')
        valores = aplicaReajuste(json) 
        this.loading = false
        this.graficoAcumulado = montarGraficoAcumulado()      
        this.graficoDiario = montarGraficoDiario()*/ //para testes
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
    tamanho: function () {
      this.operacao = this.operacao == "EXPANDIR" ? "REDUZIR" : "EXPANDIR";
      modificarGrafico();
    },
  },
};

function modificarGrafico() {
  document.querySelectorAll(".titulo").forEach((span) => {
    span.classList.toggle("titulo-expandido");
  });
  const graf1 = document.querySelector(".grafico1");
  const graf2 = document.querySelector(".grafico2");
  if (graf1.classList.contains("graficoExtendido")) {
    graf1.classList.remove("graficoExtendido");
    graf2.classList.remove("graficoExtendido");
  } else {
    graf1.classList.add("graficoExtendido");
    graf2.classList.add("graficoExtendido");
  }
}

function sequenciaParaDias(dias) {
  const inicial = parseInt(periodo.range.inicio - 1);
  const fim = parseInt(periodo.range.totalDias);
  dias = dias.map((dia, index) => {
    if (index >= fim) {
      return dia - fim;
    }
    return parseInt(dia) + parseInt(inicial);
  });
  return dias;
}



function montarGraficoAcumulado() {
  let totalDias = valores.data[0].length;
  let dias = acumularValor(replicarValor(1, totalDias), 0);
  let diario = replicarValor(0, totalDias);
  let cor = [
    "#4287f5",
    "#e80721",
    "#079125",
    "#c9cc00",
    "#8a0685",
    "#7ca3cc",
    "#565e66",
    "#0e3012",
  ];
  let acumulado_separado = [];
  for (let barras of valores.data) {
    acumulado_separado.push(acumularValor(barras, 2));
    diario = somaDiaria(diario, barras);
  }

  let acumulado = acumularValor(diario, 2).map((x) => parseFloat(x).toFixed(2));

  let projecaoDiaMedio = resolveDiaMedio(diario);

  let diasParaResolver = [];
  let projecaoNaoNula = [];
  let maximo = Math.max.apply(null, acumulado);
  let i = -1;
  do {
    i++;
    projecaoNaoNula.push(acumulado[i]);
    diasParaResolver.push(i + 1);
  } while (acumulado[i] != maximo);

  let p_solve = resolvePolinomio(diasParaResolver, projecaoNaoNula);
  let l_solve = resolveLinear(diasParaResolver, projecaoNaoNula);
  let proj_linear = [];
  let proj_polinomial = [];

  while (projecaoNaoNula.length < totalDias) {
    projecaoNaoNula.push(0.0);
  }

  let title = criaTitulo(""); //acumulado

  let xAxis = [];
  adicionarX(xAxis, "category", false, sequenciaParaDias(dias));

  let yAxis = [];
  adicionarY(yAxis, "", true, 0, null, "value", "left", 100000);
  let legenda_template = [
    "Projeção Linear",
    "Projeção Polinomial",
    "Projeção Média",
    "Projeção Dia Médio",
    "Total",
  ];

  let tooltip = criarTooltip("axis");

  let series = [];
  let categorias = [];
  for (let index in acumulado_separado) {
    let atual = parseInt(index) + 1;
    categorias.unshift(atual + ".x");
    adicionarBarra(
      series,
      atual + ".x",
      "bar",
      0,
      "one",
      index >= cor.length ? "" : cor[index],
      acumulado_separado[index].map((x) => parseFloat(x).toFixed(2))
    ); //grafico do acumulado
  }

  for (let t of categorias) {
    legenda_template.unshift(t);
  }
  let legend = criarLegenda(legenda_template, "right", "right");
  if (l_solve) {
    proj_linear = dias.map((x) => x * l_solve[0][0] + l_solve[1][0]);
    adicionarLinha(
      series,
      "Projeção Linear",
      "line",
      0,
      "none",
      "#922428",
      transformaFloat(proj_linear, 2).map((x) => parseFloat(x).toFixed(2))
    ); //linha da projeção linear
  }
  if (p_solve) {
    proj_polinomial = dias.map(
      (x) => x * x * p_solve[0][0] + x * p_solve[1][0] + p_solve[2][0]
    );
    adicionarLinha(
      series,
      "Projeção Polinomial",
      "line",
      0,
      "none",
      "#535154",
      transformaFloat(proj_polinomial, 2).map((x) => parseFloat(x).toFixed(2))
    ); //linha da projeção polinomial
  }

  if (l_solve && p_solve) {
    adicionarLinha(
      series,
      "Projeção Média",
      "line",
      0,
      "none",
      "#DA7C30",
      operacaoVetor(
        proj_linear,
        proj_polinomial,
        (x, y) => (x + y) / 2
      ).map((x) => parseFloat(x).toFixed(2))
    ); //linha da projeção média
  }

  adicionarLinha(
    series,
    "Projeção Dia Médio",
    "line",
    0,
    "none",
    "",
    projecaoDiaMedio
  );

  adicionarPonto(series, "Total", "scatter", 0, 0.1, "", acumulado);

  let option = criarGrafico(title, xAxis, yAxis, legend, tooltip, series);
  console.log(option)
  return option;
}

function somaDiaria(vetor1, vetor2) {
  let resultado = [];
  {
    for (let index in vetor1) {
      resultado.push(vetor1[index] + vetor2[index]);
    }
  }
  return resultado;
}

function criarGrafico(title, xAxis, yAxis, legend, tooltip, series) {
  return { title, xAxis, yAxis, legend, tooltip, series };
}

function criaTitulo(text) {
  return { text };
}

function adicionarX(xAxis, type, silent, data) {
  xAxis.push({ type, silent, data });
}

function adicionarY(yAxis, name, scale, min, max, type, position, interval) {
  yAxis.push({ name, scale, min, max, type, position, interval });
}

function criarLegenda(data, align, position) {
  return { data, align, position };
}

function criarTooltip(trigger) {
  return { trigger };
}

function adicionarBarra(series, name, type, yAxisIndex, stack, color, data) {
  series.push({ name, type, yAxisIndex, stack, color, data });
}

function adicionarLinha(series, name, type, yAxisIndex, symbol, color, data) {
  series.push({ name, type, yAxisIndex, symbol, color, data });
}

function adicionarPonto(
  series,
  name,
  type,
  yAxisIndex,
  symbolSize,
  color,
  data
) {
  series.push({ name, type, yAxisIndex, symbolSize, color, data });
}

function transformaFloat(vetor, fixed) {
  return vetor.map((x) => parseFloat(x).toFixed(fixed));
}

function operacaoVetor(vet1, vet2, funcaoParametro) {
  let resultado = [];
  for (let index in vet1) {
    resultado.push(funcaoParametro(vet1[index], vet2[index]));
  }
  return resultado;
}

function somatorio(vet1, vet2, funcaoParametro) {
  let resultado = 0.0;
  for (let index in vet1) {
    resultado += funcaoParametro(vet1[index], vet2[index]);
  }
  return resultado;
}

function somaVetor(vetor, funcaoParametro, ...extras) {
  let resultado = 0.0;
  for (let valor of vetor) {
    resultado += parseFloat(funcaoParametro(valor, extras));
  }
  return resultado;
}

function resolveDiaMedio(valores) {
  let diasNaoNulos = 0.0;
  let media = 0.0;
  valores = valores.map((x) => parseFloat(x));
  for (let valor of valores) {
    media += parseFloat(valor);
    diasNaoNulos += parseFloat(valor) != 0.0 ? 1.0 : 0.0;
  }
  media = media / diasNaoNulos;
  let resultado = [];
  for (let index in valores) {
    if (index == 0) {
      resultado.push(valores[index]);
    } else {
      resultado.push(
        valores[index] == 0.0
          ? resultado[index - 1] + media
          : resultado[index - 1] + valores[index]
      );
    }
  }
  resultado = resultado.map((x) => x.toFixed(2));
  return resultado;
}

function resolvePolinomio(dias, valores) {
  let x1 = somaVetor(dias, (x) => x);
  let x2 = somaVetor(dias, (x) => x * x);
  let x3 = somaVetor(dias, (x) => x * x * x);
  let x4 = somaVetor(dias, (x) => x * x * x * x);
  let yi = somaVetor(valores, (x) => x);
  let xiyi = somatorio(dias, valores, (x, y) => x * y);
  let x2yi = somatorio(dias, valores, (x, y) => x * x * y);
  let resultado = null;
  let diasNaoNulos = somaVetor(dias, (x) => (x > 0 ? 1 : 0));

  if (
    math.det([
      [x4, x3, x2],
      [x3, x2, x1],
      [x2, x1, diasNaoNulos],
    ]) != 0
  ) {
    resultado = math.lusolve(
      [
        [x4, x3, x2],
        [x3, x2, x1],
        [x2, x1, diasNaoNulos],
      ],
      [x2yi, xiyi, yi]
    );
  }
  return resultado;
}

function resolveLinear(dias, valores) {
  let x1 = somaVetor(dias, (x) => x);
  let x2 = somaVetor(dias, (x) => x * x);
  let yi = somaVetor(valores, (x) => x);
  let xiyi = somatorio(dias, valores, (x, y) => x * y);
  let diasNaoNulos = somaVetor(dias, (x) => (x > 0 ? 1 : 0));
  let resultado = null;
  if (
    math.det([
      [x2, x1],
      [x1, diasNaoNulos],
    ]) != 0
  ) {
    resultado = math.lusolve(
      [
        [x2, x1],
        [x1, diasNaoNulos],
      ],
      [xiyi, yi]
    );
  }
  return resultado;
}

function replicarValor(valor, quantidade) {
  let retorno = [];
  while (quantidade > 0) {
    retorno.push(valor);
    quantidade--;
  }
  return retorno;
}

function acumularValor(valores, toFixed) {
  let retorno = [];
  let soma = 0;
  for (let val of valores) {
    soma += val;
    retorno.push(Number(soma).toFixed(toFixed));
  }
  return retorno;
}

function aplicaReajuste(obj) {
  let parametro = obj.reajuste;
  let resultado = [];
  for (let barra of obj.data) {
    resultado.push(barra.map((x) => x * parametro));
  }
  obj.data = resultado;
  return obj;
}
</script>


<style scoped>
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
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 30px 1fr;
}

.echarts {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.cabecalho{
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 2px;
  padding-left: 5px;
}
</style>